import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import ClientLayoutShell from "./ClientLayoutShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JUIT Admin Portal",
  description: "Student & Teacher Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientLayoutShell>{children}</ClientLayoutShell>
        </Providers>
      </body>
    </html>
  );
}
