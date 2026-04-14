import Link from "next/link";
import Image from "next/image";
import LandingMobileNav from "@/components/layout/LandingMobileNav";
export default function GewerbereinigungPage() {
  return (
    <>
      
{/*  TopNavBar  */}
<nav className="bg-emerald-50/80 dark:bg-stone-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 tonal-shift">
<div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
<Link href="/" className="flex items-center gap-3">
<Image src="/RK-Logo-02.png" alt="R&K-Gaggenau Logo" width={200} height={50} className="h-10 w-auto object-contain" priority />
<span className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">R&amp;K-GAGGENAU</span>
</Link>
<div className="hidden md:flex items-center space-x-8">
<Link className="text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-700 dark:border-emerald-400 pb-1 font-manrope tracking-tight text-sm transition-colors duration-300" href="/landing/gewerbereinigung" >Gewerblich</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-medium hover:text-emerald-600 transition-colors font-manrope tracking-tight text-sm duration-300" href="/landing/privatreinigung" >Privat</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-medium hover:text-emerald-600 transition-colors font-manrope tracking-tight text-sm duration-300" href="/landing/grundreinigung" >Grundreinigung</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-medium hover:text-emerald-600 transition-colors font-manrope tracking-tight text-sm duration-300" href="/landing/baureinigung" >Baugrundreinigung</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-medium hover:text-emerald-600 transition-colors font-manrope tracking-tight text-sm duration-300" href="/landing/spezialreinigung" >Institutionell</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-medium hover:text-emerald-600 transition-colors font-manrope tracking-tight text-sm duration-300" href="/landing/saisonale-pflege" >Saisonal</Link>
</div>
<Link href="#contact" className="hidden md:inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-lg text-white bg-emerald-700 hover:bg-emerald-800 transition-colors duration-300">Jetzt buchen</Link>
<LandingMobileNav activePath="/landing/gewerbereinigung" />
</div>
</nav>
<main>
{/*  Hero Section  */}
<section className="relative min-h-[870px] flex items-center overflow-hidden bg-surface">
<div className="absolute inset-0 z-0">
<img className="w-full h-full object-cover opacity-20 grayscale scale-105" data-alt="ultra-modern glass office interior with immaculate surfaces and bright natural morning light reflecting off polished floors" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg0oriSjJ3b-d7s96eZ9Ql6C1ZJxaUfXakDOBwH1zDkcuCVFXVZUc6bVoUEnSwkDWXRJFbWIZ528mVjm4MM8Lq8EgWjciX85uCDAIg11myxLpGwSXgwVvN3AY-oez6X187bW6C2Df3-EYR4UyHpJ9iD69OoBUyhNRAonyXnEb5v84juKbp7yqQnv6BFzl1S7W0IzCyRQyAIdf0bJ0Y3NDI0jM6gopG5xF_XBZ8uN4pdnYn-ALvnWcFr_yQL3TPj8WnzTll7I0Rc4A"  />
</div>
<div className="container mx-auto px-8 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
<div className="lg:col-span-7">
<span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold tracking-widest uppercase font-label" >
                        Präzise Lösungen für Gewerbe
                    </span>
<h1 className="text-5xl lg:text-7xl font-extrabold font-headline text-on-surface leading-[1.1] tracking-tight mb-8" >
                        Professionelle Gewerbereinigung, <span className="text-primary" >der Sie vertrauen können</span>
</h1>
<p className="text-xl text-on-surface-variant max-w-2xl mb-10 leading-relaxed" >
                        Erleben Sie den Goldstandard architektonischer Hygiene. Wir bringen akribische deutsche Präzision in Ihren Arbeitsbereich und sorgen für ein makelloses Umfeld, das die Produktivität steigert.
                    </p>
<div className="flex flex-col sm:flex-row gap-4">
<Link className="bg-primary text-white px-8 py-4 rounded-lg font-headline font-bold text-lg tracking-tight shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:bg-emerald-800 transition-all block text-center" href="#contact">
                            Termin vereinbaren
                        </Link>
<Link className="bg-surface-container-low text-primary px-8 py-4 rounded-lg font-bold text-center border border-primary hover:bg-surface-container-high transition-all text-lg block" href="/leistungen" >
                            Leistungen entdecken
                        </Link>
</div>
</div>
<div className="lg:col-span-5 hidden lg:block">
<div className="relative">
<div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-fixed/30 rounded-full blur-3xl"></div>
<img className="rounded-2xl shadow-2xl relative z-10 border-12 border-surface-container-lowest" data-alt="a professional cleaning expert in premium uniform standing in a brightly lit modern corporate lobby" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9GGMr3Hxn03yWIkD5coPVPags4uRtAgCKCu3JUPFhOVzRxkQglHcMeVL5yFMWkQgYyXveldCeqe5yUAzCYxhvjefw-NCOgglsDijEXlmg6qT-WgTBc2TxegwMO0UNaCChlHTMI6PrVgVB-li-JPX1txWsdf3C-UNzVyf_sTh3qne-Ykm5VUA-RteTVWtJHTBeLeCUpVEyRC8z09oQB12jfKuO4ypBcIbepkAwmZx9BIHaduWfBoHkI2lcDEqwTE_A66fqH9nUVOA"  />
</div>
</div>
</div>
</section>
{/*  What's Included (Editorial Grid)  */}
<section className="py-24 bg-surface-container-low">
<div className="container mx-auto px-8">
<div className="max-w-4xl mb-16">
<h2 className="text-4xl lg:text-5xl font-black font-headline text-on-surface mb-4" >Was enthalten ist</h2>
<p className="text-on-surface-variant text-lg" >Umfassende Desinfektion der Arbeitsbereiche, abgestimmt auf Ihre baulichen Anforderungen.</p>
</div>
<div className="grid md:grid-cols-3 gap-8">
{/*  Office Cleaning  */}
<div className="group bg-surface-container-lowest p-1 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
<div className="relative h-64 overflow-hidden rounded-t-xl">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="organized modern coworking space with clean desks and large windows highlighting dust-free surfaces" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2B_xFWx2-uCJKXooBNgmUHgbqJfVw_3y5UGRbEN7aSnnoKD3NF1uMZJyba1uGh0a6KJfgRj4RUV2wET6tUZ8iL1WguO8fBQe0Lt8nqurak-OYtTRnwZWoDW7lISWXCWdx6j1jF-WHS_ch6v7k_USSU5BIveQWcmshp7lVmKzXhnNB5dJvH0fDiH_RxaDVRX8G0dLcr-18YnTisrW1AyZi55_keT4XDpp_9UBKD9hDB28uGOQxQnmV8FxVe9LJkVJzxS6p1wjP3Kg"  />
<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-6 left-6">
<h3 className="text-2xl font-bold text-white font-headline" >Büroreinigung</h3>
</div>
</div>
<div className="p-8">
<p className="text-on-surface-variant mb-6 leading-relaxed" >Systematische Reinigung von Arbeitsplätzen, Gemeinschaftsbereichen und Privatbüros mit Desinfektionsmitteln in Krankenhausqualität.</p>
<ul className="space-y-3">
<li className="flex items-center gap-3 text-sm text-on-surface font-medium" >
<span className="material-symbols-outlined text-primary text-lg" >check_circle</span> Oberflächendesinfektion
                                </li>
<li className="flex items-center gap-3 text-sm text-on-surface font-medium" >
<span className="material-symbols-outlined text-primary text-lg" >check_circle</span> Pflege der IT-Ausstattung
                                </li>
</ul>
</div>
</div>
{/*  Building Maintenance  */}
<div className="group bg-surface-container-lowest p-1 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden md:mt-12">
<div className="relative h-64 overflow-hidden rounded-t-xl">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="exterior of a high-rise glass building during sunset with clean reflective windows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJwFOmraKWNj6-xvwUEiq4f_Onu0LKyoRamb-uGbkAKsX56BcIAieAxRqxqd9VpQHRGg11xSsZIEE3ki22Ny55MMScj66aRl4mVrYVpnrdY9WzdFevN_X0iNDS55A0j5QCDNC3tTiUP7_GX9QQawFJrbZNhjmQ9RrgqX5dK2tukd1MgqK_uNmLZsMQI1CCcAy5v-Lw_OBeEzOpUrcz4DqzFUcV9nxEMvvj0TvemPuc2yINP7Q9WYP7GpIuJ208nW0HH8O_6sJonPo"  />
<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-6 left-6">
<h3 className="text-2xl font-bold text-white font-headline" >Gebäudeunterhalt</h3>
</div>
</div>
<div className="p-8">
<p className="text-on-surface-variant mb-6 leading-relaxed" >Umfassendes Facility Management inklusive Fassadenpflege, Lobby-Instandhaltung und Abfallmanagement.</p>
<ul className="space-y-3">
<li className="flex items-center gap-3 text-sm text-on-surface font-medium" >
<span className="material-symbols-outlined text-primary text-lg" >check_circle</span> Lobby-Management
                                </li>
<li className="flex items-center gap-3 text-sm text-on-surface font-medium" >
<span className="material-symbols-outlined text-primary text-lg" >check_circle</span> Fenster- &amp; Glaspflege
                                </li>
</ul>
</div>
</div>
{/*  Staircase Cleaning  */}
<div className="group bg-surface-container-lowest p-1 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
<div className="relative h-64 overflow-hidden rounded-t-xl">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="wide shot of a clean modern architectural staircase with wooden steps and glass railings" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBum2oN4VoV4txFPs_QByMzYGVVgsEag4sOwvkOcIFueoKTc0hiWZ24iVkLXtHlNThUlTZlOs-1uHRuUFkNYVI0gmQlW5Q5fvgYPcZjmaz7yMJEPHRms3c8x0xC09G2Y7UB1zJG-euWosVQYXgWP0MLStRTSevpg_ivpVG7DNIpGxXMcbPzTKQwW2R5yHIzTVbAREtw_AntAzmvNlU-xLguhRVMECekN3yJnVtQauzeI4-jF__Iv9U8Cxp06x37huPUiZ6MVorkJ-k"  />
<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-6 left-6">
<h3 className="text-2xl font-bold text-white font-headline" >Treppenhausreinigung</h3>
</div>
</div>
<div className="p-8">
<p className="text-on-surface-variant mb-6 leading-relaxed" >Spezialisierte Tiefenreinigung für hochfrequentierte Durchgangsbereiche, die Sicherheit und Ästhetik auf jeder Stufe garantiert.</p>
<ul className="space-y-3">
<li className="flex items-center gap-3 text-sm text-on-surface font-medium" >
<span className="material-symbols-outlined text-primary text-lg" >check_circle</span> Textil-Tiefenpflege
                                </li>
<li className="flex items-center gap-3 text-sm text-on-surface font-medium" >
<span className="material-symbols-outlined text-primary text-lg" >check_circle</span> Antirutsch-Behandlung
                                </li>
</ul>
</div>
</div>
</div>
</div>
</section>
{/*  Why Choose Us (Bento Grid)  */}
<section className="py-24 bg-surface">
<div className="container mx-auto px-8">
<div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
<div className="max-w-2xl">
<h2 className="text-4xl lg:text-5xl font-black font-headline text-on-surface mb-6" >Warum Sie uns wählen sollten</h2>
<p className="text-on-surface-variant text-lg leading-relaxed" >Wir setzen den Branchenmaßstab für gewerbliche Instandhaltung durch vier Säulen der Exzellenz.</p>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
{/*  Card 1  */}
<div className="md:col-span-2 bg-surface-container-high p-10 rounded-3xl flex flex-col justify-between group hover:bg-primary-container transition-colors duration-500">
<div>
<span className="material-symbols-outlined text-4xl text-primary group-hover:text-white mb-6" >timer</span>
<h3 className="text-3xl font-bold font-headline mb-4 group-hover:text-white" >Zuverlässig &amp; Pünktlich</h3>
<p className="text-on-surface-variant group-hover:text-emerald-50/80 leading-relaxed" >Unsere präzise Zeitplanung stellt sicher, dass Ihre Abläufe nie unterbrochen werden. Wir erscheinen genau dann, wenn wir es versprechen.</p>
</div>
</div>
{/*  Card 2  */}
<div className="bg-primary text-on-primary p-10 rounded-3xl flex flex-col justify-between">
<div>
<span className="material-symbols-outlined text-4xl mb-6" data-weight="fill" >verified</span>
<h3 className="text-2xl font-bold font-headline mb-4" >Deutsche Qualitätsstandards</h3>
<p className="text-emerald-50/80 leading-relaxed" >Unerbittliche Präzision in jeder Ecke. Wir befolgen strikte europäische Hygieneprotokolle.</p>
</div>
</div>
{/*  Card 3  */}
<div className="bg-surface-container-low p-10 rounded-3xl flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
<div>
<span className="material-symbols-outlined text-4xl text-secondary mb-6" >workspace_premium</span>
<h3 className="text-2xl font-bold font-headline mb-4" >Geschulte Profis</h3>
<p className="text-on-surface-variant leading-relaxed" >Jeder Techniker ist hintergrundgeprüft und in professioneller Unternehmenshygiene zertifiziert.</p>
</div>
</div>
{/*  Card 4 (Full Width Bottom)  */}
<div className="md:col-span-4 bg-secondary text-on-secondary p-12 rounded-3xl flex flex-col md:flex-row items-center gap-12">
<div className="flex-1">
<span className="material-symbols-outlined text-5xl mb-6" >event_available</span>
<h3 className="text-4xl font-bold font-headline mb-4" >Flexible Zeitplanung</h3>
<p className="text-blue-100 text-lg leading-relaxed" >Über Nacht, am Wochenende oder täglich – wir passen uns Ihren Geschäftsrhythmen an, ohne einen Takt zu verpassen. Ihre Produktivität ist unsere oberste Priorität.</p>
</div>
<div className="hidden lg:block w-px h-32 bg-white/20"></div>
<div className="shrink-0">
<button className="bg-surface-container-lowest text-secondary px-12 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors" >
                                Verfügbarkeit prüfen
                            </button>
</div>
</div>
</div>
</div>
</section>
{/*  Trust Section  */}
<section className="py-24 bg-inverse-surface text-inverse-on-surface overflow-hidden relative">
<div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
<img className="w-full h-full object-cover" data-alt="team of professionals collaborating in a clean modern office environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4ChyfU3ZIi1SfcFhh5H7QzcjzpRgnxq3VR9UnQIB0dJt5E_TXc25uZ3P4JaAB_WPqN7F16q5DtdQtyN-j2gZB470MpDTnCtSSZVVi4M7i2BJ0kVI8vD1QeLCFlYCzmjMxLDVw2UeL9cjCcqEUaN_7ssalRv1H94rfNJHuGlHNKB84PqMX3gIRlztCIGP8OTABgSwqIfbZD7EhTFzN6CrLA12issB5F0OG7ja5kZ1b2KTCh3fdbcOlf4W2ak6QyL9-3Z6KqONLyPM"  />
</div>
<div className="container mx-auto px-8 relative z-10">
<div className="grid lg:grid-cols-2 gap-20 items-center">
<div>
<span className="text-primary-fixed font-bold tracking-widest uppercase text-xs mb-6 block" >Unsere Tradition</span>
<h2 className="text-4xl lg:text-5xl font-black font-headline mb-8 leading-tight" >Jahrzehnte der Präzision, <br />gebaut auf Vertrauen.</h2>
<div className="space-y-6 text-xl text-surface-dim leading-relaxed">
<p className="" >R&amp;K-Gaggenau wurde auf dem Prinzip gegründet, dass Sauberkeit der stille Motor des unternehmerischen Erfolgs ist. Seit über 15 Jahren betreuen wir die anspruchsvollsten architektonischen Räume der Region, von Tech-Hubs bis hin zu medizinischen Einrichtungen.</p>
<p className="" >Unser Engagement geht über die einfache Ästhetik hinaus; wir schaffen Umgebungen, die Ihr wertvollstes Kapital schützen – Ihre Mitarbeiter. Durch kontinuierliche Innovation in nachhaltiger Chemie und mechanischer Präzision bleiben wir die erste Wahl für Unternehmen, die bei der Qualität keine Kompromisse eingehen.</p>
</div>
<div className="mt-12 flex gap-12">
<div>
<div className="text-4xl font-bold text-primary-fixed font-headline" >500+</div>
<div className="text-sm uppercase tracking-widest text-outline-variant mt-1" >Betreute Kunden</div>
</div>
<div>
<div className="text-4xl font-bold text-primary-fixed font-headline" >98%</div>
<div className="text-sm uppercase tracking-widest text-outline-variant mt-1" >Kundenbindung</div>
</div>
</div>
</div>
<div className="bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10">
<div className="flex items-center gap-4 mb-8">
<div className="w-16 h-16 rounded-full overflow-hidden">
<img className="w-full h-full object-cover" data-alt="portrait of a confident business executive in a high-end office" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDa_D1lUw5EXfZLAkiKlTBvdkYd--pemhTKLZZRRM63d9rl4BVv0ylcGDaJ4bt5kZvfDn-zFYzBIJyVUJYUnBdEBr5HrWVf_QHWwxl3W2em2uM-UisQmINityLa_KfKNrT2inGOZTVHu32__qN022coc5W0KavKYS48hH8HNu4v7ZCj7HQQf4MgFI7MxmibSunOZKejiNUfGrRqZxVW79qMSWN5-wd7Jp4UjBjyWbeBZENQS29IhqHxR5yy6GHJajbBNMOIRg7Vp4"  />
</div>
<div>
<h4 className="font-bold text-lg" >Marcus Thornton</h4>
<p className="text-sm text-outline-variant" >COO, Global Tech Hub</p>
</div>
</div>
<p className="italic text-2xl font-light leading-relaxed" >"Der Wechsel zu R&amp;K-Gaggenau verlief nahtlos. Sie reinigen nicht nur; sie pflegen die physische Präsenz unserer Marke. Ihre Liebe zum Detail in den Vorstandsetagen ist unerreicht."</p>
</div>
</div>
</div>
</section>
{/*  Contact Form Section  */}
<section className="py-24 bg-surface scroll-mt-24" id="contact">
<div className="container mx-auto px-8">
<div className="max-w-6xl mx-auto bg-surface-container-low rounded-[2rem] overflow-hidden grid lg:grid-cols-5 shadow-2xl">
<div className="lg:col-span-2 bg-primary-container p-12 text-on-primary-container flex flex-col justify-between">
<div>
<h2 className="text-4xl font-black font-headline mb-6" >Werten wir Ihren Arbeitsplatz auf.</h2>
<p className="text-emerald-100/80 mb-8 leading-relaxed" >Füllen Sie das Formular aus für eine maßgeschneiderte Objektbewertung und ein Angebot innerhalb von 24 Stunden.</p>
<div className="space-y-6">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined p-2 bg-white/10 rounded-lg" >call</span>
<span className="" >+1 (555) 012-3456</span>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined p-2 bg-white/10 rounded-lg" >mail</span>
<span className="" >commercial@rk-gaggenau.com</span>
</div>
</div>
</div>
<div className="mt-12 pt-12 border-t border-white/10">
<p className="text-sm font-medium" >Hauptsitz: Gaggenau Precision Plaza, Suite 400</p>
</div>
</div>
<div className="lg:col-span-3 p-12 bg-surface-container-lowest">
<form className="space-y-6">
<div className="grid sm:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="text-sm font-bold font-label text-on-surface-variant uppercase tracking-wider" >Vorname</label>
<input className="w-full px-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" placeholder="Jane" type="text" />
</div>
<div className="space-y-2">
<label className="text-sm font-bold font-label text-on-surface-variant uppercase tracking-wider" >Nachname</label>
<input className="w-full px-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" placeholder="Smith" type="text" />
</div>
</div>
<div className="space-y-2">
<label className="text-sm font-bold font-label text-on-surface-variant uppercase tracking-wider" >E-Mail-Adresse</label>
<input className="w-full px-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" placeholder="jane@company.com" type="email" />
</div>
<div className="space-y-2">
<label className="text-sm font-bold font-label text-on-surface-variant uppercase tracking-wider" >Telefonnummer</label>
<input className="w-full px-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" placeholder="+1 (555) 000-0000" type="tel" />
</div>
<div className="pt-4">
<button className="w-full bg-primary text-white py-5 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform" type="submit" >
                                    Termin vereinbaren
                                </button>
</div>
<p className="text-center text-xs text-on-surface-variant mt-4" >Mit dem Klick auf "Termin vereinbaren" stimmen Sie unseren Nutzungsbedingungen zu.</p>
</form>
</div>
</div>
</div>
</section>
{/*  Final CTA  */}
<section className="py-24 text-center">
<div className="container mx-auto px-8 max-w-3xl">
<h2 className="text-4xl lg:text-6xl font-black font-headline text-on-surface mb-8" >Bereit für eine saubere Perspektive?</h2>
<button className="bg-primary text-white px-12 py-6 rounded-2xl text-xl font-extrabold shadow-2xl shadow-primary/20 hover:scale-110 transition-all" >
                    Holen Sie sich jetzt Ihr kostenloses Angebot
                </button>
</div>
</section>
</main>
{/*  Footer  */}
<footer className="bg-stone-100 dark:bg-stone-950 full-width py-12 tonal-shift from surface to surface-container-low">
<div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto">
<div className="text-lg font-black text-stone-900 dark:text-stone-100 font-headline mb-6 md:mb-0" >R&amp;K-Gaggenau</div>
<div className="flex gap-8 mb-6 md:mb-0">
<a className="font-inter text-xs tracking-wide uppercase text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline-offset-4 hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#" >Datenschutz</a>
<a className="font-inter text-xs tracking-wide uppercase text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline-offset-4 hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#" >Impressum</a>
<a className="font-inter text-xs tracking-wide uppercase text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline-offset-4 hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#" >Servicebereiche</a>
<a className="font-inter text-xs tracking-wide uppercase text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline-offset-4 hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#" >Karriere</a>
</div>
<div className="font-inter text-xs tracking-wide uppercase text-stone-500" >
                © 2024 R&amp;K-Gaggenau Präzisionsreinigung. Alle Rechte vorbehalten.
            </div>
</div>
</footer>

    </>
  );
}
