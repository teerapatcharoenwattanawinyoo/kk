import React from 'react'

export function MemberPriceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="43"
      height="45"
      viewBox="0 0 43 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d_20023_11751)">
        <path
          d="M21.5283 9.68945C24.6956 9.68945 27.1689 12.4157 27.1689 15.6582C27.1689 18.9007 24.6955 21.627 21.5283 21.627C18.3612 21.6269 15.8887 18.9007 15.8887 15.6582C15.8887 12.4157 18.3611 9.68949 21.5283 9.68945Z"
          stroke="#355FF5"
          strokeWidth="1.7"
        />
        <path
          d="M21.5283 26.7402C26.3017 26.7403 30.3649 28.3886 32.7227 30.9082L32.7471 30.9326C33.5075 31.683 33.6461 32.761 33.2891 33.6904C32.9324 34.6184 32.1316 35.2783 31.1084 35.2783H11.9482C10.925 35.2783 10.1242 34.6185 9.76758 33.6904C9.41043 32.7608 9.54891 31.6831 10.3096 30.9326L10.3213 30.9199L10.333 30.9082C12.6908 28.3886 16.7548 26.7402 21.5283 26.7402Z"
          stroke="#355FF5"
          strokeWidth="1.7"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_20023_11751"
          x="0.730469"
          y="0.839844"
          width="41.5952"
          height="43.2891"
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
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_20023_11751" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_20023_11751"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}
