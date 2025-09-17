import { cn } from '@/lib/utils'
import { colors } from '@/lib/utils/colors'
import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

const alertVariants = cva('relative w-full rounded-lg p-4 flex items-start space-x-3', {
  variants: {
    variant: {
      default: 'bg-blue-50 text-blue-900 border border-blue-200',
      warning: 'text-orange-900 border border-orange-200',
      destructive: 'bg-red-50 text-red-900 border border-red-200',
      success: 'bg-green-50 text-green-900 border border-green-200',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface CustomAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode
}

const CustomAlert = React.forwardRef<HTMLDivElement, CustomAlertProps>(
  ({ className, variant, icon, children, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'warning':
          return {
            backgroundColor: colors.warning[100],
            iconBg: colors.warning[500],
            textColor: colors.warning[800],
          }
        case 'success':
          return {
            backgroundColor: colors.success[100],
            iconBg: colors.success[500],
            textColor: colors.success[800],
          }
        case 'destructive':
          return {
            backgroundColor: colors.error[100],
            iconBg: colors.error[500],
            textColor: colors.error[800],
          }
        default:
          return {
            backgroundColor: colors.primary[100],
            iconBg: colors.primary[500],
            textColor: colors.primary[800],
          }
      }
    }

    const styles = getVariantStyles()

    const defaultIcon =
      variant === 'warning' ? (
        <span className="text-sm font-bold text-white">!</span>
      ) : (
        <span className="text-sm font-bold text-white">i</span>
      )

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        style={{ backgroundColor: styles.backgroundColor }}
        {...props}
      >
        <div
          className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: styles.iconBg }}
        >
          {icon || defaultIcon}
        </div>
        <div className="text-sm leading-relaxed" style={{ color: styles.textColor }}>
          {children}
        </div>
      </div>
    )
  },
)

CustomAlert.displayName = 'CustomAlert'

export { alertVariants, CustomAlert }
export default CustomAlert
