import React from 'react'

export interface OneChargeLogoSecondaryProps {
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
}

export const OneChargeLogoSecondary: React.FC<OneChargeLogoSecondaryProps> = ({
  width = 94,
  height = 75,
  className = '',
  style,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 94 75"
    fill="none"
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    {...props}
  >
    <path
      d="M33.5982 74.9983C24.3234 74.9983 16.8047 67.5281 16.8047 58.3125H74.8824C74.8824 67.5281 67.3633 74.9983 58.0887 74.9983H33.5982Z"
      fill="url(#paint0_linear_318_6927)"
    />
    <path
      d="M84.7219 26.9566C79.8927 15.6891 75.3081 13.8117 71.6905 12.486C70.3569 11.9974 69.3125 10.8077 69.3125 9.41344V0H89.672C92.0619 0 93.9994 1.89704 93.9994 4.23716V30.1923C93.9994 31.2323 93.1382 32.0755 92.0762 32.0755H89.672C87.3216 32.0755 85.4245 29.1526 84.7219 26.9566Z"
      fill="url(#paint1_linear_318_6927)"
    />
    <path
      d="M75.4109 58.1847C75.4109 67.3998 67.8919 74.8706 58.6172 74.8706L58.6264 16.5078C67.9011 16.5078 75.4109 24.6363 75.4109 33.8515V58.1847Z"
      fill="url(#paint2_linear_318_6927)"
    />
    <path
      d="M0.443359 16.5094C0.443359 7.39151 7.88269 0 17.0595 0H58.8371V16.5094H0.443359Z"
      fill="url(#paint3_linear_318_6927)"
    />
    <path
      d="M0 17.1573C0 7.94212 7.51872 0 16.7935 0V58.1759C7.51872 58.1759 0 50.7057 0 41.4905V17.1573Z"
      fill="url(#paint4_linear_318_6927)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_318_6927"
        x1="16.8047"
        y1="66.6554"
        x2="74.8824"
        y2="66.6554"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.3125" stopColor="#466EFE" />
        <stop offset="1" stopColor="#1E3587" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_318_6927"
        x1="63.6697"
        y1="6.27566"
        x2="98.5787"
        y2="9.12913"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.015625" stopColor="#4AF3DB" />
        <stop offset="0.598958" stopColor="#4168F1" />
        <stop offset="0.979167" stopColor="#1C317B" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_318_6927"
        x1="66.8237"
        y1="15.2245"
        x2="66.8237"
        y2="89.1908"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#355FF5" />
        <stop offset="1" stopColor="#1E3587" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_318_6927"
        x1="-5.491"
        y1="8.49057"
        x2="63.5846"
        y2="8.49057"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#1E3587" />
        <stop offset="0.945277" stopColor="#355FF5" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_318_6927"
        x1="8.39676"
        y1="0.471698"
        x2="8.39676"
        y2="58.1759"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#355FF5" />
        <stop offset="1" stopColor="#1E3587" />
      </linearGradient>
    </defs>
  </svg>
)
