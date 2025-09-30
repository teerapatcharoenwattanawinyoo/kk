import { colors } from '@/lib/utils/colors'
import React from 'react'

export interface TableColumn<T = Record<string, unknown>> {
  key: string
  header: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: string, row: T) => React.ReactNode
}

export interface DataTableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[]
  data: T[]
  className?: string
  onRowClick?: (row: T, index: number) => void
}

export const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  className = '',
  onRowClick,
}: DataTableProps<T>) => {
  return (
    <div
      className={`w-full overflow-hidden rounded-lg border ${className}`}
      style={{ borderColor: colors.neutral[200] }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: colors.primary[500] }}>
            <tr>
              {columns.map((column, columnIndex) => (
                <th
                  key={`header-${columnIndex}-${column.key}`}
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                  style={{
                    width: column.width || 'auto',
                    textAlign: column.align || 'left',
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr
                key={`row-${index}`}
                className={`whitespace-nowrap transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } ${
                  onRowClick
                    ? 'cursor-pointer hover:!bg-blue-50 hover:shadow-sm'
                    : 'hover:!bg-gray-100'
                }`}
                onClick={() => onRowClick?.(row, index)}
              >
                {columns.map((column) => (
                  <td
                    key={`${index}-${column.key}`}
                    className="px-4 py-3 text-sm"
                    style={{ textAlign: column.align || 'left' }}
                  >
                    {column.render
                      ? column.render(row[column.key] as string, row)
                      : (row[column.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
