import { useLayoutEffect } from "react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import {
  PendingUploadProvider,
  usePendingUpload,
} from "@/app/contexts/PendingUploadContext";
import type { StoredPortfolioSummary } from "@/lib/types";
import UploadingPage from "../page";

const replaceMock = vi.hoisted(() => vi.fn());
const uploadFilesMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock("@/hooks/usePortfolioLibrary", () => ({
  usePortfolioLibrary: () => ({
    uploadFiles: uploadFilesMock,
    setError: vi.fn(),
  }),
}));

vi.mock("@/app/components/skeletons", () => ({
  DashboardSkeleton: () => null,
}));

const uploadedSummary: StoredPortfolioSummary = {
  id: "test-portfolio-id",
  name: "alpha",
  sourceFileName: "alpha.csv",
  uploadedAt: "2026-03-18T00:00:00.000Z",
  lastViewedAt: "2026-03-18T00:00:00.000Z",
  positionCount: 1,
};

function makeCsvFile(name: string) {
  return new File(["x"], name, { type: "text/csv" });
}

function PrimeUpload({ file, round }: { file: File; round: number }) {
  const { setPendingFiles } = usePendingUpload();
  useLayoutEffect(() => {
    setPendingFiles([file]);
  }, [file, round, setPendingFiles]);
  return <UploadingPage key={round} />;
}

describe("UploadingPage", () => {
  beforeEach(() => {
    replaceMock.mockClear();
    uploadFilesMock.mockReset();
    uploadFilesMock.mockResolvedValue({
      uploadedPortfolios: [uploadedSummary],
      failedUploads: [],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("replaces to portfolio when upload succeeds", async () => {
    const file = makeCsvFile("alpha.csv");

    render(
      <PendingUploadProvider initialPendingFiles={[file]}>
        <UploadingPage />
      </PendingUploadProvider>
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/portfolio/test-portfolio-id");
    });
    expect(uploadFilesMock).toHaveBeenCalledTimes(1);
    expect(uploadFilesMock.mock.calls[0][0]).toEqual([file]);
  });

  it("supports a second upload on the same provider after the first completes", async () => {
    const file1 = makeCsvFile("one.csv");
    const file2 = makeCsvFile("two.csv");
    const summary2 = { ...uploadedSummary, id: "portfolio-two" };

    uploadFilesMock
      .mockResolvedValueOnce({
        uploadedPortfolios: [uploadedSummary],
        failedUploads: [],
      })
      .mockResolvedValueOnce({
        uploadedPortfolios: [summary2],
        failedUploads: [],
      });

    const { rerender } = render(
      <PendingUploadProvider>
        <PrimeUpload file={file1} round={1} />
      </PendingUploadProvider>
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/portfolio/test-portfolio-id");
    });
    expect(uploadFilesMock).toHaveBeenCalledTimes(1);

    replaceMock.mockClear();

    rerender(
      <PendingUploadProvider>
        <PrimeUpload file={file2} round={2} />
      </PendingUploadProvider>
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/portfolio/portfolio-two");
    });
    expect(uploadFilesMock).toHaveBeenCalledTimes(2);
  });

  it("sends bookmarked /portfolio/uploading with no pending files home", async () => {
    render(
      <PendingUploadProvider>
        <UploadingPage />
      </PendingUploadProvider>
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/");
    });
    expect(uploadFilesMock).not.toHaveBeenCalled();
  });
});
