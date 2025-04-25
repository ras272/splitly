"use client"

import type React from "react"
import { useState } from "react"
import type { Transaction, User } from "@/app/dashboard/page"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingBag, Zap, Wifi, Home, Car, Coffee, Utensils, Film, Gift, CreditCard } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onAddExpense: (expense: Omit<Transaction, "id" | "date" | "type">) => void
  users: User[]
}

const CATEGORIES = [
  { id: "groceries", name: "Groceries", icon: ShoppingBag },
  { id: "utilities", name: "Utilities", icon: Zap },
  { id: "internet", name: "Internet", icon: Wifi },
  { id: "rent", name: "Rent", icon: Home },
  { id: "transport", name: "Transport", icon: Car },
  { id: "food", name: "Food", icon: Utensils },
  { id: "coffee", name: "Coffee", icon: Coffee },
  { id: "entertainment", name: "Entertainment", icon: Film },
  { id: "gifts", name: "Gifts", icon: Gift },
  { id: "other", name: "Other", icon: CreditCard },
]

export default function AddExpenseModal({ isOpen, onClose, onAddExpense, users }: AddExpenseModalProps) {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [paidBy, setPaidBy] = useState("")
  const [participants, setParticipants] = useState<string[]>([])
  const [category, setCategory] = useState("")
  const [notes, setNotes] = useState("")
  const [splitEqually, setSplitEqually] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !amount || !paidBy || participants.length === 0 || !category) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      await onAddExpense({
        title,
        amount: Number.parseFloat(amount),
        paidBy,
        splitBetween: participants,
        category,
        notes: notes.trim() || undefined,
      })

      // Reset form
      setTitle("")
      setAmount("")
      setPaidBy("")
      setParticipants([])
      setCategory("")
      setNotes("")
      setSplitEqually(true)

      // Close modal
      onClose()
    } catch (err) {
      console.error("Error adding expense:", err)
      setError("Ocurrió un error al agregar el gasto. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleParticipantToggle = (userId: string) => {
    setParticipants((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const selectAllParticipants = () => {
    setParticipants(users.map((user) => user.id))
  }

  const clearAllParticipants = () => {
    setParticipants([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar nuevo gasto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ej., Supermercado"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto ($)</Label>
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
            <Label htmlFor="category">Categoría</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center">
                      <cat.icon className="h-4 w-4 mr-2" />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paidBy">Pagado por</Label>
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
            <div className="flex items-center justify-between">
              <Label>Dividir entre</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllParticipants}
                  className="h-7 text-xs"
                >
                  Seleccionar todos
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAllParticipants}
                  className="h-7 text-xs"
                >
                  Limpiar
                </Button>
              </div>
            </div>
            <div className="space-y-2 border rounded-md p-3 dark:border-gray-700">
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`user-${user.id}`}
                    checked={participants.includes(user.id)}
                    onCheckedChange={() => handleParticipantToggle(user.id)}
                  />
                  <Label htmlFor={`user-${user.id}`} className="cursor-pointer">
                    {user.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="split-equally"
                checked={splitEqually}
                onCheckedChange={(checked) => setSplitEqually(!!checked)}
              />
              <Label htmlFor="split-equally">Dividir equitativamente</Label>
            </div>
            {!splitEqually && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-sm text-yellow-800 dark:text-yellow-300">
                Los montos personalizados aún no están implementados. El gasto se dividirá equitativamente.
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agrega detalles adicionales..."
              className="resize-none"
              rows={3}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-mint hover:bg-mint/90 text-white dark:hover:bg-mint/80"
              disabled={loading || !title || !amount || !paidBy || participants.length === 0 || !category}
            >
              {loading ? "Agregando..." : "Agregar gasto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
