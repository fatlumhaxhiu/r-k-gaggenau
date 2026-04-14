"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Kredenciale të pasakta.")
      } else {
        router.push("/admin/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("Ndodhi një gabim i papritur.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      
{/*  Main Content Canvas  */}
<main className="grow flex items-center justify-center relative overflow-hidden px-6 py-12">
{/*  Background Imagery (Asymmetric Layout)  */}
<div className="absolute inset-0 z-0 flex pointer-events-none">
<div className="hidden lg:block w-1/2 h-full opacity-10">
<img alt="Minimalist corporate lobby" className="w-full h-full object-cover" data-alt="Ultra-clean minimalist corporate lobby with white marble floors, floor-to-ceiling windows, and architectural lighting in a bright morning atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwvsabc9wd4BHJoJLZq52qtWPo2yCQTIst1-VBMqj9ttH88r1HD_SWqejnBP7HwGpadIYF0534QFOBM9PaM2Y5y-iopxZnqz-pjtkf1PKT7VMXzPJ9kWfx2KZVoguikH3IpYWDot0bBuAXkD1CnaD_3zVr3kw7awTHuI7pFrrhG93goss9Do9ZXpBMZ31b02aRjUiIXm0rpv8hgaNfePSFWoARHevmRHb6naklhsp5_uF0UNDUBQiX4FDAVXVqnDBECXrfx5IXBxI"/>
</div>
<div className="w-full lg:w-1/2 h-full bg-surface"></div>
</div>
{/*  Login Container  */}
<div className="relative z-10 w-full max-w-[1100px] grid lg:grid-cols-2 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(25,28,29,0.06)]">
{/*  Branding/Image Side  */}
<div className="hidden lg:flex relative flex-col justify-end p-12 overflow-hidden">
<div className="absolute inset-0">
<img alt="Glass boardroom" className="w-full h-full object-cover" data-alt="A pristine modern glass-walled conference room with reflecting surfaces and sophisticated architectural geometry, bright and airy lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJBPif2HIu9ZxrUAOPDb6K7JsSjavLWge8EOUPcC4oyGO3elZ8qJfE8e6nCXd_YMbnPUCA1qmBTv4vuNFNz7YGoTJic70ppoCAt__Z_qTvp8RKDuukgnECVZHvxzNHLxVng-IUElJwdnaRWW81SWzDSZVy_VQQ25lZeVN9nn2Qp1JNzBbB3CKEV18ectju6OPI8elvXnAhjCFi9u0lGm1G6fhdRwGGmD7Wgbw3TnUbELeSRrMahjfoB5rGOTuuwSEvCQunWxQ0IWk"/>
<div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent"></div>
</div>
<div className="relative z-20 text-on-primary">
<span className="font-label text-xs tracking-widest uppercase opacity-80 mb-2 block">Atmospheric Precision</span>
<h1 className="font-headline text-4xl font-extrabold tracking-tight mb-4 leading-tight">Elevating Facility Management.</h1>
<p className="text-body-lg opacity-90 max-w-sm">Access the administrative core of R&amp;K-Gaggenau's precision systems.</p>
</div>
</div>
{/*  Form Side  */}
<div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-surface-container-lowest">
{/*  Brand Anchor  */}
<div className="mb-8">
<div className="text-emerald-800 dark:text-emerald-400 text-2xl font-headline font-bold tracking-tight mb-2">R&amp;K-Gaggenau Admin</div>
<p className="text-on-surface-variant font-medium">Management Portal Login</p>
</div>

{error && (
  <div className="mb-6 bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm font-medium">
    {error}
  </div>
)}

<form className="space-y-6" onSubmit={handleSubmit}>
{/*  Email Field  */}
<div className="space-y-1.5">
<label className="font-label text-xs font-semibold tracking-wider text-on-surface-variant uppercase" htmlFor="email">Email Address</label>
<div className="relative group">
<input className="w-full px-4 py-4 bg-surface-container-high rounded-lg border-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline" id="email" name="email" placeholder="admin@rk-gaggenau.com" required type="email" disabled={loading} />
</div>
</div>
{/*  Password Field  */}
<div className="space-y-1.5">
<div className="flex justify-between items-center">
<label className="font-label text-xs font-semibold tracking-wider text-on-surface-variant uppercase" htmlFor="password">Password</label>
<a className="text-xs font-semibold text-secondary hover:underline transition-all" href="#">Forgot Password?</a>
</div>
<div className="relative group">
<input className="w-full px-4 py-4 bg-surface-container-high rounded-lg border-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline" id="password" name="password" placeholder="••••••••" required type="password" disabled={loading} />
</div>
</div>
{/*  Action Button  */}
<div className="pt-4">
<button className="editorial-gradient w-full py-4 rounded-lg text-on-primary font-semibold text-lg shadow-lg hover:shadow-primary/20 active:scale-95 transition-all duration-150 disabled:opacity-70" type="submit" disabled={loading}>
                            {loading ? "Duke hyrë..." : "Sign In"}
                        </button>
</div>
{/*  Security Indicator  */}
<div className="flex items-center justify-center space-x-2 pt-6 text-outline">
<span className="material-symbols-outlined text-sm" data-icon="lock" >lock</span>
<span className="font-label text-[10px] uppercase tracking-[0.08em] font-medium">AES-256 Secure Connection Active</span>
</div>
</form>
{/*  Help Link  */}
<div className="mt-12 text-center">
<p className="text-sm text-on-surface-variant">
                        Need technical assistance? 
                        <a className="text-primary font-semibold hover:underline" href="#">Contact Support</a>
</p>
</div>
</div>
</div>
</main>
{/*  Shared Footer  */}
<footer className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-8">
<div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-4">
<div className="text-sm font-semibold text-zinc-400">
                © 2024 R&amp;K-Gaggenau Facility Management. Atmospheric Precision Systems.
            </div>
<div className="flex flex-wrap justify-center gap-6">
<a className="text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-white transition-all text-sm" href="#">Security Policy</a>
<a className="text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-white transition-all text-sm" href="#">Terms of Service</a>
<a className="text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-white transition-all text-sm" href="#">Privacy</a>
<a className="text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-white transition-all text-sm" href="#">Contact Support</a>
</div>
</div>
</footer>

    </>
  );
}