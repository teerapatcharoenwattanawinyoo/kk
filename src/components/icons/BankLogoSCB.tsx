// src/components/icons/BankLogoSCB.tsx
import Image from "next/image";

export const BankLogoSCB = ({
  size = 43,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <Image
    src="/assets/images/icons/bank/scb-bank.png"
    alt="SCB Logo"
    width={size}
    height={size}
    className={className}
    style={{ borderRadius: "50%" }}
    priority
  />
);
