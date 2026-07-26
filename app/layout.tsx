import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

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
    <html lang="en" className="h-full">
      <body
        className={`min-h-full bg-[#f7f4ef] text-[#27241f] antialiased scroll-smooth ${montserrat.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
