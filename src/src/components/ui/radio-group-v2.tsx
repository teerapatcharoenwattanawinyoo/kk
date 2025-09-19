import { cn } from '@/lib/utils'
import { colors } from '@/lib/utils/colors'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import React from 'react'

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
  icon?: React.ReactNode
}

export interface RadioGroupProps {
  name?: string
  value: string
  onValueChange: (value: string) => void
  options: RadioOption[]
  className?: string
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ name, value, onValueChange, options, className, ...props }, ref) => {
  const isHorizontal = className?.includes('flex')

  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      value={value}
      onValueChange={onValueChange}
      className={cn(className || 'space-y-4')}
      {...props}
    >
      {options.map((option) => (
        <div
          key={option.value}
          className={cn(
            'flex items-start space-x-3',
            isHorizontal ? 'flex-col space-x-0 space-y-1' : '',
          )}
        >
          {/* Radio Input and Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <RadioGroupPrimitive.Item
                value={option.value}
                id={`${name}-${option.value}`}
                disabled={option.disabled}
                className={cn(
                  'aspect-square h-4 w-4 flex-shrink-0 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                )}
                style={{
                  borderColor: colors.primary[500],
                  accentColor: colors.primary[500],
                }}
              >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: colors.primary[500] }}
                  />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>

              <label
                htmlFor={`${name}-${option.value}`}
                className={cn(
                  'flex min-w-0 cursor-pointer items-center space-x-2 text-sm',
                  option.disabled ? 'font-normal' : 'font-medium',
                )}
                style={{
                  color: option.disabled
                    ? colors.neutral[500]
                    : colors.neutral[800],
                }}
              >
                <span className="truncate">{option.label}</span>
                {option.icon && option.disabled && (
                  <span className="flex-shrink-0">{option.icon}</span>
                )}
              </label>
            </div>

            {option.description && (
              <div
                className="mt-1 break-words text-xs leading-relaxed"
                style={{
                  color: option.disabled
                    ? colors.neutral[400]
                    : colors.neutral[500],
                }}
              >
                <span>{option.description}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </RadioGroupPrimitive.Root>
  )
})

RadioGroup.displayName = 'RadioGroup'

export { RadioGroup }
export default RadioGroup
