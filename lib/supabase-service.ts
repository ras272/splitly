import { supabase } from "@/lib/supabase"
import type { SupabaseUser, SupabaseGroup, SupabaseTransaction } from "@/types/supabase"
import type { User, Transaction } from "@/app/dashboard/page"

// Obtener el usuario actual
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    throw new Error(error.message)
  }
  return data.user
}

// Obtener el perfil del usuario
export async function getUserProfile(userId: string): Promise<SupabaseUser | null> {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

// Obtener todos los grupos del usuario
export async function getUserGroups(userId: string): Promise<SupabaseGroup[]> {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .contains("members", [userId])
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user groups:", error)
    return []
  }

  return data || []
}

// Crear un nuevo grupo
export async function createGroup(name: string, userId: string): Promise<SupabaseGroup | null> {
  const newGroup = {
    name,
    created_by: userId,
    members: [userId],
  }

  const { data, error } = await supabase.from("groups").insert([newGroup]).select().single()

  if (error) {
    console.error("Error creating group:", error)
    throw new Error(error.message)
  }

  return data
}

// Obtener un grupo específico
export async function getGroup(groupId: string): Promise<SupabaseGroup | null> {
  const { data, error } = await supabase.from("groups").select("*").eq("id", groupId).single()

  if (error) {
    console.error("Error fetching group:", error)
    return null
  }

  return data
}

// Obtener las transacciones de un grupo
export async function getGroupTransactions(groupId: string): Promise<SupabaseTransaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching group transactions:", error)
    return []
  }

  return data || []
}

// Obtener los miembros de un grupo
export async function getGroupMembers(groupId: string): Promise<SupabaseUser[]> {
  // Primero obtenemos el grupo para saber los IDs de los miembros
  const group = await getGroup(groupId)

  if (!group || !group.members.length) {
    return []
  }

  // Luego obtenemos los perfiles de los miembros
  const { data, error } = await supabase.from("users").select("*").in("id", group.members)

  if (error) {
    console.error("Error fetching group members:", error)
    return []
  }

  return data || []
}

// Crear una nueva transacción
export async function createTransaction(
  transaction: Omit<SupabaseTransaction, "id" | "created_at">,
): Promise<SupabaseTransaction | null> {
  const { data, error } = await supabase.from("transactions").insert([transaction]).select().single()

  if (error) {
    console.error("Error creating transaction:", error)
    return null
  }

  return data
}

// Convertir SupabaseTransaction a Transaction (para compatibilidad con componentes existentes)
export function mapSupabaseTransactionToTransaction(transaction: SupabaseTransaction): Transaction {
  return {
    id: transaction.id,
    title: transaction.title,
    amount: transaction.amount,
    paidBy: transaction.paid_by,
    paidTo: transaction.paid_to,
    splitBetween: transaction.split_between,
    date: new Date(transaction.created_at),
    type: transaction.type,
    category: transaction.category,
    notes: transaction.notes,
  }
}

// Convertir SupabaseUser a User (para compatibilidad con componentes existentes)
export function mapSupabaseUserToUser(user: SupabaseUser): User {
  return {
    id: user.id,
    name: user.name || user.email?.split("@")[0] || "User",
    avatar: user.avatar_url || "/placeholder.svg?height=40&width=40",
  }
}

// Delete a transaction by ID
export async function deleteTransaction(transactionId: string): Promise<void> {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId); // Filter by transaction ID

  if (error) {
    console.error("Error deleting transaction:", error);
    // Re-throw the error so it can be caught by the calling function (in page.tsx)
    throw new Error(error.message); 
  }
  
  // If deletion is successful, RLS allowed it, and no error occurred.
  // No explicit return value is needed for a successful delete.
}
