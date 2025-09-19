import React from 'react'

interface RevenueCardIconProps {
  className?: string
}

export const RevenueCardIcon: React.FC<RevenueCardIconProps> = ({
  className = '',
}) => {
  return (
    <svg
      width="24"
      height="19"
      viewBox="0 0 24 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.3732 0H2.00959C1.00543 0 0.191406 0.89543 0.191406 2V14C0.191406 15.1046 1.00543 16 2.00959 16H13.1914V14H2.19141V7H20.1914V10H22.1914V2C22.1914 0.89543 21.3774 0 20.3732 0ZM20.1914 5V2H2.19141V5H20.1914Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.7369 12.8182H16.6874C17.3895 12.015 18.1584 11.7273 19.1914 11.7273C20.9989 11.7273 22.4641 13.1925 22.4641 15C22.4641 16.8075 20.9989 18.2727 19.1914 18.2727C17.3839 18.2727 15.9187 16.8075 15.9187 15H15.1914C15.1914 17.2091 16.9823 19 19.1914 19C21.4005 19 23.1914 17.2091 23.1914 15C23.1914 12.7909 21.4005 11 19.1914 11C18.0229 11 17.0958 11.3311 16.2823 12.1842V11.3604H15.555V13.5455H17.7369V12.8182ZM21.0096 14.6359H19.5551V12.8177H18.8278V15.3632H21.0096V14.6359Z"
        fill="#B5C4FA"
      />
    </svg>
  )
}
