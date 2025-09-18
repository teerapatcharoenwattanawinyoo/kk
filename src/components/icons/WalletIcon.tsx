import React from "react";

interface WalletIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const WalletIcon: React.FC<WalletIconProps> = ({
  width = 30,
  height = 29,
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#filter0_d_318_8389)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.103 8.6883C17.7567 8.50155 18.438 8.88003 18.6247 9.53367C18.6561 9.64364 18.6721 9.75745 18.6721 9.87182V10.9023H19.9027C20.5825 10.9023 21.1336 11.4534 21.1336 12.1332V19.5184C21.1336 20.1982 20.5825 20.7493 19.9027 20.7493H10.0557C9.37591 20.7493 8.82483 20.1982 8.82483 19.5184H8.84151C8.83058 19.4522 8.82506 19.3852 8.82506 19.3179V11.9819C8.82506 11.4323 9.18937 10.9493 9.71779 10.7984L17.103 8.6883ZM13.8345 19.5184H19.9027V12.1332H18.6721V13.3641H19.9027V14.5949H18.6721V17.2078C18.6721 17.7574 18.3078 18.2404 17.7793 18.3913L13.8345 19.5184ZM10.0559 11.9819V19.3179L17.4412 17.2078V9.8718L10.0559 11.9819ZM16.2103 13.3642C16.2103 13.7041 15.9348 13.9796 15.5949 13.9796C15.255 13.9796 14.9794 13.7041 14.9794 13.3642C14.9794 13.0243 15.255 12.7487 15.5949 12.7487C15.9348 12.7487 16.2103 13.0243 16.2103 13.3642Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_318_8389"
          x="0.824829"
          y="0.640625"
          width="28.3088"
          height="28.1094"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.34 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_318_8389"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_318_8389"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
