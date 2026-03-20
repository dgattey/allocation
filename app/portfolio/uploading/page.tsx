"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DashboardSkeleton } from "@/app/components/skeletons";
import { usePendingUpload } from "@/app/contexts/PendingUploadContext";
import { usePortfolioLibrary } from "@/hooks/usePortfolioLibrary";

/**
 * One upload pipeline per navigation to this route. Survives React Strict Mode
 * (effect runs twice across remounts; the first pass consumes pending files).
 * Empty-file effect passes must not call `replace("/")` while that promise exists.
 */
let inFlightUpload: Promise<unknown> | null = null;

export default function UploadingPage() {
  const router = useRouter();
  const { takePendingFiles, setProcessing } = usePendingUpload();
  const { uploadFiles, setError } = usePortfolioLibrary();

  const routerRef = useRef(router);
  const uploadFilesRef = useRef(uploadFiles);
  const setErrorRef = useRef(setError);
  const setProcessingRef = useRef(setProcessing);

  useLayoutEffect(() => {
    routerRef.current = router;
    uploadFilesRef.current = uploadFiles;
    setErrorRef.current = setError;
    setProcessingRef.current = setProcessing;
  });

  useEffect(() => {
    const files = takePendingFiles();

    if (!files?.length) {
      if (!inFlightUpload) {
        routerRef.current.replace("/");
      }
      return;
    }

    const uploadWork = uploadFilesRef.current(files)
      .then(({ uploadedPortfolios, failedUploads }) => {
        if (failedUploads.length > 0) {
          setErrorRef.current(
            failedUploads
              .map(({ fileName, reason }) => `${fileName}: ${reason}`)
              .join(" | ")
          );
        } else if (uploadedPortfolios.length === 0) {
          setErrorRef.current("Select at least one Fidelity positions CSV.");
        }

        if (uploadedPortfolios.length > 0) {
          routerRef.current.replace(
            `/portfolio/${uploadedPortfolios[uploadedPortfolios.length - 1].id}`
          );
        } else {
          routerRef.current.replace("/");
        }
      })
      .catch(() => {
        routerRef.current.replace("/");
      });

    const withCleanup = uploadWork.finally(() => {
      inFlightUpload = null;
      setProcessingRef.current(false);
    });
    inFlightUpload = withCleanup;
  }, [takePendingFiles]);

  return <DashboardSkeleton enableIntroAnimation={false} />;
}
