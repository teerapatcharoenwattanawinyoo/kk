import * as React from 'react'

export function TeamWalletIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d_18886_31362)">
        <path
          d="M18.7754 8.05955C19.6261 7.82602 20.5128 8.3001 20.7559 9.11815C20.7967 9.25566 20.8174 9.39799 20.8174 9.541V10.831H22.4199C23.3046 10.8312 24.0215 11.5213 24.0215 12.3721V21.6162C24.0213 22.4668 23.3045 23.156 22.4199 23.1562H9.60254C8.71781 23.1562 8.00021 22.4669 8 21.6162H8.02246C8.00818 21.5329 8 21.4487 8 21.3642V12.1826C8 11.4947 8.4743 10.8901 9.16211 10.7012L18.7754 8.05955ZM20.8174 18.7236C20.8173 19.4115 20.343 20.0161 19.6553 20.2051L14.5176 21.6162H22.4199V15.4531H20.8174V18.7236ZM9.60254 12.1826V21.3652L19.2158 18.7236V9.54198L9.60254 12.1826ZM16.8115 13.1426C17.2538 13.1426 17.6131 13.4868 17.6133 13.9121C17.6133 14.3375 17.254 14.6826 16.8115 14.6826C16.3692 14.6824 16.0107 14.3374 16.0107 13.9121C16.0109 13.4869 16.3693 13.1427 16.8115 13.1426ZM20.8174 13.9121H22.4199V12.3721H20.8174V13.9121Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_18886_31362"
          x="0"
          y="0"
          width="32.0215"
          height="31.1562"
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
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.34 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_18886_31362" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_18886_31362"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}
