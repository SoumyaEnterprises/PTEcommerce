import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { ToastContainer } from "@/components/ui/toast-container";

// Note: this project is designed to use next/font with Google's Inter
// and Space Grotesk (see README "Fonts" section for the exact code) to
// match the storefront's typography. That import is commented out here
// because the build sandbox used to generate this code has no outbound
// access to fonts.googleapis.com — uncomment it once you build locally
// or in CI with normal internet access.
//
// import { Inter, Space_Grotesk } from "next/font/google";
// const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["300","400","500","600","700","800","900"] });
// const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["400","500","600","700"] });
// Then add `${inter.variable} ${spaceGrotesk.variable}` to the <body> className below.

export const metadata: Metadata = {
  title: "PT. HI-TECH — Admin Portal",
  description: "Product, category, and brand management for the PT. HI-TECH storefront.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <QueryProvider>
          {children}
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}
