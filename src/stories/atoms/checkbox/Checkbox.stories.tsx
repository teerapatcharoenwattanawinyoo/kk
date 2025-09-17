import { Checkbox } from '@/ui/atoms/checkbox'
import { Label } from '@/ui/atoms/label'

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
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
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const WithDescription = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="notifications" />
        <Label htmlFor="notifications">Email notifications</Label>
      </div>
      <p className="text-sm text-muted-foreground">Receive emails about your account activity.</p>
    </div>
  ),
}

export const MultipleChoices = {
  render: () => (
    <div className="space-y-4">
      <div className="font-semibold">Select your interests:</div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="tech" />
          <Label htmlFor="tech">Technology</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="design" />
          <Label htmlFor="design">Design</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="business" />
          <Label htmlFor="business">Business</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="science" />
          <Label htmlFor="science">Science</Label>
        </div>
      </div>
    </div>
  ),
}
