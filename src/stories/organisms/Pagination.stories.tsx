import { Pagination } from '@/ui/organisms/pagination'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

const meta = {
  title: 'Organisms/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onPageChange: fn(),
    onItemsPerPageChange: fn(),
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 13,
    itemsPerPage: 10,
    totalItems: 130,
  },
}

export const MiddlePage: Story = {
  args: {
    currentPage: 7,
    totalPages: 13,
    itemsPerPage: 10,
    totalItems: 130,
  },
}

export const LastPage: Story = {
  args: {
    currentPage: 13,
    totalPages: 13,
    itemsPerPage: 10,
    totalItems: 130,
  },
}
