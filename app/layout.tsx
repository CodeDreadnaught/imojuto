import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Imojuto",
  description: "University maintenance and service request platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-stone-50 text-stone-950">{children}</body>
    </html>
  );
}
