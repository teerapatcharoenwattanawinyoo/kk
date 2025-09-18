"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  // const { theme = "light" } = useTheme();

  return (
    <Sonner
      className="toaster group shadow-sm"
      style={
        {
          "--normal-bg": "var(--primary)",
          "--normal-text": "var(--primary-foreground)",
          "--normal-border": "var(--primary)",
          "--success-bg": "oklch(76% 0.177 163.223)" /* สีเขียว solid */,
          "--success-text": "white",
          "--success-border": "oklch(76% 0.177 163.223)",
          "--error-bg": "var(--destructive)" /* สีแดง solid */,
          "--error-text": "var(--destructive-foreground)",
          "--error-border": "var(--destructive)",
          "--warning-bg": "oklch(82% 0.189 84.429)" /* สีเหลือง/ส้ม solid */,
          "--warning-text": "white",
          "--warning-border": "oklch(82% 0.189 84.429)",
          "--info-bg": "var(--primary)" /* สีน้ำเงิน solid */,
          "--info-text": "var(--primary-foreground)",
          "--info-border": "var(--primary)",
          fontFamily: "Kanit, sans-serif",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
