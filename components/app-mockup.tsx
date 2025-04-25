import { DollarSign, Home, Receipt, CreditCard, Users } from "lucide-react"

export function AppMockup() {
  return (
    <div className="relative mx-auto w-[300px] md:w-[350px]">
      <div className="overflow-hidden rounded-3xl border-8 border-white bg-white shadow-xl">
        {/* App header */}
        <div className="bg-mint px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">Splitly</span>
            </div>
            <div className="flex space-x-1">
              <div className="h-2 w-2 rounded-full bg-white/30"></div>
              <div className="h-2 w-2 rounded-full bg-white/30"></div>
              <div className="h-2 w-2 rounded-full bg-white/30"></div>
            </div>
          </div>
        </div>

        {/* App content */}
        <div className="p-4">
          <div className="mb-4 rounded-lg bg-light-gray p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-mint" />
                <span className="text-sm font-medium">Apartment 304</span>
              </div>
              <span className="text-xs text-gray-500">3 members</span>
            </div>
            <div className="h-1 w-full rounded-full bg-gray-200">
              <div className="h-1 w-2/3 rounded-full bg-mint"></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium">Rent - May</span>
                <span className="font-bold text-mint">$1,200.00</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="h-3 w-3" />
                <span>Split equally • Paid by Alex</span>
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium">Groceries</span>
                <span className="font-bold text-soft-blue">$89.50</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Receipt className="h-3 w-3" />
                <span>Split equally • Paid by you</span>
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium">Internet</span>
                <span className="font-bold text-soft-blue">$60.00</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <CreditCard className="h-3 w-3" />
                <span>Split equally • Paid by Jamie</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-mint/10 p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-medium text-mint">Your balance</span>
              <span className="font-bold text-mint">$-45.83</span>
            </div>
            <div className="text-xs text-mint/80">You owe Alex $45.83</div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-beige shadow-md"></div>
      <div className="absolute -left-4 top-1/4 h-8 w-8 rounded-full bg-soft-blue/30"></div>
      <div className="absolute -top-4 right-1/4 h-12 w-12 rounded-full bg-mint/20"></div>
    </div>
  )
}
