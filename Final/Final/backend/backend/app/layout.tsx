'use client'

import { SessionProvider } from "next-auth/react";
// @ts-ignore: CSS side-effect import has no type declarations in this project
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
