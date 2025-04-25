"use client"

import type { Expense, User } from "@/app/dashboard/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"

interface ExpenseListProps {
  expenses: Expense[]
  users: User[]
  onAddExpense: () => void
}

export default function ExpenseList({ expenses, users, onAddExpense }: ExpenseListProps) {
  // Helper to get user name by ID
  const getUserName = (userId: string) => {
    return users.find((user) => user.id === userId)?.name || userId
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Expenses</h2>
        <Button onClick={onAddExpense} className="bg-mint text-white hover:bg-mint/90">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="space-y-3 flex-1 overflow-auto">
        {expenses.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No expenses yet. Add your first expense!
            </CardContent>
          </Card>
        ) : (
          expenses.map((expense) => (
            <Card key={expense.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center p-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-800">{expense.title}</h3>
                      <span className="font-semibold text-mint">${expense.amount.toFixed(2)}</span>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        Paid by <span className="font-medium">{getUserName(expense.paidBy)}</span>
                      </p>
                      <p className="mt-1">
                        Split between {expense.splitBetween.map((id) => getUserName(id)).join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="ml-4 text-right">
                    <span className="text-sm text-gray-500">{formatDate(expense.date)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
