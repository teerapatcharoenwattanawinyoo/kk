import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/organisms/accordion'

const meta = {
  title: 'Organisms/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['single', 'multiple'],
    },
    collapsible: {
      control: { type: 'boolean' },
    },
  },
}

export default meta

export const Default = {
  args: {},
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern and uses semantic HTML.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components' aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple = {
  render: () => (
    <Accordion type="multiple" className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Features</AccordionTrigger>
        <AccordionContent>
          <ul className="list-inside list-disc space-y-1">
            <li>Fully accessible</li>
            <li>Customizable styling</li>
            <li>Smooth animations</li>
            <li>Keyboard navigation</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Installation</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p>Install the package using your preferred package manager:</p>
            <code className="block rounded bg-muted p-2 text-sm">
              npm install @radix-ui/react-accordion
            </code>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Usage</AccordionTrigger>
        <AccordionContent>
          Import the components and use them in your React application. See the documentation for
          detailed examples.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const FAQ = {
  render: () => (
    <div className="w-full max-w-2xl">
      <h2 className="mb-4 text-2xl font-bold">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="faq-1">
          <AccordionTrigger>What is your return policy?</AccordionTrigger>
          <AccordionContent>
            We offer a 30-day return policy for all items in their original condition. Items must be
            returned with original packaging and receipt. Shipping costs for returns are the
            customer's responsibility unless the item was defective or damaged upon arrival.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>How long does shipping take?</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p>Shipping times vary by location and method:</p>
              <ul className="ml-4 list-inside list-disc space-y-1">
                <li>
                  <strong>Standard shipping:</strong> 5-7 business days
                </li>
                <li>
                  <strong>Express shipping:</strong> 2-3 business days
                </li>
                <li>
                  <strong>Overnight shipping:</strong> 1 business day
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Orders placed after 2 PM EST will be processed the next business day.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-3">
          <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
          <AccordionContent>
            Yes, we ship to most countries worldwide. International shipping rates and delivery
            times vary by destination. Additional customs fees may apply and are the responsibility
            of the recipient.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-4">
          <AccordionTrigger>How can I track my order?</AccordionTrigger>
          <AccordionContent>
            Once your order ships, you'll receive a tracking number via email. You can also log into
            your account on our website to view order status and tracking information. Tracking
            updates may take 24-48 hours to appear after shipment.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

export const ProductSpecs = {
  render: () => (
    <div className="w-full max-w-lg">
      <h3 className="mb-3 text-lg font-semibold">Product Specifications</h3>
      <Accordion type="single" collapsible>
        <AccordionItem value="dimensions">
          <AccordionTrigger>Dimensions & Weight</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Height:</div>
              <div>24 inches</div>
              <div>Width:</div>
              <div>16 inches</div>
              <div>Depth:</div>
              <div>8 inches</div>
              <div>Weight:</div>
              <div>12.5 lbs</div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="materials">
          <AccordionTrigger>Materials & Construction</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1 text-sm">
              <li>• Premium aluminum alloy frame</li>
              <li>• Reinforced steel joints</li>
              <li>• Weather-resistant coating</li>
              <li>• Non-slip rubber base</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="compatibility">
          <AccordionTrigger>Compatibility & Requirements</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Compatible with:</strong>
              </p>
              <ul className="ml-2 list-inside list-disc">
                <li>Windows 10 or later</li>
                <li>macOS 10.15 or later</li>
                <li>Linux (Ubuntu 18.04+)</li>
              </ul>
              <p>
                <strong>Power requirements:</strong> 110-240V AC
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}
