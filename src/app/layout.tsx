// src/app/layout.tsx
import type { Metadata } from "next";
// අලුත් ෆොන්ට්ස් Import කරන්න
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "FutureJobs LK",
  description: "Find your next career opportunity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> {/* Dark mode enable කරන්න */}
      {/* අලුත් ෆොන්ට්ස් සහ පසුබිම සකස් කිරීම */}
      <body className="font-body bg-futuristic-bg text-gray-200 min-h-screen selection:bg-neon-blue selection:text-black">
        {children}
      </body>
    </html>
  );
}