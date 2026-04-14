import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LeadsTableClient from "@/components/admin/LeadsTableClient";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function CrmSystemPage() {
  const session = await auth()

  if (!session) {
    redirect("/admin/admin-login text-sm")
  }

  // Fetch all leads from database
  const leads = await prisma.lead.findMany({
    orderBy: { created_at: "desc" },
  });

  // Simple KPI calculations
  const totalLeads = leads.length;
  
  // Calculate new today
  const today = new Date();
  today.setHours(0,0,0,0);
  const newToday = leads.filter(l => l.created_at && l.created_at >= today).length;

  // Conversion rate
  const converted = leads.filter(l => l.status === "converted").length;
  const convRate = totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) : 0;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm border-b border-zinc-200 dark:border-zinc-800 flex justify-end items-center px-8 h-16">
          <div className="flex items-center space-x-4">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Administrator Portal</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-700 text-sm">shield</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="font-label text-xs uppercase tracking-widest text-emerald-600 font-bold mb-2 block">Relationship Management</span>
              <h2 className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface">CRM Leads</h2>
            </div>
          </div>

          {/* KPI Mini-Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
              <p className="font-label text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Total Inquiries</p>
              <p className="font-headline text-3xl font-bold text-emerald-800">{totalLeads}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
              <p className="font-label text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">New Today</p>
              <p className="font-headline text-3xl font-bold text-emerald-600">+{newToday}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
              <p className="font-label text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Conversion Rate</p>
              <p className="font-headline text-3xl font-bold text-secondary">{convRate}%</p>
            </div>
          </div>

          {/* Main Table Section */}
          <LeadsTableClient initialLeads={leads} />
        </div>
      </main>
    </div>
  );
}