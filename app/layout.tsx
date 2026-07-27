import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    default: "Imojuto—University Maintenance and Service Request Platform",
    template: "%s | Imojuto",
  },
  description:
    "Imojuto is a university maintenance and service request platform that provides a premium service desk for campus faults, maintenance assignments, status trails, notifications and administrator reporting.",
  keywords: [
    "Imojuto",
    "University Maintenance",
    "Service Request",
    "Campus Faults",
    "Maintenance Assignments",
    "Status Trails",
    "Notifications",
    "Administrator Reporting",
    "Maintenance Management",
    "Service Desk",
    "Campus Maintenance",
    "Service Request Platform",
    "Maintenance Platform",
    "Service Request Management",
    "Maintenance System",
    "Campus Service Desk",
    "Campus Maintenance System",
    "Campus Service Request Platform",
    "Campus Service Request Management",
    "Campus Service Request System",
  ],
  openGraph: {
    images: "/opengraph-image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`min-h-full bg-[#f7f4ef] text-[#27241f] antialiased scroll-smooth ${montserrat.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
