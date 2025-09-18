"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChargeCard } from "@/types";
import { CreditCard, MoreHorizontal } from "lucide-react";

interface ChargeCardsTableProps {
  cards: ChargeCard[];
}

export function ChargeCardsTable({ cards }: ChargeCardsTableProps) {
  return (
    <div className="mt-2 overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-4">
        <thead className="rounded-lg bg-blue-600">
          <tr>
            <th className="rounded-tl-lg px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              {cards.length} CHARGE CARDS
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              OWNER
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              ACCESSIBILITY
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              STATUS
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              CREATED
            </th>
            <th className="rounded-tr-lg px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              ACTION
            </th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr
              key={card.id}
              className="shadow-xs rounded-lg bg-white hover:bg-gray-50"
            >
              <td className="whitespace-nowrap rounded-l-lg px-2 py-2 text-center md:px-4 md:py-3">
                <div className="flex items-center justify-center">
                  <div className="relative mr-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#E7E7E7] bg-card text-[#B6B6B6]">
                    <CreditCard className="h-3.5 w-3.5" />
                    <div className="absolute bottom-1.5 right-1 h-[9px] w-[9px] rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <div className="mr-3 text-xs font-medium text-[#6E82A5]">
                      CARD {card.id}
                    </div>
                    <div className="text-xs text-[#818894]">
                      ID: {card.cardId}
                    </div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-center text-xs text-[#6E82A5] md:px-4 md:py-3">
                {card.owner}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-center text-xs text-[#6E82A5] md:px-4 md:py-3">
                {card.accessibility}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-center md:px-4 md:py-3">
                <Badge
                  className={
                    card.status === "Active"
                      ? "rounded-lg bg-[#DFF8F3] px-4 py-1 text-[#0D8A72] hover:bg-[#DFF8F3] hover:text-[#0D8A72]"
                      : "rounded-lg bg-[#D1E9FF] px-4 py-1 text-[#40A3FF] hover:bg-[#D1E9FF] hover:text-[#40A3FF]"
                  }
                >
                  <p className="font-medium">{card.status}</p>
                </Badge>
              </td>
              <td className="whitespace-pre-line px-2 py-2 text-center text-xs text-[#6E82A5] md:px-4 md:py-3">
                {card.created}
              </td>
              <td className="whitespace-nowrap rounded-r-lg px-2 py-2 text-center text-xs text-gray-500 md:px-4 md:py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
