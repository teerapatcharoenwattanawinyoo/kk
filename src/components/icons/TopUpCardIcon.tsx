import React from 'react'

export interface TopUpCardIconProps
  extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  width?: number
  height?: number
  fill?: string // default: currentColor
  title?: string
}

const TopUpCardIcon = React.forwardRef<SVGSVGElement, TopUpCardIconProps>(
  ({ width, height, fill = 'currentColor', className, title, ...rest }, ref) => (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.63476 0.214844H21.4341C22.4621 0.214844 23.2954 1.13152 23.2954 2.2623V14.547C23.2954 15.6778 22.4621 16.5945 21.4341 16.5945H6.31807L5.07994 17.8326L3.8418 16.5945H2.63476C2.61896 16.5945 2.60322 16.5942 2.58752 16.5938H3.84115L1.28487 14.0375L2.73264 12.5898L4.05621 13.9133L4.05621 9.21875H6.10366V13.9133L7.42723 12.5898L8.875 14.0375L6.31872 16.5938H11.0107V14.5464H21.2484V7.38144H2.82129V9.42773H0.773438V2.2623C0.773438 1.13152 1.60678 0.214844 2.63476 0.214844ZM21.2484 2.26172V5.33398H2.82129V2.26172H21.2484Z"
        fill={fill}
      />
    </svg>
  ),
)

TopUpCardIcon.displayName = 'TopUpCardIcon'

export default TopUpCardIcon
