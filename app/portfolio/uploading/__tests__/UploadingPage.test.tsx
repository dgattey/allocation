import { StrictMode } from "react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { PendingUploadProvider } from "@/app/contexts/PendingUploadContext";
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

  it("under React StrictMode calls uploadFiles once and still reaches the portfolio", async () => {
    const file = makeCsvFile("beta.csv");

    render(
      <PendingUploadProvider initialPendingFiles={[file]}>
        <StrictMode>
          <UploadingPage />
        </StrictMode>
      </PendingUploadProvider>
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/portfolio/test-portfolio-id");
    });
    expect(uploadFilesMock).toHaveBeenCalledTimes(1);
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
