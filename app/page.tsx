"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { PortfolioLibraryNav } from "./components/PortfolioLibraryNav";
import { UploadView } from "./components/UploadView";
import { usePortfolioLibrary } from "@/hooks/usePortfolioLibrary";

export default function Home() {
  const router = useRouter();
  const {
    portfolios,
    isUploading,
    error,
    uploadFiles,
    removePortfolioById,
  } = usePortfolioLibrary();

  async function handleFilesSelect(files: File[]) {
    const { uploadedPortfolios } = await uploadFiles(files);
    if (uploadedPortfolios.length > 0) {
      router.push(
        `/portfolio/${uploadedPortfolios[uploadedPortfolios.length - 1].id}`
      );
    }
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-8">
        <section className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface shadow-[var(--shadow)]">
            <Image
              src="/icon.svg"
              alt=""
              width={32}
              height={32}
              aria-hidden="true"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Portfolio picker
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-text-primary md:text-4xl">
              Manage portfolio files
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-text-muted md:text-base">
              Pick a saved Fidelity export to visualize, remove one you no
              longer need, or import more files. File management happens here;
              the portfolio route stays focused on visualization.
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-[30px] border border-border/70 bg-surface shadow-[var(--shadow-lg)]">
          <div className="p-6 md:p-8">
            <PortfolioLibraryNav
              portfolios={portfolios}
              onRemovePortfolio={removePortfolioById}
            />
          </div>
          <div className="border-t border-border-subtle px-6 py-6 md:px-8 md:py-8">
            <UploadView
              onFilesSelect={handleFilesSelect}
              error={error}
              isLoading={isUploading}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
