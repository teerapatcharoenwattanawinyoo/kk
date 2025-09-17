import { Label } from '@/ui/atoms/label'
import { Switch } from '@/ui/atoms/switch'

const meta = {
  title: 'Atoms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    checked: {
      control: { type: 'boolean' },
    },
  },
}

export default meta

export const Default = {
  args: {},
}

export const Checked = {
  args: {
    checked: true,
  },
}

export const Disabled = {
  args: {
    disabled: true,
  },
}

export const DisabledChecked = {
  args: {
    disabled: true,
    checked: true,
  },
}

export const WithLabel = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
}

export const WithDescription = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Switch id="notifications" />
        <Label htmlFor="notifications">Push Notifications</Label>
      </div>
      <p className="text-sm text-muted-foreground">Receive push notifications on your device.</p>
    </div>
  ),
}

export const Settings = {
  render: () => (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Privacy Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analytics">Analytics</Label>
              <p className="text-sm text-muted-foreground">Help improve our service</p>
            </div>
            <Switch id="analytics" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing">Marketing emails</Label>
              <p className="text-sm text-muted-foreground">Receive promotional emails</p>
            </div>
            <Switch id="marketing" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="security">Security alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified of security events</p>
            </div>
            <Switch id="security" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  ),
}
