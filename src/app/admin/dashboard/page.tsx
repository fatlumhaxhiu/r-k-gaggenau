import Link from "next/link";
export default function DashboardPage() {
  return (
    <>
      
{/*  SideNavBar (ID: COMPONENTS_3)  */}
<aside className="h-screen w-64 fixed left-0 top-0 border-r border-zinc-200 bg-zinc-50 flex flex-col py-6 z-50">
<div className="px-6 mb-8">
<h1 className="font-headline font-extrabold text-emerald-800 text-2xl tracking-tighter">Management</h1>
<p className="font-body font-medium text-xs text-zinc-500 uppercase tracking-widest mt-1">R&amp;K Admin Portal</p>
</div>
<nav className="flex-1 space-y-1 px-2 sidebar-scroll overflow-y-auto">
{/*  Dashboard Active  */}
<Link className="flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white rounded-lg mx-2 my-1 shadow-md brightness-110 transition-all font-inter font-medium text-sm" href="/admin/dashboard">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span>Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-200 mx-2 my-1 rounded-lg hover:translate-x-1 transition-transform font-inter font-medium text-sm" href="/admin/blog-manager">
<span className="material-symbols-outlined" data-icon="article">article</span>
<span>Blog</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-200 mx-2 my-1 rounded-lg hover:translate-x-1 transition-transform font-inter font-medium text-sm" href="/admin/blog-manager">
<span className="material-symbols-outlined" data-icon="group">group</span>
<span>CRM</span>
</Link>
</nav>
<div className="px-6 mt-auto pt-6 border-t border-zinc-200/50">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
<img alt="Admin User Profile" className="w-full h-full object-cover" data-alt="professional portrait of a confident business executive in a modern office environment with soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPDSQq5F2deyyJJB5Mt6soRK41NxVqsvCPJlFp2Wmw9b3lCYeyec0yQqhFFqkSTZVh5z-fbpi5s_IgBPEDS4246Tf2sVpznq67mNSY3Mkmkbo0RiSRkXVB08tebX9pjLmiHdpM3n7s82Fo4fb-mt7Uv0XtvhLqVmCVwtZpTESNPL_y3M9XGxZIR55446bOxTJH3y7qEyvKCfbI7ysrCsFpvwES6tQXfGt72TTqaXFxT0IHU3YkS_kvFaILapfBM5YCWWfId_de6Kw"/>
</div>
<div>
<p className="text-sm font-bold text-zinc-800">Alex Reed</p>
<p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Senior Admin</p>
</div>
</div>
</div>
</aside>
{/*  Main Content Wrapper  */}
<div className="pl-64 min-h-screen flex flex-col">
{/*  TopNavBar (ID: COMPONENTS_3 Variant)  */}
<header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-zinc-100 px-8 h-16 flex justify-between items-center">
<div className="flex items-center gap-4 flex-1">
<div className="relative w-full max-w-md">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-surface-container-high border-none rounded-full text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="Search data, leads, or services..." type="text"/>
</div>
</div>
<div className="flex items-center gap-2">
<button className="hover:bg-zinc-100 rounded-full p-2 transition-all active:scale-90 duration-150 relative">
<span className="material-symbols-outlined text-zinc-600" data-icon="notifications">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
</button>
<button className="hover:bg-zinc-100 rounded-full p-2 transition-all active:scale-90 duration-150">
<span className="material-symbols-outlined text-zinc-600" data-icon="visibility">visibility</span>
</button>
<div className="h-8 w-px bg-zinc-200 mx-2"></div>
<div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200">
<img alt="User Avatar" className="w-full h-full object-cover" data-alt="professional headshot of a person for a user profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh4XJeuE1LdLBtX2tgGUwgiRwKrwwL2g56AtHhtiszntt--JWQpj29j_zp7QrveFiAGTf8qxcU765Upjpm1L_Wd7JDyqsK_HdRd_IJtXSRkmFSO8gzI_lHD0KD5hJ0OcBNE-9o7mxt6sWbmSIGO-Av6p09Av_lKoJgosHopvy8Xnr1EKbvLMxF5BXXNmmODrYZvh-EoM51tmPoUYyWhmGs_hRpjJ_GWUhwEe7Z86Ct5MJA6ha_zIxFoD5UKJ5aitf5JJsQ211IyhM"/>
</div>
</div>
</header>
{/*  Canvas  */}
<main className="p-8 space-y-8">
{/*  Hero Stats Bento Grid  */}
<section>
<header className="mb-6 flex justify-between items-end">
<div>
<span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Executive Overview</span>
<h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mt-1">Dashboard</h2>
</div>
<div className="flex gap-3">
<button className="px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-sm">download</span>
                            Export Report
                        </button>
</div>
</header>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{/*  Total Leads  */}
<div className="bg-surface-container-low p-6 rounded-xl border border-transparent hover:border-outline-variant/20 transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined" data-icon="leaderboard">leaderboard</span>
</div>
<span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-xs">trending_up</span> +12%
                            </span>
</div>
<h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Leads</h3>
<p className="text-3xl font-headline font-black text-on-surface mt-1">1,284</p>
</div>
{/*  Active Services  */}
<div className="bg-surface-container-low p-6 rounded-xl border border-transparent hover:border-outline-variant/20 transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="p-3 bg-secondary/10 rounded-lg text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
<span className="material-symbols-outlined" data-icon="cleaning_services">cleaning_services</span>
</div>
<span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-xs">check_circle</span> Stable
                            </span>
</div>
<h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Active Services</h3>
<p className="text-3xl font-headline font-black text-on-surface mt-1">42</p>
</div>
{/*  Published Blog Posts  */}
<div className="bg-surface-container-low p-6 rounded-xl border border-transparent hover:border-outline-variant/20 transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="p-3 bg-tertiary-container/10 rounded-lg text-tertiary group-hover:bg-tertiary group-hover:text-white transition-colors">
<span className="material-symbols-outlined" data-icon="article">article</span>
</div>
<span className="text-zinc-500 text-xs font-bold">8 this month</span>
</div>
<h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Published Blog Posts</h3>
<p className="text-3xl font-headline font-black text-on-surface mt-1">156</p>
</div>
{/*  New Messages  */}
<div className="bg-surface-container-low p-6 rounded-xl border border-transparent hover:border-outline-variant/20 transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="p-3 bg-error-container/10 rounded-lg text-error group-hover:bg-error group-hover:text-white transition-colors">
<span className="material-symbols-outlined" data-icon="mail">mail</span>
</div>
<span className="w-2 h-2 bg-error rounded-full animate-pulse"></span>
</div>
<h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">New Messages</h3>
<p className="text-3xl font-headline font-black text-on-surface mt-1">28</p>
</div>
</div>
</section>
{/*  Main Interactive Section  */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
{/*  CRM Leads Table  */}
<div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-zinc-100">
<div className="p-6 border-b border-zinc-50 flex justify-between items-center">
<h3 className="font-headline font-bold text-lg">Recent CRM Leads</h3>
<a className="text-primary text-sm font-semibold hover:underline" href="#">View All Leads</a>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-zinc-50/50 text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
<tr>
<th className="px-6 py-4">Name</th>
<th className="px-6 py-4">Service</th>
<th className="px-6 py-4">Status</th>
<th className="px-6 py-4">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-zinc-50">
<tr className="hover:bg-zinc-50/80 transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-xs text-zinc-600">JD</div>
<div>
<p className="text-sm font-bold text-on-surface">Julianne DeWitt</p>
<p className="text-[10px] text-zinc-400">julianne.d@example.com</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<span className="text-sm text-zinc-600">Premium Home Cleaning</span>
</td>
<td className="px-6 py-4">
<span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight bg-emerald-100 text-emerald-800">New</span>
</td>
<td className="px-6 py-4">
<button className="p-2 text-zinc-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined text-lg">more_horiz</span>
</button>
</td>
</tr>
<tr className="hover:bg-zinc-50/80 transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-xs text-zinc-600">MR</div>
<div>
<p className="text-sm font-bold text-on-surface">Marcus Rhodes</p>
<p className="text-[10px] text-zinc-400">m.rhodes@firm.co</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<span className="text-sm text-zinc-600">Commercial Maintenance</span>
</td>
<td className="px-6 py-4">
<span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight bg-blue-100 text-blue-800">Contacted</span>
</td>
<td className="px-6 py-4">
<button className="p-2 text-zinc-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined text-lg">more_horiz</span>
</button>
</td>
</tr>
<tr className="hover:bg-zinc-50/80 transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-xs text-zinc-600">SM</div>
<div>
<p className="text-sm font-bold text-on-surface">Sarah Miller</p>
<p className="text-[10px] text-zinc-400">sarah.m@web.com</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<span className="text-sm text-zinc-600">Deep Sanitization</span>
</td>
<td className="px-6 py-4">
<span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight bg-zinc-100 text-zinc-800">Converted</span>
</td>
<td className="px-6 py-4">
<button className="p-2 text-zinc-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined text-lg">more_horiz</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
{/*  Quick Actions & Campaign  */}
<div className="space-y-6">
{/*  Quick Actions  */}
<div className="bg-emerald-900 text-white p-8 rounded-xl relative overflow-hidden group">
<div className="relative z-10">
<h3 className="font-headline font-bold text-xl mb-6">Quick Actions</h3>
<div className="space-y-3">
<button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-between px-6 transition-all active:scale-95 group/btn">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-emerald-300">web</span>
<span className="text-sm font-bold">Create New Landing Page</span>
</div>
<span className="material-symbols-outlined text-emerald-300 opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all">arrow_forward</span>
</button>
<button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-between px-6 transition-all active:scale-95 group/btn">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-emerald-300">add_circle</span>
<span className="text-sm font-bold">New Blog Post</span>
</div>
<span className="material-symbols-outlined text-emerald-300 opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all">arrow_forward</span>
</button>
</div>
</div>
{/*  Abstract Deco  */}
<div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary opacity-20 rounded-full blur-3xl"></div>
<div className="absolute -top-10 -left-10 w-32 h-32 bg-secondary opacity-10 rounded-full blur-2xl"></div>
</div>
{/*  Visual Campaign Card  */}
<div className="bg-surface-container-high rounded-xl overflow-hidden">
<div className="h-40 bg-zinc-200 relative">
<img alt="Office Space" className="w-full h-full object-cover" data-alt="architectural shot of a pristine, high-end corporate office lobby with large windows and minimalist furniture, natural morning light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8tqLkcGDBuhDpT1zloBl28-d5MaCInboG16LphGVdJ878xpzEBljQ1TCGvQNHsOhMZQKA6rsv6f9XWSjxd9vxnLwfzU78Kd0V7CwBrzY4V2vo0tzvNeO4TdUWSwoJBDlY7kM7qC5pl3BtEhmvju91rxEoeaK6RVby73QVusKHEkaxiOJks8Zl5iEz8i6NK9lwO4sEksOJbxPcFmozz0Q-ySkKvbnqxMndV1fzXqnEVUM--T5mrkaMXH-OXo0A5PNlbg7KCL9Zesk"/>
<div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent"></div>
<div className="absolute bottom-4 left-4">
<span className="bg-emerald-500 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Campaign Active</span>
</div>
</div>
<div className="p-6">
<h4 className="font-headline font-bold text-on-surface">B2B Summer Refresh</h4>
<p className="text-xs text-zinc-500 mt-2 leading-relaxed">Targeting corporate offices in the Stuttgart area with our new precision cleaning protocols.</p>
<div className="mt-6 pt-6 border-t border-zinc-200 flex items-center justify-between">
<div className="flex -space-x-2">
<div className="w-6 h-6 rounded-full border-2 border-white bg-zinc-200"></div>
<div className="w-6 h-6 rounded-full border-2 border-white bg-zinc-300"></div>
<div className="w-6 h-6 rounded-full border-2 border-white bg-zinc-400"></div>
</div>
<span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">12 Team members active</span>
</div>
</div>
</div>
</div>
</div>
</main>
</div>

    </>
  );
}