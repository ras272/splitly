"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Transaction, User } from "@/app/dashboard/page"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRightLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface Balance {
  userId: string
  amount: number
}

interface SettleUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSettleUp: (settlement: Omit<Transaction, "id" | "date" | "type">) => void
  users: User[]
  balances: Record<string, Balance[]>
  currentUser: User
}

export default function SettleUpModal({
  isOpen,
  onClose,
  onSettleUp,
  users,
  balances,
  currentUser,
}: SettleUpModalProps) {
  const [amount, setAmount] = useState("")
  const [paidBy, setPaidBy] = useState(currentUser.id)
  const [paidTo, setPaidTo] = useState("")
  const [notes, setNotes] = useState("")
  const [suggestedAmount, setSuggestedAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get user name by ID
  const getUserName = (userId: string) => {
    return users.find((user) => user.id === userId)?.name || userId
  }

  // Get current user's balances
  const userBalances = balances[currentUser.id] || []

  // Separate what user owes vs what is owed to user
  const userOwes = userBalances.filter((balance) => balance.amount < 0)
  const owedToUser = userBalances.filter((balance) => balance.amount > 0)

  // Update suggested amount when paidBy or paidTo changes
  useEffect(() => {
    if (paidBy && paidTo) {
      // If current user is paying
      if (paidBy === currentUser.id) {
        const balance = userOwes.find((b) => b.userId === paidTo)
        if (balance) {
          setSuggestedAmount(Math.abs(balance.amount))
        } else {
          setSuggestedAmount(null)
        }
      }
      // If current user is receiving
      else if (paidTo === currentUser.id) {
        const balance = owedToUser.find((b) => b.userId === paidBy)
        if (balance) {
          setSuggestedAmount(balance.amount)
        } else {
          setSuggestedAmount(null)
        }
      } else {
        setSuggestedAmount(null)
      }
    } else {
      setSuggestedAmount(null)
    }
  }, [paidBy, paidTo, userOwes, owedToUser, currentUser.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !paidBy || !paidTo) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      await onSettleUp({
        title: `Settlement: ${getUserName(paidBy)} to ${getUserName(paidTo)}`,
        amount: Number.parseFloat(amount),
        paidBy,
        paidTo,
        splitBetween: [paidBy, paidTo],
        notes: notes.trim() || undefined,
      })

      // Reset form
      setAmount("")
      setPaidBy(currentUser.id)
      setPaidTo("")
      setNotes("")

      // Close modal
      onClose()
    } catch (err) {
      console.error("Error settling up:", err)
      setError("Ocurrió un error al liquidar la deuda. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const applySuggestedAmount = () => {
    if (suggestedAmount !== null) {
      setAmount(suggestedAmount.toFixed(2))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ArrowRightLeft className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Liquidar deuda
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="paidBy">Quién pagó</Label>
            <Select value={paidBy} onValueChange={setPaidBy} required>
              <SelectTrigger id="paidBy">
                <SelectValue placeholder="Seleccionar persona" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paidTo">Quién recibió</Label>
            <Select value={paidTo} onValueChange={setPaidTo} required>
              <SelectTrigger id="paidTo">
                <SelectValue placeholder="Seleccionar persona" />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter((user) => user.id !== paidBy)
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">Monto ($)</Label>
              {suggestedAmount !== null && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={applySuggestedAmount}
                  className="h-6 p-0 text-blue-600 dark:text-blue-400"
                >
                  Sugerido: ${suggestedAmount.toFixed(2)}
                </Button>
              )}
            </div>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agrega detalles adicionales..."
              className="resize-none"
              rows={2}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
              disabled={loading || !amount || !paidBy || !paidTo}
            >
              {loading ? "Procesando..." : "Liquidar deuda"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
