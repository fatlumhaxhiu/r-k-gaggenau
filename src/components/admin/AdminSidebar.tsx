"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", icon: "dashboard", href: "/admin/dashboard" },
    { name: "Blog", icon: "edit_note", href: "/admin/blog-manager" },
    { name: "CRM", icon: "group", href: "/admin/crm-system" },
  ]

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col py-6 z-50">
      <div className="px-6 mb-8">
        <h1 className="font-headline font-extrabold text-emerald-800 dark:text-emerald-200 text-xl tracking-tighter">R&K-Gaggenau</h1>
        <div className="mt-4">
          <p className="font-inter font-medium text-sm text-emerald-600 dark:text-emerald-400">Management</p>
          <p className="text-xs text-zinc-500">R&K Admin Portal</p>
        </div>
      </div>

      <nav className="grow space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 mx-2 my-1 rounded-lg transition-all font-inter font-medium text-sm ${
                isActive 
                  ? "bg-emerald-600 text-white shadow-md brightness-110" 
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:translate-x-1"
              }`}
            >
              <span className="material-symbols-outlined mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-4 mt-auto">
        <div className="flex items-center p-3 bg-white/50 dark:bg-zinc-800/50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-xs font-bold truncate">Administrator</p>
            <button 
              onClick={() => signOut({ callbackUrl: "/admin/admin-login" })}
              className="text-[10px] text-error font-bold hover:underline text-left block"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
