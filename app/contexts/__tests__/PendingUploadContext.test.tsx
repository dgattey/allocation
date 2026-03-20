import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { PendingUploadProvider, usePendingUpload } from "../PendingUploadContext";

function wrapper({ children }: { children: React.ReactNode }) {
  return <PendingUploadProvider>{children}</PendingUploadProvider>;
}

describe("PendingUploadProvider", () => {
  it("lets setPendingFiles clear a stuck batch so the next claim can start again", () => {
    const { result } = renderHook(() => usePendingUpload(), { wrapper });
    const file1 = new File(["a"], "a.csv", { type: "text/csv" });
    const file2 = new File(["b"], "b.csv", { type: "text/csv" });

    act(() => {
      result.current.setPendingFiles([file1]);
    });
    expect(result.current.claimPendingUpload()).toEqual({
      kind: "start",
      files: [file1],
    });

    // Simulate release never running (bug / interrupted navigation)
    act(() => {
      result.current.setPendingFiles([file2]);
    });
    expect(result.current.claimPendingUpload()).toEqual({
      kind: "start",
      files: [file2],
    });
  });

  it("returns claimed on a second claim for the same batch without a new setPendingFiles", () => {
    const { result } = renderHook(() => usePendingUpload(), { wrapper });
    const file1 = new File(["a"], "a.csv", { type: "text/csv" });

    act(() => {
      result.current.setPendingFiles([file1]);
    });
    expect(result.current.claimPendingUpload().kind).toBe("start");
    expect(result.current.claimPendingUpload().kind).toBe("claimed");
  });
});
