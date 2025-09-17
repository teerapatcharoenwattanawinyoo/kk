import { Separator } from '@/ui/atoms/separator'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Separator> = {
  title: 'Atoms/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div>
        <p className="text-sm">First section</p>
        <p className="text-xs text-muted-foreground">This is the first section of content.</p>
      </div>
      <Separator />
      <div>
        <p className="text-sm">Second section</p>
        <p className="text-xs text-muted-foreground">This is the second section of content.</p>
      </div>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center space-x-4">
      <div className="text-center">
        <p className="text-sm font-medium">Home</p>
        <p className="text-xs text-muted-foreground">Page</p>
      </div>
      <Separator orientation="vertical" />
      <div className="text-center">
        <p className="text-sm font-medium">About</p>
        <p className="text-xs text-muted-foreground">Page</p>
      </div>
      <Separator orientation="vertical" />
      <div className="text-center">
        <p className="text-sm font-medium">Contact</p>
        <p className="text-xs text-muted-foreground">Page</p>
      </div>
    </div>
  ),
}

export const InContent: Story = {
  render: () => (
    <div className="max-w-md space-y-1">
      <h4 className="text-sm font-medium leading-none">Account Settings</h4>
      <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Profile</div>
        <Separator orientation="vertical" />
        <div>Security</div>
        <Separator orientation="vertical" />
        <div>Notifications</div>
      </div>
    </div>
  ),
}

export const NavigationMenu: Story = {
  render: () => (
    <div className="flex items-center space-x-6 text-sm">
      <a href="#" className="font-medium">
        Dashboard
      </a>
      <Separator orientation="vertical" className="h-4" />
      <a href="#" className="text-muted-foreground hover:text-foreground">
        Projects
      </a>
      <Separator orientation="vertical" className="h-4" />
      <a href="#" className="text-muted-foreground hover:text-foreground">
        Team
      </a>
      <Separator orientation="vertical" className="h-4" />
      <a href="#" className="text-muted-foreground hover:text-foreground">
        Settings
      </a>
    </div>
  ),
}
