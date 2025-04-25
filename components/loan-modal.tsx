"use client"

import type React from "react"
import { useState } from "react"
import type { Transaction, User } from "@/app/dashboard/page"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { HandCoins } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface LoanModalProps {
  isOpen: boolean
  onClose: () => void
  onAddLoan: (loan: Omit<Transaction, "id" | "date" | "type">) => void
  users: User[]
  currentUser: User
}

export default function LoanModal({ isOpen, onClose, onAddLoan, users, currentUser }: LoanModalProps) {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [loanType, setLoanType] = useState<"giving" | "receiving">("giving")
  const [otherPerson, setOtherPerson] = useState("")
  const [notes, setNotes] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !amount || !otherPerson) {
      return
    }

    const paidBy = loanType === "giving" ? currentUser.id : otherPerson
    const paidTo = loanType === "giving" ? otherPerson : currentUser.id

    try {
      setLoading(true)
      setError(null)

      await onAddLoan({
        title,
        amount: Number.parseFloat(amount),
        paidBy,
        paidTo,
        splitBetween: [paidBy, paidTo],
        notes: `${notes.trim()}${dueDate ? ` Due: ${dueDate}` : ""}`,
      })

      // Reset form
      setTitle("")
      setAmount("")
      setLoanType("giving")
      setOtherPerson("")
      setNotes("")
      setDueDate("")

      // Close modal
      onClose()
    } catch (err) {
      console.error("Error adding loan:", err)
      setError("Ocurrió un error al agregar el préstamo. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <HandCoins className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
            Agregar préstamo
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
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ej., Entradas para concierto"
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
            <Label>Tipo de préstamo</Label>
            <RadioGroup
              value={loanType}
              onValueChange={(value) => setLoanType(value as "giving" | "receiving")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="giving" id="giving" />
                <Label htmlFor="giving">Estoy prestando dinero</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="receiving" id="receiving" />
                <Label htmlFor="receiving">Estoy pidiendo prestado</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherPerson">{loanType === "giving" ? "Prestando a" : "Pidiendo prestado a"}</Label>
            <Select value={otherPerson} onValueChange={setOtherPerson} required>
              <SelectTrigger id="otherPerson">
                <SelectValue placeholder="Seleccionar persona" />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter((user) => user.id !== currentUser.id)
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Fecha de vencimiento (opcional)</Label>
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
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
              className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700"
              disabled={loading || !title || !amount || !otherPerson}
            >
              {loading ? "Agregando..." : "Agregar préstamo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
