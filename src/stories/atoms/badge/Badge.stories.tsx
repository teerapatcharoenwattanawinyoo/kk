import { Badge } from '@/ui/atoms/badge'

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
}

export default meta

export const Default = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
}

export const Secondary = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

export const Destructive = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
}

export const Outline = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}

export const WithIcon = {
  args: {
    children: (
      <>
        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Verified
      </>
    ),
    variant: 'default',
  },
}

export const Status = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">Active</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">Inactive</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  ),
}

export const WithNumbers = {
  render: () => (
    <div className="flex gap-2">
      <Badge>99+</Badge>
      <Badge variant="secondary">5</Badge>
      <Badge variant="outline">New</Badge>
    </div>
  ),
}
