import { DollarSign } from "lucide-react"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint text-white">
        <DollarSign className="h-5 w-5" />
      </div>
      <span className="text-xl font-bold">Splitly</span>
    </div>
  )
}
