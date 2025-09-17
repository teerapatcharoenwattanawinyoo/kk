'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/organisms/tabs'
import { InvoiceNumberPrefixTab } from '../invoice-number-prefix-tab'
import { ReceiptTaxInvoiceTab } from '../receipt-tax-invoice-tab'
import { TaxInformationTab } from '../tax-information-tab'

interface TaxSettingProps {
  teamId: string
  onCreateClick: () => void
  onEditClick?: (taxData: { id: string; [key: string]: unknown }) => void
}

export const TaxSetting = ({ teamId, onCreateClick, onEditClick }: TaxSettingProps) => {
  return (
    <div className="">
      <div className="border-b p-6">
        <h2 className="text-title mb-1 text-xl font-semibold">Tax Setting</h2>
        <p className="text-muted-blue text-sm">Configure tax invoice settings</p>
      </div>

      <div className="mx-auto max-w-4xl p-6">
        <Tabs defaultValue="information" className="w-full">
          <TabsList className="grid h-11 w-full grid-cols-3 rounded-lg bg-muted p-1">
            <TabsTrigger
              value="information"
              className="h-9 rounded-md text-sm font-medium text-foreground data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              Information
            </TabsTrigger>
            <TabsTrigger
              value="prefix"
              className="h-9 rounded-md text-sm font-medium text-foreground data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              Invoice Number Prefix
            </TabsTrigger>
            <TabsTrigger
              value="receipt"
              className="h-9 rounded-md text-sm font-medium text-foreground data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              Receipt / Tax Invoice
            </TabsTrigger>
          </TabsList>

          <TabsContent value="information" className="mt-8">
            <TaxInformationTab
              teamId={teamId}
              onCreateClick={onCreateClick}
              onEditClick={onEditClick}
            />
          </TabsContent>

          <TabsContent value="prefix" className="mt-8">
            <InvoiceNumberPrefixTab teamId={teamId} />
          </TabsContent>

          <TabsContent value="receipt" className="mt-8">
            <ReceiptTaxInvoiceTab teamId={teamId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
