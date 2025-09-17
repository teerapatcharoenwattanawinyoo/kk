import React from "react";

interface DeleteIconProps {
  width?: number;
  height?: number;
  className?: string;
  fill?: string;
}

export const DeleteIcon: React.FC<DeleteIconProps> = ({
  width = 16,
  height = 16,
  className = "",
  fill = "#6b7280",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
