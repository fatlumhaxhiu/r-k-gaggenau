import Link from "next/link";
export default function CrmSystemPage() {
  return (
    <>
      
{/*  SideNavBar Implementation  */}
<aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant/15 flex flex-col py-6 bg-zinc-50 dark:bg-zinc-900 z-50">
<div className="px-6 mb-10">
<h1 className="font-headline font-extrabold text-emerald-800 dark:text-emerald-200 text-xl tracking-tight">Management</h1>
<p className="font-label text-xs uppercase tracking-widest text-on-surface-variant/60 mt-1">R&amp;K Admin Portal</p>
</div>
<nav className="flex-1 space-y-1">
{/*  Active Tab: CRM  */}
<Link className="flex items-center px-4 py-3 mx-2 my-1 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg font-inter font-medium text-sm hover:translate-x-1 transition-transform" href="/admin/dashboard">
<span className="material-symbols-outlined mr-3">dashboard</span>
<span>Dashboard</span>
</Link>
<Link className="flex items-center px-4 py-3 mx-2 my-1 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg font-inter font-medium text-sm hover:translate-x-1 transition-transform" href="/admin/blog-manager">
<span className="material-symbols-outlined mr-3">article</span>
<span>Blog</span>
</Link><Link className="flex items-center px-4 py-3 mx-2 my-1 bg-emerald-600 text-white rounded-lg shadow-md font-inter font-medium text-sm transition-all brightness-110" href="/admin/crm-system">
<span className="material-symbols-outlined mr-3">group</span>
<span>CRM</span>
</Link>
</nav>
<div className="px-6 pt-6 border-t border-outline-variant/10">
<div className="flex items-center gap-3">
<img alt="Admin User Profile" className="w-10 h-10 rounded-full object-cover grayscale" data-alt="professional headshot of a mature businessman in a sharp navy suit with neutral studio lighting and clean background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfaEzQeMTNXCKhKrir6M2uIXyKpBoL8So9pMqq7GzNm-Ok5YRAdXCtXuh-5xSLKFoL65cMyERcJqlgazUXqxiZ7HaIyyMU2BwSwzzsXCVprOAeSPkkYq5U7Y2W6sBDnlLJIj0ceD37rRdSDXqy6qWTtiSIo8kje9LXTf-pP0k9evoz0V-NkODmntVApaRwmUzxUuaZXD0J_JETA7EfaZqZMPdKqZ3JJf21t-E_acCkmatApB4giOixq15aHaUcBEIEY_vjOv7hlOQ"/>
<div>
<p className="text-xs font-bold">Admin User</p>
<p className="text-[10px] text-on-surface-variant">System Administrator</p>
</div>
</div>
</div>
</aside>
{/*  Main Content Area  */}
<main className="ml-64 min-h-screen">
{/*  TopNavBar Implementation  */}
<header className="sticky top-0 z-40 w-full h-16 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 shadow-sm flex justify-between items-center px-8">
<div className="flex items-center gap-4 flex-1">
<div className="relative w-full max-w-md group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">search</span>
<input className="w-full bg-surface-container-high border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/40" placeholder="Search leads, names, or services..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full p-2 transition-all active:scale-90 duration-150">
<span className="material-symbols-outlined text-on-surface-variant">notifications</span>
</button>
<button className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full p-2 transition-all active:scale-90 duration-150">
<span className="material-symbols-outlined text-on-surface-variant">visibility</span>
</button>
<div className="h-8 w-px bg-outline-variant/20 mx-2"></div>
<h2 className="font-headline font-bold text-emerald-600">Lead Manager</h2>
</div>
</header>
{/*  CRM Content  */}
<div className="p-8 max-w-7xl mx-auto">
{/*  Page Header & Stats  */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
<div>
<span className="font-label text-xs font-semibold tracking-widest text-secondary uppercase mb-2 block">Executive Overview</span>
<h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">Client Relations</h1>
</div>
<div className="flex gap-3">
<button className="flex items-center gap-2 px-6 py-3 border border-outline-variant/30 rounded-lg text-primary font-semibold text-sm hover:bg-surface-container-low transition-colors">
<span className="material-symbols-outlined text-lg">download</span>
                        Export Leads
                    </button>
<button className="bg-primary-gradient text-on-primary px-6 py-3 rounded-lg font-semibold text-sm shadow-md hover:brightness-110 transition-all flex items-center gap-2">
<span className="material-symbols-outlined text-lg">add</span>
                        New Lead
                    </button>
</div>
</div>
{/*  Dashboard Metric Cards  */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
<div className="bg-surface-container-lowest p-6 rounded-xl editorial-shadow border border-white/50">
<p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Total Opportunities</p>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-headline font-bold text-on-surface">1,284</span>
<span className="text-xs font-bold text-primary">+12%</span>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl editorial-shadow border border-white/50">
<p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">New Today</p>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-headline font-bold text-on-surface">24</span>
<span className="text-xs font-bold text-primary">+5</span>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl editorial-shadow border border-white/50">
<p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Conversion Rate</p>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-headline font-bold text-on-surface">18.4%</span>
<span className="text-xs font-bold text-secondary-container text-secondary">Healthy</span>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl editorial-shadow border border-white/50">
<p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Avg. Response</p>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-headline font-bold text-on-surface">42m</span>
<span className="text-xs font-bold text-on-tertiary-fixed-variant">Priority</span>
</div>
</div>
</div>
{/*  Filters Bar  */}
<div className="bg-surface-container-low p-4 rounded-xl mb-6 flex flex-wrap items-center gap-4">
<div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest rounded-lg text-sm border border-outline-variant/10">
<span className="material-symbols-outlined text-sm text-on-surface-variant">calendar_today</span>
<span className="font-medium">Last 30 Days</span>
</div>
<div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest rounded-lg text-sm border border-outline-variant/10">
<span className="material-symbols-outlined text-sm text-on-surface-variant">filter_list</span>
<span className="font-medium">All Services</span>
</div>
<div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest rounded-lg text-sm border border-outline-variant/10">
<span className="material-symbols-outlined text-sm text-on-surface-variant">star</span>
<span className="font-medium">All Statuses</span>
</div>
<div className="ml-auto flex items-center text-xs text-on-surface-variant font-medium">
                    Showing 12 of 1,284 leads
                </div>
</div>
{/*  Lead Table  */}
<div className="bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden border border-outline-variant/10">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container border-b border-outline-variant/10">
<th className="px-6 py-4 font-label text-[10px] uppercase tracking-wider text-on-surface-variant">Contact</th>
<th className="px-6 py-4 font-label text-[10px] uppercase tracking-wider text-on-surface-variant">Service Requested</th>
<th className="px-6 py-4 font-label text-[10px] uppercase tracking-wider text-on-surface-variant">Source</th>
<th className="px-6 py-4 font-label text-[10px] uppercase tracking-wider text-on-surface-variant">Date</th>
<th className="px-6 py-4 font-label text-[10px] uppercase tracking-wider text-on-surface-variant">Status</th>
<th className="px-6 py-4 font-label text-[10px] uppercase tracking-wider text-on-surface-variant text-right">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/5">
{/*  Table Row 1  */}
<tr className="hover:bg-surface transition-colors cursor-pointer group">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
                                        JD
                                    </div>
<div>
<p className="font-bold text-sm text-on-surface">Julianne Davenport</p>
<p className="text-xs text-on-surface-variant">j.davenport@corporate.com</p>
</div>
</div>
</td>
<td className="px-6 py-5">
<span className="text-sm font-medium px-3 py-1 bg-secondary-fixed/30 text-secondary rounded-full">Deep Post-Construction</span>
</td>
<td className="px-6 py-5">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-sm text-on-surface-variant">web</span>
<span className="text-xs text-on-surface-variant">Gaggenau Landing Page</span>
</div>
</td>
<td className="px-6 py-5">
<p className="text-sm text-on-surface">Oct 24, 2023</p>
<p className="text-[10px] text-on-surface-variant">10:45 AM</p>
</td>
<td className="px-6 py-5">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    New
                                </span>
</td>
<td className="px-6 py-5 text-right">
<button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
<span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
</button>
</td>
</tr>
{/*  Table Row 2  */}
<tr className="hover:bg-surface transition-colors cursor-pointer group">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-bold text-sm">
                                        MR
                                    </div>
<div>
<p className="font-bold text-sm text-on-surface">Marcus Rhone</p>
<p className="text-xs text-on-surface-variant">mrhone@designstudio.de</p>
</div>
</div>
</td>
<td className="px-6 py-5">
<span className="text-sm font-medium px-3 py-1 bg-secondary-fixed/30 text-secondary rounded-full">Office Maintenance</span>
</td>
<td className="px-6 py-5">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-sm text-on-surface-variant">mail</span>
<span className="text-xs text-on-surface-variant">Contact Form</span>
</div>
</td>
<td className="px-6 py-5">
<p className="text-sm text-on-surface">Oct 23, 2023</p>
<p className="text-[10px] text-on-surface-variant">02:15 PM</p>
</td>
<td className="px-6 py-5">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
<span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    Contacted
                                </span>
</td>
<td className="px-6 py-5 text-right">
<button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
<span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
</button>
</td>
</tr>
{/*  Table Row 3  */}
<tr className="hover:bg-surface transition-colors cursor-pointer group">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary font-bold text-sm">
                                        SH
                                    </div>
<div>
<p className="font-bold text-sm text-on-surface">Sarah Helder</p>
<p className="text-xs text-on-surface-variant">sarah.h@lifestyle.com</p>
</div>
</div>
</td>
<td className="px-6 py-5">
<span className="text-sm font-medium px-3 py-1 bg-secondary-fixed/30 text-secondary rounded-full">Luxury Residential</span>
</td>
<td className="px-6 py-5">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-sm text-on-surface-variant">ads_click</span>
<span className="text-xs text-on-surface-variant">Google Ads</span>
</div>
</td>
<td className="px-6 py-5">
<p className="text-sm text-on-surface">Oct 22, 2023</p>
<p className="text-[10px] text-on-surface-variant">09:00 AM</p>
</td>
<td className="px-6 py-5">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary text-on-primary">
<span className="w-1.5 h-1.5 rounded-full bg-primary-fixed"></span>
                                    Converted
                                </span>
</td>
<td className="px-6 py-5 text-right">
<button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
<span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
<div className="px-6 py-4 bg-surface-container border-t border-outline-variant/10 flex justify-between items-center">
<span className="text-xs text-on-surface-variant">Page 1 of 107</span>
<div className="flex gap-2">
<button className="p-2 rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-sm">chevron_left</span>
</button>
<button className="p-2 rounded-lg border border-outline-variant/20 bg-primary-container text-on-primary-container font-bold text-xs px-4">1</button>
<button className="p-2 rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-colors font-medium text-xs px-4">2</button>
<button className="p-2 rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-colors font-medium text-xs px-4">3</button>
<button className="p-2 rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
</main>
{/*  Side Detail Panel (Asymmetric Editorial Style)  */}
<div className="fixed top-0 right-0 h-screen w-[450px] bg-white shadow-2xl z-[60] border-l border-outline-variant/10 flex flex-col translate-x-0 transition-transform">
<div className="p-8 flex justify-between items-center border-b border-outline-variant/10">
<h3 className="font-headline font-bold text-xl">Lead Details</h3>
<button className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center">
<span className="material-symbols-outlined">close</span>
</button>
</div>
<div className="flex-1 overflow-y-auto p-8">
{/*  Hero Header in Detail  */}
<div className="flex items-center gap-6 mb-10">
<div className="w-20 h-20 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary font-bold text-3xl">JD</div>
<div>
<h2 className="font-headline text-2xl font-extrabold text-on-surface">Julianne Davenport</h2>
<div className="flex items-center gap-2 mt-1">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">New</span>
<span className="text-xs text-on-surface-variant font-medium">Lead ID: #GK-99234</span>
</div>
</div>
</div>
{/*  Detail Grid  */}
<div className="space-y-8">
<section>
<p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Contact Information</p>
<div className="space-y-4">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-secondary text-xl">mail</span>
<div>
<p className="text-xs text-on-surface-variant">Email Address</p>
<p className="text-sm font-semibold">j.davenport@corporate.com</p>
</div>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-secondary text-xl">call</span>
<div>
<p className="text-xs text-on-surface-variant">Phone Number</p>
<p className="text-sm font-semibold">+49 172 8832 994</p>
</div>
</div>
</div>
</section>
<section>
<p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Project Scope</p>
<div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden">
<div className="absolute -right-4 -top-4 opacity-10">
<span className="material-symbols-outlined text-7xl" >cleaning_services</span>
</div>
<h4 className="font-headline font-bold text-on-surface mb-1">Deep Post-Construction</h4>
<p className="text-xs text-on-surface-variant leading-relaxed">
                            Requested for a newly renovated 450sqm penthouse in Central Gaggenau. Focus on dust removal from high ceilings and architectural fixtures.
                        </p>
<div className="mt-4 flex flex-wrap gap-2">
<span className="text-[10px] font-bold bg-white px-2 py-1 rounded border border-outline-variant/10">Premium</span>
<span className="text-[10px] font-bold bg-white px-2 py-1 rounded border border-outline-variant/10">450 m²</span>
<span className="text-[10px] font-bold bg-white px-2 py-1 rounded border border-outline-variant/10">Gaggenau District</span>
</div>
</div>
</section>
<section>
<p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Inquiry Message</p>
<div className="bg-white border-l-4 border-primary p-4 editorial-shadow italic text-sm text-on-surface-variant">
                        "We just finished a major renovation and need the property 'show-ready' by Friday morning. We require specialized care for Gaggenau-specific stone surfaces and high-polish metal fixtures. Please call as soon as possible."
                    </div>
</section>
</div>
</div>
<div className="p-8 border-t border-outline-variant/10 bg-surface-container-lowest grid grid-cols-2 gap-4">
<button className="w-full py-4 border border-outline-variant/30 rounded-lg font-bold text-sm text-on-surface hover:bg-surface-container transition-colors">
                Archive Lead
            </button>
<button className="w-full py-4 bg-primary-gradient text-on-primary rounded-lg font-bold text-sm shadow-lg hover:brightness-110 transition-all">
                Mark as Contacted
            </button>
</div>
</div>

    </>
  );
}