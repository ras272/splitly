"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, Receipt, PieChart, RefreshCw, ArrowRight, Menu, X, Twitter, Mail, FileText, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const { user, profile, loading, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Prevent hydration errors with animations
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/images/splitly-logo.png"
              alt="Splitly Logo"
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900">
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900">
              Testimonials
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900">
              Pricing
            </a>

            {user ? (
              <>
                <span className="text-sm font-medium text-gray-700">
                  Hola, {profile?.name || user.email?.split("@")[0] || "Usuario"}
                </span>
                <Link href="/dashboard">
                  <Button className="bg-mint text-white hover:bg-mint/90 mr-2">Dashboard</Button>
                </Link>
                <Button variant="outline" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="mr-2">
                    Log in
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-mint text-white hover:bg-mint/90">Sign up</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="flex items-center justify-center rounded-md p-2 text-gray-700 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white p-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <a
              href="#features"
              className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#"
              className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <div className="pt-4">
              {user ? (
                <>
                  <p className="px-4 py-2 text-gray-700">
                    Hola, {profile?.name || user.email?.split("@")[0] || "Usuario"}
                  </p>
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full bg-mint text-white hover:bg-mint/90 mb-2">Dashboard</Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full mb-2">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full">
                    <Button className="w-full bg-mint text-white hover:bg-mint/90">Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <motion.div
                className="flex flex-col justify-center space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <span className="inline-block rounded-full bg-mint px-3 py-1 text-sm text-white font-medium">
                    Roommate finances made simple
                  </span>
                </motion.div>
                <motion.h1
                  className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Split bills, not friendships
                </motion.h1>
                <motion.p
                  className="max-w-[600px] text-xl text-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Splitly helps you and your roommates manage shared expenses without stress.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0"
                >
                  {user ? (
                    <Link href="/dashboard">
                      <Button size="lg" className="bg-mint text-white hover:bg-mint/90 group">
                        Ir al Dashboard
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button size="lg" className="bg-mint text-white hover:bg-mint/90 group">
                        Start now
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  )}
                  <Button size="lg" variant="outline">
                    How it works
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="relative mx-auto w-[300px] md:w-[350px]">
                  <div className="overflow-hidden rounded-xl border-4 border-white bg-white shadow-lg">
                    {/* App header */}
                    <div className="bg-mint px-4 py-3 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Splitly</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-white/80"></div>
                          <div className="h-2 w-2 rounded-full bg-white/80"></div>
                          <div className="h-2 w-2 rounded-full bg-white/80"></div>
                        </div>
                      </div>
                    </div>

                    {/* App content */}
                    <div className="p-4">
                      <div className="mb-4 rounded-lg bg-gray-100 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Apartment 304</span>
                          </div>
                          <span className="text-xs text-gray-500">3 members</span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-gray-200">
                          <div className="h-1 w-2/3 rounded-full bg-mint"></div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-medium">Rent - May</span>
                            <span className="font-bold text-mint">$1,200.00</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Users className="h-3 w-3" />
                            <span>Split equally • Paid by Alex</span>
                          </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-medium">Groceries</span>
                            <span className="font-bold text-blue-600">$89.50</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Receipt className="h-3 w-3" />
                            <span>Split equally • Paid by you</span>
                          </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-medium">Internet</span>
                            <span className="font-bold text-blue-600">$60.00</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Receipt className="h-3 w-3" />
                            <span>Split equally • Paid by Jamie</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-lg bg-mint p-3 text-white">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-medium">Your balance</span>
                          <span className="font-bold">$-45.83</span>
                        </div>
                        <div className="text-xs text-white/90">You owe Alex $45.83</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-[800px] text-center">
              <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-sm text-white font-medium">
                Features
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                Everything you need to manage shared expenses
              </h2>
              <p className="mt-4 text-xl text-gray-700">
                Simple tools to track, split, and settle expenses with your roommates.
              </p>
            </div>

            {/* Feature 1 */}
            <motion.div
              className="mb-12 rounded-xl bg-white border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-8 md:p-12">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-mint text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">Create shared groups</h3>
                  <p className="text-gray-700">
                    Set up groups for different living situations or trips. Invite roommates with a simple link and
                    start tracking expenses together instantly.
                  </p>
                </div>
                <div className="bg-gray-50 p-8 md:p-12">
                  <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-mint text-white flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Apartment 304</h4>
                        <p className="text-sm text-gray-500">3 members</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                        JD
                      </div>
                      <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-medium">
                        AS
                      </div>
                      <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium">
                        TK
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="mb-12 rounded-xl bg-white border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="grid md:grid-cols-2 items-center">
                <div className="order-2 md:order-1 bg-gray-50 p-8 md:p-12">
                  <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900">Grocery Shopping</h4>
                      <p className="text-sm text-gray-500">May 15, 2023</p>
                    </div>
                    <div className="mb-3 flex justify-between text-sm">
                      <span className="text-gray-700">Total amount</span>
                      <span className="font-medium text-gray-900">$89.50</span>
                    </div>
                    <div className="mb-3 flex justify-between text-sm">
                      <span className="text-gray-700">Split method</span>
                      <span className="font-medium text-gray-900">Equal (3 people)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Your share</span>
                      <span className="font-medium text-mint">$29.83</span>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2 p-8 md:p-12">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Receipt className="h-6 w-6" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">Split any bill with ease</h3>
                  <p className="text-gray-700">
                    Split bills equally or by custom amounts. Add details and photos of receipts for clarity and keep
                    everyone on the same page.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="mb-12 rounded-xl bg-white border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-8 md:p-12">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white">
                    <PieChart className="h-6 w-6" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">See who owes who</h3>
                  <p className="text-gray-700">
                    Keep a clear record of all expenses and payments. See your balance at a glance and never lose track
                    of who paid what.
                  </p>
                </div>
                <div className="bg-gray-50 p-8 md:p-12">
                  <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
                    <h4 className="mb-3 font-medium text-gray-900">Current Balances</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                            JD
                          </div>
                          <span className="text-gray-700">John D.</span>
                        </div>
                        <span className="font-medium text-red-500">-$45.83</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-medium">
                            AS
                          </div>
                          <span className="text-gray-700">Alex S.</span>
                        </div>
                        <span className="font-medium text-green-500">+$78.50</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium">
                            TK
                          </div>
                          <span className="text-gray-700">Taylor K.</span>
                        </div>
                        <span className="font-medium text-red-500">-$32.67</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              className="rounded-xl bg-white border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="grid md:grid-cols-2 items-center">
                <div className="order-2 md:order-1 bg-gray-50 p-8 md:p-12">
                  <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
                    <h4 className="mb-3 font-medium text-gray-900">Settlement Plan</h4>
                    <div className="space-y-3">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                              JD
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-700">John</span>
                              <ArrowRight className="h-4 w-4 mx-1" />
                              <span className="text-gray-700">Alex</span>
                            </div>
                          </div>
                          <span className="font-medium text-gray-900">$45.83</span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium">
                              TK
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-700">Taylor</span>
                              <ArrowRight className="h-4 w-4 mx-1" />
                              <span className="text-gray-700">Alex</span>
                            </div>
                          </div>
                          <span className="font-medium text-gray-900">$32.67</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2 p-8 md:p-12">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-mint text-white">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">Settle balances later</h3>
                  <p className="text-gray-700">
                    Get smart suggestions on how to settle debts with the fewest possible transactions. Pay back when
                    it's convenient for everyone.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-gray-50 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-[800px] text-center">
              <span className="inline-block rounded-full bg-amber-500 px-3 py-1 text-sm text-white font-medium">
                Testimonials
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                Loved by roommates everywhere
              </h2>
              <p className="mt-4 text-xl text-gray-700">
                See what our users have to say about how Splitly has improved their shared living experience.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Testimonial 1 */}
              <motion.div
                className="rounded-xl bg-white p-6 shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4 flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="#65D6AD"
                      stroke="none"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="mb-6 text-gray-700">
                  "Splitly has completely eliminated awkward money conversations with my roommates. We just check the
                  app and know exactly where we stand."
                </p>
                <div className="flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-mint text-white">
                    <span className="text-sm font-medium">SK</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sarah K.</p>
                    <p className="text-sm text-gray-500">Student, NYC</p>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial 2 */}
              <motion.div
                className="rounded-xl bg-white p-6 shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="mb-4 flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="#65D6AD"
                      stroke="none"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="mb-6 text-gray-700">
                  "We've been using Splitly for our 4-person apartment for over a year. It's saved us so many headaches
                  with utility bills and groceries."
                </p>
                <div className="flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    <span className="text-sm font-medium">MR</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Miguel R.</p>
                    <p className="text-sm text-gray-500">Professional, Chicago</p>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial 3 */}
              <motion.div
                className="rounded-xl bg-white p-6 shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mb-4 flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="#65D6AD"
                      stroke="none"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="mb-6 text-gray-700">
                  "The settle-up feature is brilliant. We can each pay for different things throughout the month and
                  then square up once without any confusion."
                </p>
                <div className="flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white">
                    <span className="text-sm font-medium">JT</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Jamie T.</p>
                    <p className="text-sm text-gray-500">Grad Student, London</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-[800px] text-center">
              <motion.h2
                className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                Ready to stop tracking expenses in messy group chats?
              </motion.h2>
              <motion.p
                className="mt-4 text-xl text-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Join thousands of roommates who are managing their finances stress-free.
              </motion.p>
              <motion.div
                className="mt-8 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link href="/dashboard">
                  <Button size="lg" className="bg-mint text-white hover:bg-mint/90 group">
                    Create your group now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Learn more
                </Button>
              </motion.div>
              <motion.div
                className="mt-8 flex flex-wrap items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-mint"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span className="text-sm text-gray-700">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-mint"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span className="text-sm text-gray-700">Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-mint"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span className="text-sm text-gray-700">24/7 support</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center">
              <Image src="/images/splitly-logo.png" alt="Splitly Logo" width={120} height={35} className="h-7 w-auto" />
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </div>
              </a>
              <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
                <div className="flex items-center gap-1">
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </div>
              </a>
              <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>Contact</span>
                </div>
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Splitly. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
