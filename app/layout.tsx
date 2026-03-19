import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter, SiteFooterFallback } from "./components/SiteFooter";
import { PendingUploadProvider } from "./contexts/PendingUploadContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your portfolio",
  description: "Visualize your portfolio allocation from Fidelity exports",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <PendingUploadProvider>
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          <Suspense fallback={<SiteFooterFallback />}>
            <SiteFooter />
          </Suspense>
        </PendingUploadProvider>
      </body>
    </html>
  );
}
