import { AuthLayout } from "@/components/auth-components/layouts/auth-layout";
import type React from "react";

export default function AuthPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthLayout>{children}</AuthLayout>;
}
