'use client'

interface DevelopmentPlaceholderProps {
  title: string
}

export const DevelopmentPlaceholder = ({
  title,
}: DevelopmentPlaceholderProps) => {
  return (
    <div className="py-12 text-center">
      <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-gray-600">This section is under development.</p>
    </div>
  )
}
