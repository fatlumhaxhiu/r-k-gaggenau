import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/AdminSidebar"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/admin/admin-login")
  }

  // Fetch counts for the Dashboard
  const leadsCount = await prisma.lead.count()
  const postsCount = await prisma.blogPost.count()
  const recentLeads = await prisma.lead.findMany({
    take: 5,
    orderBy: { created_at: "desc" },
  })

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 pl-64">
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm border-b border-zinc-200 dark:border-zinc-800 flex justify-end items-center px-8 h-16">
          <div className="flex items-center space-x-4">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Administrator Portal</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-700 text-sm">shield</span>
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8 max-w-7xl mx-auto">
          <header className="mb-6">
            <span className="text-[10px] font-bold text-emerald-600 tracking-[0.2em] uppercase">Executive Overview</span>
            <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mt-1">Dashboard</h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 transition-all hover:shadow-md">
              <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Total Leads</h3>
              <p className="text-3xl font-headline font-black text-emerald-800 mt-1">{leadsCount}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 transition-all hover:shadow-md">
              <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Blog Posts</h3>
              <p className="text-3xl font-headline font-black text-emerald-800 mt-1">{postsCount}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 transition-all hover:shadow-md">
              <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Active Status</h3>
              <p className="text-3xl font-headline font-black text-emerald-600 mt-1 flex items-center gap-2">
                Online <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden border border-zinc-100">
              <div className="p-6 border-b border-zinc-50 flex justify-between items-center">
                <h3 className="font-headline font-bold text-lg">Inquiries e Fundit</h3>
                <Link className="text-emerald-700 text-sm font-semibold hover:underline" href="/admin/crm-system">Shiko të Gjitha</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50/50 text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 text-sm">
                    {recentLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold">{lead.first_name} {lead.last_name}</td>
                        <td className="px-6 py-4 text-zinc-600">{lead.service_requested}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase">{lead.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-emerald-900 text-white p-8 rounded-2xl relative overflow-hidden">
                <h3 className="font-headline font-bold text-xl mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/admin/blog-manager" className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-4 px-6 transition-all font-bold text-sm">
                    <span className="material-symbols-outlined">add_circle</span>
                    Krijo Blog Post
                  </Link>
                  <Link href="/admin/crm-system" className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-4 px-6 transition-all font-bold text-sm">
                    <span className="material-symbols-outlined">group</span>
                    Menaxho Inquiries
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </main>
    </div>
  )
}