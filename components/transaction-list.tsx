"use client"

import type { Transaction, User } from "@/app/dashboard/page"
import { Card, CardContent } from "@/components/ui/card"
import {
  ShoppingBag,
  Zap,
  Wifi,
  Home,
  Car,
  Coffee,
  Utensils,
  Film,
  Gift,
  CreditCard,
  ArrowRightLeft,
  HandCoins,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TransactionListProps {
  transactions: Transaction[]
  users: User[]
}

export default function TransactionList({ transactions, users }: TransactionListProps) {
  // Helper to get user name by ID
  const getUserName = (userId: string) => {
    return users.find((user) => user.id === userId)?.name || userId
  }

  // Helper to get user avatar by ID
  const getUserAvatar = (userId: string) => {
    return users.find((user) => user.id === userId)?.avatar || "/placeholder.svg"
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Get category icon
  const getCategoryIcon = (category?: string, type?: string) => {
    if (type === "settlement") return <ArrowRightLeft className="h-4 w-4" />
    if (type === "loan") return <HandCoins className="h-4 w-4" />

    switch (category) {
      case "food":
        return <Utensils className="h-4 w-4" />
      case "groceries":
        return <ShoppingBag className="h-4 w-4" />
      case "utilities":
        return <Zap className="h-4 w-4" />
      case "internet":
        return <Wifi className="h-4 w-4" />
      case "rent":
        return <Home className="h-4 w-4" />
      case "transport":
        return <Car className="h-4 w-4" />
      case "entertainment":
        return <Film className="h-4 w-4" />
      case "coffee":
        return <Coffee className="h-4 w-4" />
      case "gifts":
        return <Gift className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  // Get transaction badge variant
  const getTransactionBadgeVariant = (type: string) => {
    switch (type) {
      case "expense":
        return "default"
      case "settlement":
        return "outline"
      case "loan":
        return "secondary"
      default:
        return "default"
    }
  }

  // Get transaction description
  const getTransactionDescription = (transaction: Transaction) => {
    switch (transaction.type) {
      case "expense":
        return `Paid by ${getUserName(transaction.paidBy)} • Split between ${transaction.splitBetween.map((id) => getUserName(id)).join(", ")}`
      case "settlement":
        return `${getUserName(transaction.paidBy)} paid ${getUserName(transaction.paidTo || "")} • Settlement`
      case "loan":
        return `${getUserName(transaction.paidBy)} loaned ${getUserName(transaction.paidTo || "")} • Loan`
      default:
        return ""
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="space-y-3 flex-1 overflow-auto">
        {transactions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">
              No transactions yet. Add your first expense!
            </CardContent>
          </Card>
        ) : (
          transactions
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map((transaction) => (
              <Card key={transaction.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className="mr-4 flex-shrink-0">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center 
                      ${
                        transaction.type === "expense"
                          ? "bg-mint/10 text-mint dark:bg-mint/20"
                          : transaction.type === "settlement"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                      }`}
                      >
                        {getCategoryIcon(transaction.category, transaction.type)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-800 dark:text-gray-200">{transaction.title}</h3>
                          <Badge variant={getTransactionBadgeVariant(transaction.type)} className="ml-2">
                            {transaction.type}
                          </Badge>
                        </div>
                        <span
                          className={`font-semibold ${
                            transaction.type === "expense"
                              ? "text-mint"
                              : transaction.type === "settlement"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-purple-600 dark:text-purple-400"
                          }`}
                        >
                          ${transaction.amount.toFixed(2)}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>{getTransactionDescription(transaction)}</p>
                      </div>

                      {transaction.notes && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500 italic">
                          Note: {transaction.notes}
                        </p>
                      )}

                      <div className="mt-2 flex items-center">
                        <div className="flex -space-x-2">
                          {transaction.splitBetween.map((userId) => (
                            <Avatar key={userId} className="h-6 w-6 border-2 border-white dark:border-gray-800">
                              <AvatarImage
                                src={getUserAvatar(userId) || "/placeholder.svg"}
                                alt={getUserName(userId)}
                              />
                              <AvatarFallback className="text-xs">{getUserName(userId).charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-500">
                          {formatDate(transaction.date)}
                        </span>
                      </div>
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
