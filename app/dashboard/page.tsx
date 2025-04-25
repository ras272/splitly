"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateBalances } from "@/lib/expense-utils"
import { Home, RefreshCw, Plus, Users } from "lucide-react"
import Navbar from "@/components/navbar"
import TransactionList from "@/components/transaction-list"
import BalanceSummary from "@/components/balance-summary"
import AddExpenseModal from "@/components/add-expense-modal"
import SettleUpModal from "@/components/settle-up-modal"
import LoanModal from "@/components/loan-modal"
import CreateGroupModal from "@/components/create-group-modal"
import ActionButtons from "@/components/action-buttons"
import { useAuth } from "@/hooks/use-auth"
import {
  getCurrentUser,
  getUserGroups,
  getGroupTransactions,
  getGroupMembers,
  createTransaction,
  createGroup,
  mapSupabaseTransactionToTransaction,
  mapSupabaseUserToUser,
} from "@/lib/supabase-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// Types
export type User = {
  id: string
  name: string
  avatar: string
}

export type TransactionType = "expense" | "settlement" | "loan"

export type Transaction = {
  id: string
  title: string
  amount: number
  paidBy: string
  paidTo?: string
  splitBetween: string[]
  date: Date
  type: TransactionType
  category?: string
  notes?: string
}

export type Expense = Omit<Transaction, "paidTo"> & { type: "expense" }

export default function Dashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [refreshing, setRefreshing] = useState(false)

  // Modal states
  const [addExpenseOpen, setAddExpenseOpen] = useState(false)
  const [settleUpOpen, setSettleUpOpen] = useState(false)
  const [loanOpen, setLoanOpen] = useState(false)
  const [createGroupOpen, setCreateGroupOpen] = useState(false)

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Obtener el usuario actual
      const currentUser = await getCurrentUser()

      if (!currentUser) {
        setError("No se pudo obtener el usuario actual")
        return
      }

      // Obtener los grupos del usuario
      const userGroups = await getUserGroups(currentUser.id)
      setGroups(userGroups.map((group) => ({ id: group.id, name: group.name })))

      // Si hay grupos, seleccionar el primero por defecto
      if (userGroups.length > 0) {
        const defaultGroupId = userGroups[0].id
        setSelectedGroupId(defaultGroupId)

        // Obtener las transacciones del grupo
        const groupTransactions = await getGroupTransactions(defaultGroupId)
        setTransactions(groupTransactions.map(mapSupabaseTransactionToTransaction))

        // Obtener los miembros del grupo
        const groupMembers = await getGroupMembers(defaultGroupId)
        setUsers(groupMembers.map(mapSupabaseUserToUser))
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Ocurrió un error al cargar los datos. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch data for a specific group
  const fetchGroupData = async (groupId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Obtener las transacciones del grupo
      const groupTransactions = await getGroupTransactions(groupId)
      setTransactions(groupTransactions.map(mapSupabaseTransactionToTransaction))

      // Obtener los miembros del grupo
      const groupMembers = await getGroupMembers(groupId)
      setUsers(groupMembers.map(mapSupabaseUserToUser))
    } catch (err) {
      console.error("Error fetching group data:", err)
      setError("Ocurrió un error al cargar los datos del grupo. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [])

  // Fetch data when group changes
  useEffect(() => {
    if (selectedGroupId) {
      fetchGroupData(selectedGroupId)
    }
  }, [selectedGroupId])

  // Calculate balances
  const balances = calculateBalances(transactions, users)

  // Current user (from users array)
  const currentUser = users.find((u) => u.id === user?.id) || (users.length > 0 ? users[0] : null)

  // Add new transaction
  const handleAddTransaction = async (transaction: Omit<Transaction, "id" | "date">) => {
    if (!selectedGroupId || !user) return

    try {
      setError(null)

      // Crear la transacción en Supabase
      const newTransaction = await createTransaction({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        paid_by: transaction.paidBy,
        paid_to: transaction.paidTo,
        split_between: transaction.splitBetween,
        group_id: selectedGroupId,
        category: transaction.category,
        notes: transaction.notes,
      })

      if (newTransaction) {
        // Actualizar la lista de transacciones
        setTransactions((prev) => [mapSupabaseTransactionToTransaction(newTransaction), ...prev])

        toast({
          title: "Transacción agregada",
          description: "La transacción se ha agregado correctamente.",
        })
      }
    } catch (err) {
      console.error("Error adding transaction:", err)
      setError("Ocurrió un error al agregar la transacción. Por favor, intenta de nuevo.")
    }
  }

  // Create new group
  const handleCreateGroup = async (name: string) => {
    if (!user) return

    try {
      // Crear el grupo en Supabase
      const newGroup = await createGroup(name, user.id)

      if (newGroup) {
        // Actualizar la lista de grupos
        setGroups((prev) => [{ id: newGroup.id, name: newGroup.name }, ...prev])

        // Seleccionar el nuevo grupo
        setSelectedGroupId(newGroup.id)

        toast({
          title: "Grupo creado",
          description: `El grupo "${name}" se ha creado correctamente.`,
        })
      }
    } catch (err) {
      console.error("Error creating group:", err)
      throw new Error("Ocurrió un error al crear el grupo. Por favor, intenta de nuevo.")
    }
  }

  // Refresh data
  const handleRefresh = async () => {
    if (!selectedGroupId) return

    setRefreshing(true)
    await fetchGroupData(selectedGroupId)
    setRefreshing(false)
  }

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar currentUser={currentUser || { id: "unknown", name: "Usuario", avatar: "/placeholder.svg" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {user ? `Bienvenido, ${user.email}` : "Administra tus gastos compartidos"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2">
              <Button
                onClick={() => setCreateGroupOpen(true)}
                className="bg-mint text-white hover:bg-mint/90 dark:hover:bg-mint/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo grupo
              </Button>

              {groups.length > 0 && (
                <Select value={selectedGroupId || undefined} onValueChange={setSelectedGroupId}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Seleccionar grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing} className="h-10 w-10">
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                <span className="sr-only">Actualizar</span>
              </Button>
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <Home className="h-4 w-4" />
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {groups.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-mint/10 text-mint">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-medium mb-2">No tienes grupos</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Crea un grupo para comenzar a administrar tus gastos compartidos con amigos, compañeros de piso o
                familia.
              </p>
              <Button
                onClick={() => setCreateGroupOpen(true)}
                className="bg-mint hover:bg-mint/90 dark:hover:bg-mint/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear mi primer grupo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle>Transacciones recientes</CardTitle>
                  <ActionButtons
                    onAddExpense={() => setAddExpenseOpen(true)}
                    onSettleUp={() => setSettleUpOpen(true)}
                    onLoan={() => setLoanOpen(true)}
                  />
                </CardHeader>
                <CardContent>
                  <TransactionList transactions={transactions} users={users} />
                </CardContent>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {currentUser && (
                <BalanceSummary
                  balances={balances}
                  currentUser={currentUser}
                  users={users}
                  transactions={transactions}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <CreateGroupModal
        isOpen={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        onCreateGroup={handleCreateGroup}
      />

      {selectedGroupId && currentUser && (
        <>
          <AddExpenseModal
            isOpen={addExpenseOpen}
            onClose={() => setAddExpenseOpen(false)}
            onAddExpense={(expense) => handleAddTransaction({ ...expense, type: "expense" })}
            users={users}
          />

          <SettleUpModal
            isOpen={settleUpOpen}
            onClose={() => setSettleUpOpen(false)}
            onSettleUp={(settlement) => handleAddTransaction({ ...settlement, type: "settlement" })}
            users={users}
            balances={balances}
            currentUser={currentUser}
          />

          <LoanModal
            isOpen={loanOpen}
            onClose={() => setLoanOpen(false)}
            onAddLoan={(loan) => handleAddTransaction({ ...loan, type: "loan" })}
            users={users}
            currentUser={currentUser}
          />
        </>
      )}
    </div>
  )
}
