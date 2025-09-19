import * as React from 'react'

export type CheckIconProps = React.ComponentPropsWithoutRef<'svg'> & {
  /** Optional explicit width; defaults to typographic scaling. */
  width?: number | string
  /** Optional explicit height; defaults to typographic scaling. */
  height?: number | string
  /** Optional explicit color. If omitted, the icon uses `currentColor`. */
  color?: string
}

export const CheckIcon: React.FC<CheckIconProps> = ({
  className = 'w-5 h-5',
  width = '1em',
  height = '1em',
  color,
  style,
  ...props
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden={props['aria-label'] ? undefined : true}
      // allow overriding icon color via prop or external CSS (currentColor)
      style={color ? { color, ...style } : style}
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <g filter="url(#checkicon_drop_shadow)">
        {/* Use currentColor so theme tokens work, e.g. text-[oklch(var(--color-success))] */}
        <circle cx={13} cy={12} r={9} fill="currentColor" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0959 13.1985L15.3785 9.91602L16.2555 10.7931L12.0959 14.9527L9.79688 12.6536L10.6739 11.7765L12.0959 13.1985Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="checkicon_drop_shadow"
          x={0}
          y={0}
          width={26}
          height={26}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={1} />
          <feGaussianBlur stdDeviation={2} />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}
