"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon, ArrowRightLeft, HandCoins } from "lucide-react"

interface ActionButtonsProps {
  onAddExpense: () => void
  onSettleUp: () => void
  onLoan: () => void
}

export default function ActionButtons({ onAddExpense, onSettleUp, onLoan }: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button onClick={onAddExpense} className="bg-mint text-white hover:bg-mint/90 dark:hover:bg-mint/80" size="sm">
        <PlusIcon className="h-4 w-4 mr-1" />
        Add Expense
      </Button>

      <Button
        onClick={onSettleUp}
        variant="outline"
        size="sm"
        className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
      >
        <ArrowRightLeft className="h-4 w-4 mr-1" />
        Settle Up
      </Button>

      <Button
        onClick={onLoan}
        variant="outline"
        size="sm"
        className="border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-900/30"
      >
        <HandCoins className="h-4 w-4 mr-1" />
        Loan
      </Button>
    </div>
  )
}
