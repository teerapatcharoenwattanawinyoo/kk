import React from "react";

interface CardIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export const CardIcon: React.FC<CardIconProps> = ({
  className = "w-5 h-5",
  width = 24,
  height = 19,
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.3735 0H2.00983C1.00568 0 0.19165 0.89543 0.19165 2V14C0.19165 15.1046 1.00568 16 2.00983 16H13.1917V14H2.19165V7H20.1917V10H22.1917V2C22.1917 0.89543 21.3776 0 20.3735 0ZM20.1917 5V2H2.19165V5H20.1917Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.7371 12.8182H16.6877C17.3897 12.015 18.1586 11.7273 19.1917 11.7273C20.9991 11.7273 22.4644 13.1925 22.4644 15C22.4644 16.8075 20.9991 18.2727 19.1917 18.2727C17.3842 18.2727 15.9189 16.8075 15.9189 15H15.1917C15.1917 17.2091 16.9825 19 19.1917 19C21.4008 19 23.1917 17.2091 23.1917 15C23.1917 12.7909 21.4008 11 19.1917 11C18.0232 11 17.096 11.3311 16.2826 12.1842V11.3604H15.5553V13.5455H17.7371V12.8182ZM21.0099 14.6359H19.5553V12.8177H18.828V15.3632H21.0099V14.6359Z"
        fill="#B5C4FA"
      />
    </svg>
  );
};
