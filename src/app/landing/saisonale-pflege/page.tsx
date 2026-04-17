import Link from "next/link";
import Image from "next/image";
import LandingMobileNav from "@/components/layout/LandingMobileNav";
import LeadForm from "@/components/LeadForm";
export default function SaisonalePflegePage() {
  return (
    <>
      
{/*  TopNavBar  */}
<nav className="bg-emerald-50/80 dark:bg-stone-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 tonal-shift">
<div className="flex justify-between items-center w-full px-4 sm:px-8 py-4 max-w-7xl mx-auto">
<Link href="/" className="flex items-center gap-3">
<Image src="/RK-Logo-02.png" alt="R&K-Gaggenau Logo" width={200} height={50} className="h-10 w-auto object-contain" priority />
<span className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">R&amp;K-GAGGENAU</span>
</Link>
<div className="hidden md:flex items-center space-x-8">
<Link className="text-zinc-600 dark:text-zinc-400 font-manrope tracking-tight text-sm font-medium hover:text-emerald-600 transition-colors duration-300" href="/landing/gewerbereinigung" >Gewerblich</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-manrope tracking-tight text-sm font-medium hover:text-emerald-600 transition-colors duration-300" href="/landing/privatreinigung" >Privat</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-manrope tracking-tight text-sm font-medium hover:text-emerald-600 transition-colors duration-300" href="/landing/grundreinigung" >Grundreinigung</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-manrope tracking-tight text-sm font-medium hover:text-emerald-600 transition-colors duration-300" href="/landing/baureinigung" >Baugrundreinigung</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-manrope tracking-tight text-sm font-medium hover:text-emerald-600 transition-colors duration-300" href="/landing/spezialreinigung" >Institutionell</Link>
<Link className="text-emerald-700 dark:text-emerald-400 font-manrope tracking-tight text-sm font-bold border-b-2 border-emerald-700 dark:border-emerald-400 pb-1" href="/landing/saisonale-pflege" >Saisonal</Link>
</div>
<Link href="#contact" className="hidden md:inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-lg text-white bg-emerald-700 hover:bg-emerald-800 transition-colors duration-300">Jetzt buchen</Link>
<LandingMobileNav activePath="/landing/saisonale-pflege" />
</div>
</nav>
<main>
{/*  Hero Section  */}
<section className="relative min-h-svh flex items-center overflow-hidden bg-surface">
<div className="max-w-7xl mx-auto px-4 sm:px-8 w-full flex flex-col lg:grid lg:grid-cols-12 gap-12 items-center">
<div className="lg:col-span-7 z-10">
<span className="font-label text-secondary uppercase tracking-widest text-xs font-bold mb-6 block wrap-break-word" >Erstklassige Wartung im Winter</span>
<h1 className="font-headline text-3xl sm:text-5xl md:text-7xl font-extrabold text-on-surface tracking-tighter leading-[1.05] mb-8 wrap-break-word max-w-full" >
    Zuverlässige <span className="text-primary italic" >Saisonpflege </span> &amp; Winterdienst
</h1>
<p className="text-on-surface-variant text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-body" >
                        Von der präzisen Schneeräumung bis zur fachgerechten saisonalen Außenpflege. Sorgen Sie dafür, dass Ihr Anwesen unabhängig von der Wettervorhersage sicher und gepflegt bleibt.
                    </p>
<div className="flex flex-col sm:flex-row gap-4">
<Link className="bg-primary text-white px-4 sm:px-8 py-4 rounded-lg font-headline font-bold text-lg tracking-tight shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:bg-emerald-800 transition-all block text-center" href="#contact">
                            Termin vereinbaren
                        </Link>
<Link className="bg-surface-container-low text-primary px-4 sm:px-8 py-4 rounded-xl font-bold text-center border border-primary hover:bg-surface-container-high transition-all inline-block text-lg" href="/leistungen" >
                            Leistungen entdecken</Link>
</div>
</div>
<div className="lg:col-span-5 relative h-full min-h-[500px]">
<div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-3 transform scale-105"></div>
<img className="w-full h-full object-cover rounded-3xl editorial-shadow relative z-10" data-alt="Modernes minimalistisches Hausäußeres im Winter mit geräumter Einfahrt und klarem Morgenlicht" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCatpfZ7Xzhq8iDIj4_TD0t5ruwBAsdBsRqwS43XUi8eWuTWGPTGGTh4AZosLB9tj6cp5cejt9ioT_K0bLXu2dC7DtP_B7sGNok-oJC_ZMB6SmwCN1r8San04AfHNsrvSD_oedpi89DirLPuzPAHjzHyALgeE5YT9bwLjwbbdqvM993PP-pblvBf0-GwAIrm1ZXEqWQ_xe06dGrMGheZl_YfRGzDYKt9Pva7xAmvCljIgH8_Nx6Ith53EAQ89yv5s-O7sQ02LCJjUE"  />
</div>
</div>
</section>
{/*  What's Included: Asymmetric Bento-style Grid  */}
<section className="py-24 bg-surface-container-low">
<div className="max-w-7xl mx-auto px-4 sm:px-8">
<div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
<div>
<h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-on-surface" >Was enthalten ist</h2>
<p className="text-on-surface-variant mt-4 font-body" >Präzise Pflege für die einzigartigen Herausforderungen jeder Jahreszeit.</p>
</div>
<div className="h-px grow bg-outline-variant/30 mx-12 hidden lg:block"></div>
<span className="font-label text-secondary font-black text-6xl opacity-10" >01—03</span>
</div>
<div className="flex flex-col md:grid md:grid-cols-3 gap-8 w-full min-w-0">
{/*  Service 1  */}
<div className="group bg-surface-container-lowest p-8 rounded-2xl editorial-shadow transition-transform hover:-translate-y-2">
<div className="w-14 h-14 bg-secondary-fixed-dim/20 rounded-xl flex items-center justify-center text-secondary mb-8">
<span className="material-symbols-outlined text-3xl" >ac_unit</span>
</div>
<h3 className="font-headline text-2xl font-bold mb-4" >Winterdienst</h3>
<p className="text-on-surface-variant leading-relaxed mb-6 font-body" >Komplettes Facility Management im Winter, das dafür sorgt, dass Wege und Eingänge frei sind, bevor Ihr Tag beginnt.</p>
<ul className="space-y-3 text-sm font-semibold text-on-surface-variant">
<li className="flex items-center gap-2" ><span className="material-symbols-outlined text-primary text-lg" >check_circle</span> Vorsorgliches Streuen</li>
<li className="flex items-center gap-2" ><span className="material-symbols-outlined text-primary text-lg" >check_circle</span> Wegräumung</li>
<li className="flex items-center gap-2" ><span className="material-symbols-outlined text-primary text-lg" >check_circle</span> Streugutmanagement</li>
</ul>
</div>
{/*  Service 2  */}
<div className="group bg-surface-container-lowest p-8 rounded-2xl editorial-shadow transition-transform hover:-translate-y-2">
<div className="w-14 h-14 bg-primary-fixed/20 rounded-xl flex items-center justify-center text-primary mb-8">
<span className="material-symbols-outlined text-3xl" >snowing</span>
</div>
<h3 className="font-headline text-2xl font-bold mb-4" >Schnee- &amp; Eisbeseitigung</h3>
<p className="text-on-surface-variant leading-relaxed mb-6 font-body" >Schneller Einsatz bei starkem Schneefall. Wir priorisieren Sicherheit und Zugänglichkeit für Privat- und Gewerbekunden.</p>
<ul className="space-y-3 text-sm font-semibold text-on-surface-variant">
<li className="flex items-center gap-2" ><span className="material-symbols-outlined text-primary text-lg" >check_circle</span> Notfall-Räumung</li>
<li className="flex items-center gap-2" ><span className="material-symbols-outlined text-primary text-lg" >check_circle</span> Gehweg-Salzung</li>
<li className="flex items-center gap-2" ><span className="material-symbols-outlined text-primary text-lg" >check_circle</span> Dachschnee-Sicherung</li>
</ul>
</div>
{/*  Service 3  */}
<div className="group bg-surface-container-lowest p-8 rounded-2xl editorial-shadow transition-transform hover:-translate-y-2">
<div className="w-14 h-14 bg-tertiary-fixed/20 rounded-xl flex items-center justify-center text-tertiary mb-8">
<span className="material-symbols-outlined text-3xl" >eco</span>
</div>
<h3 className="font-headline text-2xl font-bold mb-4" >Außen- &amp; Gartenpflege</h3>
<p className="text-on-surface-variant leading-relaxed mb-6 font-body" >Wir begleiten Ihre Außenanlagen durch die Jahreszeiten mit sorgfältiger Reinigung und Vorbereitung.</p>
<ul className="space-y-3 text-sm font-semibold text-on-surface-variant">
<li className="flex items-center gap-2" ><span className="material-symbols-outlined text-primary text-lg" >check_circle</span> Laubentfernung</li>
<li className="flex items-center gap-2" ><span className="material-symbols-outlined text-primary text-lg" >check_circle</span> Dachrinnenreinigung</li>
<li className="flex items-center gap-2" ><span className="material-symbols-outlined text-primary text-lg" >check_circle</span> Garten-Winterfestmachung</li>
</ul>
</div>
</div>
</div>
</section>
{/*  Why Choose Us: Icon Focused  */}
<section className="py-24 bg-surface overflow-hidden">
<div className="max-w-7xl mx-auto px-4 sm:px-8">
<div className="flex flex-col lg:grid lg:grid-cols-2 gap-20 items-center w-full min-w-0">
<div className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
<div className="space-y-6">
<div className="bg-surface-container-high p-8 rounded-2xl">
<span className="material-symbols-outlined text-secondary text-4xl mb-4" >schedule</span>
<h4 className="font-headline font-bold text-xl mb-2" >24/7 Verfügbarkeit</h4>
<p className="text-on-surface-variant text-sm font-body" >Wir beobachten das Wetter, damit Sie es nicht tun müssen. Einsatz bei Tag und Nacht.</p>
</div>
<div className="bg-surface-container-high p-8 rounded-2xl">
<span className="material-symbols-outlined text-primary text-4xl mb-4" >health_and_safety</span>
<h4 className="font-headline font-bold text-xl mb-2" >Sicherheit zuerst</h4>
<p className="text-on-surface-variant text-sm font-body" >Haftungsreduzierung durch professionelle Enteisungsprotokolle.</p>
</div>
</div>
<div className="space-y-6 pt-0 sm:pt-12">
<div className="bg-primary-container p-8 rounded-2xl text-on-primary-container">
<span className="material-symbols-outlined text-4xl mb-4" >bolt</span>
<h4 className="font-headline font-bold text-xl mb-2" >Schnelle Reaktion</h4>
<p className="text-on-primary-container/80 text-sm font-body" >Garantierte Ankunftszeiten innerhalb unserer Servicevereinbarungen.</p>
</div>
<div className="bg-surface-container-high p-8 rounded-2xl">
<span className="material-symbols-outlined text-secondary text-4xl mb-4" >cloudy_snowing</span>
<h4 className="font-headline font-bold text-xl mb-2" >Wetterbereit</h4>
<p className="text-on-surface-variant text-sm font-body" >Spezialisierte Flotte, vorbereitet auf extreme regionale Bedingungen.</p>
</div>
</div>
</div>
<div className="order-1 lg:order-2">
<h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-on-surface mb-6" >Bereit für die <span className="text-primary" >Elemente.</span></h2>
<p className="text-on-surface-variant text-lg mb-8 leading-relaxed font-body" >Unser Team reagiert nicht nur, wir agieren vorausschauend. Mit fortschrittlicher meteorologischer Überwachung und industrietauglichem Equipment bietet R&amp;K-Gaggenau einen Schutzschirm für Ihr Eigentum.</p>
{/*  Trust Record Section  */}
<div className="bg-surface-container-low p-8 rounded-2xl border-l-4 border-primary">
<h5 className="font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-6" >Unsere Erfolgsbilanz</h5>
<div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-6 sm:gap-6">
<div>
<span className="block text-4xl font-extrabold text-primary font-headline" >99.8%</span>
<span className="text-[10px] sm:text-xs font-semibold text-on-surface-variant uppercase" >Service-Verfügbarkeit</span>
</div>
<div className="hidden sm:block w-px h-12 bg-outline-variant"></div>
<div>
<span className="block text-4xl font-extrabold text-primary font-headline" >15m</span>
<span className="text-[10px] sm:text-xs font-semibold text-on-surface-variant uppercase" >Ø Reaktionszeit</span>
</div>
<div className="hidden sm:block w-px h-12 bg-outline-variant"></div>
<div>
<span className="block text-4xl font-extrabold text-primary font-headline" >1.2k+</span>
<span className="text-[10px] sm:text-xs font-semibold text-on-surface-variant uppercase" >Gepflegte Objekte</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  Contact Form Section  */}
<section className="py-24 bg-surface-container-low relative scroll-mt-24" id="contact">
<div className="max-w-4xl mx-auto px-4 sm:px-8 relative z-10">
<div className="bg-surface-container-lowest rounded-3xl editorial-shadow overflow-hidden flex flex-col md:flex-row">
<div className="md:w-2/5 primary-gradient p-6 sm:p-12 text-on-primary flex flex-col justify-between">
<div>
<h2 className="font-headline text-3xl font-bold leading-tight mb-4" >Angebot für Saisonpflege anfordern</h2>
<p className="text-on-primary/80 font-body" >Sichern Sie sich Ihren Platz in unserem Winterplan. Die Plätze für garantierten Priority-Service sind begrenzt.</p>
</div>
<div className="space-y-6 mt-12 md:mt-0">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined" >call</span>
<a href="tel:+4915776790522" className="font-semibold text-sm hover:text-emerald-200 transition-colors" >+49 1577 6790522</a>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined" >mail</span>
<a href="mailto:info@rk-gaggenau.de" className="font-semibold text-sm hover:text-emerald-200 transition-colors" >info@rk-gaggenau.de</a>
</div>
</div>
</div>
<div className="md:w-3/5 p-6 sm:p-12">
<LeadForm serviceName="Saisonale Pflege" />
</div>
</div>
</div>
</section>
{/*  Final CTA  */}
<section className="py-24 text-center">
<div className="max-w-7xl mx-auto px-4 sm:px-8">
<h2 className="font-headline text-3xl md:text-6xl font-extrabold text-on-surface tracking-tighter mb-8 max-w-4xl mx-auto" >
                    Lassen Sie das Wetter nicht über Ihren <span className="text-secondary italic" >Betriebsablauf</span> entscheiden.
</h2>
<div className="flex justify-center">
<button className="bg-primary w-full sm:w-auto text-white px-4 sm:px-12 py-5 rounded-lg font-bold text-xl editorial-shadow hover:bg-emerald-800 hover:scale-105 transition-all" >
                        Jetzt loslegen
                    </button>
</div>
</div>
</section>
</main>


    </>
  );
}
