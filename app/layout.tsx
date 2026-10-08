import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkUp - Cross-Departmental Service Tracking | Government of India",
  description: "Cross-Departmental Service Request Tracking for Multi-Department Government Services - Building Permit Approval System",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
