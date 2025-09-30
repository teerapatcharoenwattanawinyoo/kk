'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CheckIcon } from '@radix-ui/react-icons'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface MemberGroupsTabProps {
  teamId: string
}

type GroupCard = {
  id: string
  visibility: 'Internal' | 'External'
  name: string
  description: string
  priceGroup: { label: string; linkText: string; href: string }
  permissions: { label: string; enabled: boolean }[]
}

const mockGroups: GroupCard[] = [
  {
    id: 'group-ceo',
    visibility: 'Internal',
    name: 'Group CEO',
    description: 'CEO Centre Of Everythings',
    priceGroup: {
      label: 'Member price group',
      linkText: 'General price for AC charger',
      href: '#',
    },
    permissions: [
      { label: 'Pay charging with team wallet', enabled: true },
      { label: 'Request sponsored charger', enabled: true },
    ],
  },
  {
    id: 'group-hr',
    visibility: 'Internal',
    name: 'Group HR',
    description: 'Group HR oversees employee relations, supports CEO…',
    priceGroup: {
      label: 'Member price group',
      linkText: 'DC Price',
      href: '#',
    },
    permissions: [
      { label: 'Pay charging with team wallet', enabled: true },
      { label: 'Request sponsored charger', enabled: true },
    ],
  },
  {
    id: 'group-design',
    visibility: 'External',
    name: 'Group Design',
    description: 'Design is Everythings',
    priceGroup: {
      label: 'Member price group',
      linkText: 'General price for AC charger',
      href: '#',
    },
    permissions: [
      { label: 'Pay charging with team wallet', enabled: true },
      { label: 'Request sponsored charger', enabled: true },
      { label: 'Member fee', enabled: true },
      { label: 'Manage team wallet', enabled: true },
      { label: 'Config charger', enabled: true },
    ],
  },
  {
    id: 'group-dev',
    visibility: 'Internal',
    name: 'Group Dev',
    description: 'DEV For Alive',
    priceGroup: { label: 'Member price group', linkText: 'AC/DC', href: '#' },
    permissions: [
      { label: 'Pay charging with team wallet', enabled: true },
      { label: 'Request sponsored charger', enabled: true },
    ],
  },
]

function VisibilityBadge({ visibility }: { visibility: GroupCard['visibility'] }) {
  const isExternal = visibility === 'External'
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
        isExternal ? 'bg-foreground text-background' : 'bg-primary/10 text-primary',
      ].join(' ')}
    >
      {visibility}
    </span>
  )
}

export function MemberGroupsTab({}: MemberGroupsTabProps) {
  return (
    <div className="px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockGroups.map((g) => (
          <Card key={g.id} className="relative">
            <CardHeader className="space-y-1">
              <div className="flex items-start justify-between">
                <VisibilityBadge visibility={g.visibility} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0"
                      aria-label="Open group actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="bottom"
                    sideOffset={8}
                    className="w-40 border bg-popover p-1"
                  >
                    <DropdownMenuItem className="cursor-pointer">
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-base">{g.name}</CardTitle>
              <CardDescription className="text-xs">{g.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{g.priceGroup.label}</span>
                <Link href={g.priceGroup.href} className="text-primary hover:underline">
                  {g.priceGroup.linkText}
                </Link>
              </div>

              <div className="space-y-2 pt-1">
                {g.permissions.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-oc-title-secondary">{p.label}</span>
                    {p.enabled ? (
                      <CheckIcon className="bg-success size-4 rounded-full text-white" />
                    ) : (
                      <span className="h-4 w-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
