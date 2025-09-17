import React from "react";

interface ChevronLeftIconProps {
  className?: string;
}

export const ChevronLeftIcon: React.FC<ChevronLeftIconProps> = ({
  className = "h-4 w-4",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
};
