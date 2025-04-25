import type { Transaction, User } from "@/app/dashboard/page"

// Calculate balances between users
export function calculateBalances(transactions: Transaction[], users: User[]) {
  // Initialize balances for each user
  const balances: Record<string, Record<string, number>> = {}

  users.forEach((user) => {
    balances[user.id] = {}
    users.forEach((otherUser) => {
      if (user.id !== otherUser.id) {
        balances[user.id][otherUser.id] = 0
      }
    })
  })

  // Calculate balances based on transactions
  transactions.forEach((transaction) => {
    if (transaction.type === "expense") {
      const paidBy = transaction.paidBy
      const splitBetween = transaction.splitBetween
      const amountPerPerson = transaction.amount / splitBetween.length

      splitBetween.forEach((userId) => {
        if (userId !== paidBy) {
          // The user owes money to the person who paid
          balances[userId][paidBy] = (balances[userId][paidBy] || 0) - amountPerPerson
          balances[paidBy][userId] = (balances[paidBy][userId] || 0) + amountPerPerson
        }
      })
    } else if (transaction.type === "settlement") {
      const paidBy = transaction.paidBy
      const paidTo = transaction.paidTo

      if (paidBy && paidTo) {
        // Update balances for settlement
        balances[paidBy][paidTo] = (balances[paidBy][paidTo] || 0) - transaction.amount
        balances[paidTo][paidBy] = (balances[paidTo][paidBy] || 0) + transaction.amount
      }
    } else if (transaction.type === "loan") {
      const paidBy = transaction.paidBy // lender
      const paidTo = transaction.paidTo // borrower

      if (paidBy && paidTo) {
        // Update balances for loan
        balances[paidBy][paidTo] = (balances[paidBy][paidTo] || 0) + transaction.amount
        balances[paidTo][paidBy] = (balances[paidTo][paidBy] || 0) - transaction.amount
      }
    }
  })

  // Simplify balances to a list of who owes whom
  const simplifiedBalances: Record<string, { userId: string; amount: number }[]> = {}

  users.forEach((user) => {
    simplifiedBalances[user.id] = []

    users.forEach((otherUser) => {
      if (user.id !== otherUser.id) {
        const amount = balances[user.id][otherUser.id]
        if (amount !== 0) {
          simplifiedBalances[user.id].push({
            userId: otherUser.id,
            amount,
          })
        }
      }
    })
  })

  return simplifiedBalances
}

// Get optimal settlement plan
export function getOptimalSettlementPlan(
  balances: Record<string, { userId: string; amount: number }[]>,
  users: User[],
) {
  // Create a list of all debts
  const debts: { from: string; to: string; amount: number }[] = []

  Object.entries(balances).forEach(([userId, userBalances]) => {
    userBalances.forEach((balance) => {
      if (balance.amount < 0) {
        debts.push({
          from: userId,
          to: balance.userId,
          amount: Math.abs(balance.amount),
        })
      }
    })
  })

  // Sort debts by amount (largest first)
  debts.sort((a, b) => b.amount - a.amount)

  return debts
}

// Calculate total owed by a user
export function getTotalOwed(userId: string, balances: Record<string, { userId: string; amount: number }[]>) {
  const userBalances = balances[userId] || []
  return userBalances
    .filter((balance) => balance.amount < 0)
    .reduce((sum, balance) => sum + Math.abs(balance.amount), 0)
}

// Calculate total owed to a user
export function getTotalOwedToUser(userId: string, balances: Record<string, { userId: string; amount: number }[]>) {
  const userBalances = balances[userId] || []
  return userBalances.filter((balance) => balance.amount > 0).reduce((sum, balance) => sum + balance.amount, 0)
}

// Get transaction statistics
export function getTransactionStats(transactions: Transaction[], userId: string) {
  const stats = {
    totalSpent: 0,
    totalPaid: 0,
    totalReceived: 0,
    totalLoaned: 0,
    totalBorrowed: 0,
    expenseCount: 0,
    settlementCount: 0,
    loanCount: 0,
  }

  transactions.forEach((transaction) => {
    if (transaction.type === "expense") {
      if (transaction.paidBy === userId) {
        stats.totalPaid += transaction.amount
      }
      if (transaction.splitBetween.includes(userId)) {
        stats.totalSpent += transaction.amount / transaction.splitBetween.length
        stats.expenseCount++
      }
    } else if (transaction.type === "settlement") {
      if (transaction.paidBy === userId) {
        stats.totalPaid += transaction.amount
      }
      if (transaction.paidTo === userId) {
        stats.totalReceived += transaction.amount
      }
      if (transaction.paidBy === userId || transaction.paidTo === userId) {
        stats.settlementCount++
      }
    } else if (transaction.type === "loan") {
      if (transaction.paidBy === userId) {
        stats.totalLoaned += transaction.amount
      }
      if (transaction.paidTo === userId) {
        stats.totalBorrowed += transaction.amount
      }
      if (transaction.paidBy === userId || transaction.paidTo === userId) {
        stats.loanCount++
      }
    }
  })

  return stats
}
