"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

/** Result of claiming the pending CSV drop for `/portfolio/uploading`. */
export type PendingUploadClaim =
  | { kind: "none" }
  /** React Strict Mode’s second effect pass: batch already claimed, do not redirect home. */
  | { kind: "claimed" }
  | { kind: "start"; files: File[] };

const PendingUploadContext = createContext<{
  pendingFiles: File[] | null;
  setPendingFiles: (files: File[] | null) => void;
  claimPendingUpload: () => PendingUploadClaim;
  releaseUploadBatch: () => void;
  isProcessing: boolean;
  setProcessing: (value: boolean) => void;
} | null>(null);

interface PendingUploadProviderProps {
  children: React.ReactNode;
  /** For tests: seed the queue as if `setPendingFiles` ran before the uploading route mounts. */
  initialPendingFiles?: File[] | null;
}

export function PendingUploadProvider({
  children,
  initialPendingFiles = null,
}: PendingUploadProviderProps) {
  const [pendingFiles, setPendingFilesState] = useState<File[] | null>(
    () => initialPendingFiles ?? null
  );
  const [isProcessing, setProcessing] = useState(false);
  const pendingRef = useRef<File[] | null>(initialPendingFiles ?? null);

  /** Files moved out of the queue for the current upload navigation. */
  const activeBatchRef = useRef<{ id: number; files: File[] } | null>(null);
  /** Batch id for which the uploading route has already started `uploadFiles` (dedupes Strict Mode). */
  const pipelineStartedForBatchIdRef = useRef<number | null>(null);
  const nextBatchIdRef = useRef(0);

  const setPendingFiles = useCallback((files: File[] | null) => {
    // New drop from home: reset any leaked active batch (e.g. release skipped) so the
    // next visit to /portfolio/uploading can claim again instead of returning "claimed".
    if (files !== null && files.length > 0) {
      activeBatchRef.current = null;
      pipelineStartedForBatchIdRef.current = null;
      setProcessing(false);
    }
    pendingRef.current = files;
    setPendingFilesState(files);
  }, []);

  const claimPendingUpload = useCallback((): PendingUploadClaim => {
    const active = activeBatchRef.current;
    if (
      active !== null &&
      pipelineStartedForBatchIdRef.current === active.id
    ) {
      return { kind: "claimed" };
    }

    const files = pendingRef.current;
    if (!files?.length) {
      return { kind: "none" };
    }

    pendingRef.current = null;
    setPendingFilesState(null);
    nextBatchIdRef.current += 1;
    const id = nextBatchIdRef.current;
    activeBatchRef.current = { id, files };
    pipelineStartedForBatchIdRef.current = id;
    setProcessing(true);
    return { kind: "start", files };
  }, []);

  const releaseUploadBatch = useCallback(() => {
    activeBatchRef.current = null;
    pipelineStartedForBatchIdRef.current = null;
    setProcessing(false);
  }, []);

  return (
    <PendingUploadContext.Provider
      value={{
        pendingFiles,
        setPendingFiles,
        claimPendingUpload,
        releaseUploadBatch,
        isProcessing,
        setProcessing,
      }}
    >
      {children}
    </PendingUploadContext.Provider>
  );
}

export function usePendingUpload() {
  const ctx = useContext(PendingUploadContext);
  if (!ctx) throw new Error("usePendingUpload must be used within PendingUploadProvider");
  return ctx;
}
