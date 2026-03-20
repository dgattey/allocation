"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DashboardSkeleton } from "@/app/components/skeletons";
import { usePendingUpload } from "@/app/contexts/PendingUploadContext";
import { usePortfolioLibrary } from "@/hooks/usePortfolioLibrary";

export default function UploadingPage() {
  const router = useRouter();
  const { claimPendingUpload, releaseUploadBatch } = usePendingUpload();
  const { uploadFiles, setError } = usePortfolioLibrary();

  const routerRef = useRef(router);
  const uploadFilesRef = useRef(uploadFiles);
  const setErrorRef = useRef(setError);

  useLayoutEffect(() => {
    routerRef.current = router;
    uploadFilesRef.current = uploadFiles;
    setErrorRef.current = setError;
  });

  useEffect(() => {
    const claim = claimPendingUpload();

    if (claim.kind === "none") {
      routerRef.current.replace("/");
      return;
    }

    if (claim.kind === "claimed") {
      return;
    }

    uploadFilesRef.current(claim.files)
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
      })
      .finally(() => {
        releaseUploadBatch();
      });
  }, [claimPendingUpload, releaseUploadBatch]);

  return <DashboardSkeleton enableIntroAnimation={false} />;
}
