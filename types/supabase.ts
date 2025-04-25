export type SupabaseUser = {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

export type SupabaseGroup = {
  id: string
  name: string
  created_at: string
  created_by: string
  members: string[]
}

export type SupabaseTransaction = {
  id: string
  title: string
  amount: number
  type: "expense" | "settlement" | "loan"
  paid_by: string
  paid_to?: string
  split_between: string[]
  group_id: string
  category?: string
  notes?: string
  created_at: string
}
