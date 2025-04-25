import type { Transaction, User } from "@/app/dashboard/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Balance {
  userId: string
  amount: number
}

interface BalanceSummaryProps {
  balances: Record<string, Balance[]>
  currentUser: User
  users: User[]
  transactions: Transaction[]
}

export default function BalanceSummary({ balances, currentUser, users, transactions }: BalanceSummaryProps) {
  // Calculate total spent
  const totalSpent = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  // Calculate total settled
  const totalSettled = transactions
    .filter((t) => t.type === "settlement")
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  // Calculate total loaned
  const totalLoaned = transactions
    .filter((t) => t.type === "loan" && t.paidBy === currentUser.id)
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  // Calculate total borrowed
  const totalBorrowed = transactions
    .filter((t) => t.type === "loan" && t.paidTo === currentUser.id)
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  // Get user name by ID
  const getUserName = (userId: string) => {
    return users.find((user) => user.id === userId)?.name || userId
  }

  // Get current user's balances
  const userBalances = balances[currentUser.id] || []

  // Separate what user owes vs what is owed to user
  const userOwes = userBalances.filter((balance) => balance.amount < 0)
  const owedToUser = userBalances.filter((balance) => balance.amount > 0)

  // Calculate total owed and total owing
  const totalOwed = owedToUser.reduce((sum, balance) => sum + balance.amount, 0)
  const totalOwing = userOwes.reduce((sum, balance) => sum + Math.abs(balance.amount), 0)

  // Calculate net balance
  const netBalance = totalOwed - totalOwing

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Balance Summary</h2>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Spent</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-mint">${totalSpent.toFixed(2)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Across {transactions.filter((t) => t.type === "expense").length} expenses
          </p>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="dark:text-gray-300">Monthly Budget</span>
              <span className="dark:text-gray-300">$500.00</span>
            </div>
            <Progress value={(totalSpent / 500) * 100} className="h-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {totalSpent < 500
                ? `$${(500 - totalSpent).toFixed(2)} remaining`
                : `$${(totalSpent - 500).toFixed(2)} over budget`}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Balance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Net Balance</span>
            <span className={`font-semibold ${netBalance >= 0 ? "text-mint" : "text-red-500"}`}>
              ${netBalance.toFixed(2)}
            </span>
          </div>

          {userOwes.length === 0 && owedToUser.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">You're all settled up!</p>
          ) : (
            <>
              {userOwes.map((balance) => (
                <div
                  key={balance.userId}
                  className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                >
                  <div className="flex items-center">
                    <ArrowUpIcon className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
                    <span className="dark:text-gray-200">
                      You owe <span className="font-medium">{getUserName(balance.userId)}</span>
                    </span>
                  </div>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    ${Math.abs(balance.amount).toFixed(2)}
                  </span>
                </div>
              ))}

              {owedToUser.map((balance) => (
                <div
                  key={balance.userId}
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                >
                  <div className="flex items-center">
                    <ArrowDownIcon className="h-5 w-5 text-mint mr-2" />
                    <span className="dark:text-gray-200">
                      <span className="font-medium">{getUserName(balance.userId)}</span> owes you
                    </span>
                  </div>
                  <span className="font-semibold text-mint">${balance.amount.toFixed(2)}</span>
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Loans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">You loaned</span>
            <span className="font-semibold text-mint">${totalLoaned.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">You borrowed</span>
            <span className="font-semibold text-red-500 dark:text-red-400">${totalBorrowed.toFixed(2)}</span>
          </div>
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Net loans</span>
            <span
              className={`font-semibold ${totalLoaned - totalBorrowed >= 0 ? "text-mint" : "text-red-500 dark:text-red-400"}`}
            >
              ${(totalLoaned - totalBorrowed).toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-gray-200">Total Transactions</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last 30 days</p>
                </div>
              </div>
              <p className="text-lg font-semibold dark:text-white">{transactions.length}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                  <ArrowDownIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-gray-200">Settlements</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last 30 days</p>
                </div>
              </div>
              <p className="text-lg font-semibold dark:text-white">${totalSettled.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
