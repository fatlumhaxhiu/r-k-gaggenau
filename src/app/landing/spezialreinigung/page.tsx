import Link from "next/link";
import Image from "next/image";
import LandingMobileNav from "@/components/layout/LandingMobileNav";
export default function SpezialreinigungPage() {
  return (
    <>
      
{/*  TopNavBar  */}
<nav className="bg-emerald-50/80 dark:bg-stone-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 tonal-shift flat no shadows">
<div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
<Link href="/" className="flex items-center gap-3">
<Image src="/RK-Logo-02.png" alt="R&K-Gaggenau Logo" width={200} height={50} className="h-10 w-auto object-contain" priority />
<span className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">R&amp;K-GAGGENAU</span>
</Link>
<div className="hidden md:flex items-center space-x-8 font-manrope tracking-tight text-sm font-semibold"><Link className="text-zinc-600 dark:text-zinc-400 font-medium hover:text-emerald-600 transition-colors font-manrope tracking-tight text-sm" href="/landing/gewerbereinigung" >Gewerblich</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-medium hover:text-emerald-600 transition-colors font-manrope tracking-tight text-sm" href="/landing/privatreinigung" >Privat</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-medium hover:text-emerald-600 transition-colors font-manrope tracking-tight text-sm" href="/landing/grundreinigung" >Grundreinigung</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-medium hover:text-emerald-600 transition-colors font-manrope tracking-tight text-sm" href="/landing/baureinigung" >Baugrundreinigung</Link>
<Link className="text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-700 dark:border-emerald-400 pb-1 font-manrope tracking-tight text-sm" href="/landing/spezialreinigung" >Institutionell</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-medium hover:text-emerald-600 transition-colors font-manrope tracking-tight text-sm" href="/landing/saisonale-pflege" >Saisonal</Link></div>
<Link href="#contact" className="hidden md:inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-lg text-white bg-emerald-700 hover:bg-emerald-800 transition-colors duration-300">Jetzt buchen</Link>
<LandingMobileNav activePath="/landing/spezialreinigung" />
</div>
</nav>
{/*  Hero Section  */}
<header className="relative min-h-[921px] flex items-center overflow-hidden">
<div className="absolute inset-0 z-0">
<img className="w-full h-full object-cover grayscale-20 opacity-90" data-alt="Moderne High-End-Zahnklinik mit makellosen weißen Oberflächen, präziser chirurgischer Beleuchtung und architektonischen Glastrennwänden in einer sanften Tageslichtatmosphäre" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4BVmIY4y3QmVwZmeLxww0P4frIvGlhVftF76Xo2L10f4H4Tm2xO6zXtrHh_UOD_UwDY6SpHFCaz--0mCphXLMmMsozLUkeDJEdcxutAl0kSjft8ib0IOIa9GM4i8oYqUM_pMl93Ncp00oQY-1aZeHoXd5c6D7kxYkCQVXXQCDtk40B_86c3awQIg34ROuqnUEJt9fIN1Usi-abl0lW18F15O6czo7ejnL8H2trQv0e05i8EgHk4Z8637IkaPHmLrwHxWKHh0AGpQ"  />
<div className="absolute inset-0 bg-linear-to-r from-surface via-surface/60 to-transparent"></div>
</div>
<div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
<div className="max-w-2xl">
<span className="inline-block text-primary font-bold tracking-[0.2em] text-xs uppercase mb-4 font-label" >Institutioneller Standard</span>
<h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface leading-[1.05] mb-8" >
                    Präzisionshygiene für <span className="text-primary" >sensible Bereiche</span>
</h1>
<p className="text-lg text-on-surface-variant mb-10 leading-relaxed max-w-lg" >
                    Spezialisierte Reinigung auf wissenschaftlichem Niveau. Wir bieten klinische Desinfektion für das Gesundheitswesen, Bildungseinrichtungen und anspruchsvolle Architektur.
                </p>
<div className="flex flex-col sm:flex-row gap-4">
<button className="bg-primary text-white px-10 py-4 rounded-lg font-bold text-base shadow-xl hover:bg-emerald-800 transition-all" >
                        Termin vereinbaren
                    </button>
<button className="bg-surface-container-highest/50 backdrop-blur-md text-on-surface px-10 py-4 rounded-lg font-bold text-base hover:bg-surface-container-highest transition-all" >
                        Leistungen entdecken</button>
</div>
</div>
</div>
</header>
{/*  Why Choose Us: Bento Grid  */}
<section className="py-24 bg-surface">
<div className="max-w-7xl mx-auto px-8">
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
<div className="md:col-span-2 bg-surface-container-low p-10 rounded-xl flex flex-col justify-between">
<div>
<span className="material-symbols-outlined text-primary text-4xl mb-6" >workspace_premium</span>
<h3 className="font-headline text-3xl font-bold mb-4 tracking-tight" >Compliance-Standards</h3>
<p className="text-on-surface-variant leading-relaxed" >Vollständige Einhaltung internationaler Gesundheitsprotokolle und ISO-Zertifizierungen für institutionelle Sicherheit.</p>
</div>
</div>
<div className="bg-primary text-on-primary p-10 rounded-xl">
<span className="material-symbols-outlined text-primary-fixed text-4xl mb-6" >medical_services</span>
<h3 className="font-headline text-xl font-bold mb-2" >Klinik-Niveau</h3>
<p className="text-primary-fixed/80 text-sm leading-relaxed" >Verwendung EPA-zugelassener Desinfektionsmittel für klinische Umgebungen.</p>
</div>
<div className="bg-surface-container-highest p-10 rounded-xl">
<span className="material-symbols-outlined text-primary text-4xl mb-6" >verified_user</span>
<h3 className="font-headline text-xl font-bold mb-2" >Geprüfte Zuverlässigkeit</h3>
<p className="text-on-surface-variant text-sm leading-relaxed" >Jedes Teammitglied durchläuft eine strenge Hintergrundprüfung und Verifizierung.</p>
</div>
<div className="bg-secondary-container p-10 rounded-xl md:col-span-1">
<span className="material-symbols-outlined text-on-secondary-container text-4xl mb-6" >school</span>
<h3 className="font-headline text-xl font-bold mb-2" >Spezialschulungen</h3>
<p className="text-on-secondary-container/80 text-sm leading-relaxed" >Kontinuierliche Fortbildung im Management von Hochrisikoflächen.</p>
</div>
<div className="md:col-span-3 relative rounded-xl overflow-hidden min-h-[300px]">
<img className="absolute inset-0 w-full h-full object-cover" data-alt="Professioneller Reinigungstechniker in einem minimalistischen medizinischen Büro mit modernster Sanierungsausrüstung, klaren architektonischen Linien und weichem natürlichem Licht" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrWogrDKLnEj-ozPSsh0pvOLLUTIy_wsrzOm8mPvAbPE4ZBur2TD64h6PC0bQo-P16eAhIGEQRqSygPJd2oHbSHxxYeVp2OaJWEoEoN28mFLZqbTHRSn_PWB3Ayo9MSNwouPRrYlZ7tFv4KFEugdN4Kj6uAK6QQ3AWFCA66Il_0XWhw3clqN3bmtYk87AXZ7AYpPMYcWkCO6t0m8omR9IIr0rvMvRWu9vxSUMU-541y_DEV1nektwLQzr6SqvJbSs103vtdbj6wlk"  />
<div className="absolute inset-0 bg-linear-to-t from-on-surface/80 via-transparent to-transparent"></div>
<div className="absolute bottom-0 left-0 p-10">
<h4 className="text-white font-headline text-2xl font-bold" >Der Goldstandard in der Präzision</h4>
</div>
</div>
</div>
</div>
</section>
{/*  What's Included: Editorial Asymmetry  */}
<section className="py-24 bg-surface-container-low overflow-hidden">
<div className="max-w-7xl mx-auto px-8">
<div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
<div className="max-w-xl">
<h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter mb-6" >Spezialisierte Lösungen</h2>
<p className="text-on-surface-variant text-lg" >Detaillierte Pflege für Umgebungen, die nichts weniger als Perfektion verlangen.</p>
</div>
<div className="hidden md:block h-px flex-1 bg-outline-variant/30 mx-12 mb-4"></div>
<div className="text-primary font-bold text-8xl opacity-10 font-headline select-none" >LEISTUNGEN</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
{/*  Service 1  */}
<div className="group relative aspect-4/5 overflow-hidden rounded-xl bg-surface-container-lowest transition-transform hover:-translate-y-2 duration-500">
<img className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" data-alt="Steriler moderner Arztpraxis-Untersuchungsraum mit hochwertigen klinischen Möbeln und makellosen Oberflächen in kühler chirurgischer Beleuchtung" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6UwcMQuVjBpBuO2g92O81wAUjkIzgvMclcGSRLt9auSX7j-Pb7uwgWQhOFzzbMWdSZAiud6j7jiaULUAArtP4X9xiMoMSmdcpdgu02POagqdfE-3hpvxwsCyz8LdReclpjKgIuJPjk6Wh7OlXr1RodKCu_irj19UtiXxyxBcVbF1ayaR93Si5z5WjORGN5p6PoY-HJKIakUM0nHyV1_zee3DL_SDRLtilXUCckAWNdHYRkexLR2HnL-XW244NLal0upmvhHzxfZA"  />
<div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent"></div>
<div className="absolute bottom-0 p-8 w-full">
<span className="text-secondary font-bold text-4xl opacity-20 mb-2 block font-headline" >01</span>
<h3 className="font-headline text-xl font-bold text-on-surface mb-2" >Arztpraxisreinigung</h3>
<p className="text-on-surface-variant text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300" >Strikte Einhaltung von Biogefährdungsprotokollen und Sanierungsstandards für Operationssäle.</p>
</div>
</div>
{/*  Service 2  */}
<div className="group relative aspect-4/5 overflow-hidden rounded-xl bg-surface-container-lowest transition-transform hover:-translate-y-2 duration-500 md:mt-12">
<img className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" data-alt="Heller moderner High-School-Korridor mit minimalistischen Schließfächern und polierten architektonischen Betonböden in heller Nachmittagssonne" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrbr5-uUtST7WmsAmPpkrfjlznEyZri_A5JORUR0UNE7fUc6mNNowBIVSLhJ7GeUHC5Ybv4dwtgms3UgxboPICJjEL3AijVIrrsFzrZ9uoqMZPo0P8oNtqPa_KAIgh41AkK1N72o7FM646TAIkTrXCnEkFBQPbxPpK-118YcgnH8Vg1G_FhatNw5EBm24gDT7LRzSZSuOk3kF-yEyZC_6Gd2e1oRdkvzqhj4bFWT30lhR4KrXHSyg5kCXtddv1reuA1A44H2gOg6g"  />
<div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent"></div>
<div className="absolute bottom-0 p-8 w-full">
<span className="text-secondary font-bold text-4xl opacity-20 mb-2 block font-headline" >02</span>
<h3 className="font-headline text-xl font-bold text-on-surface mb-2" >Schulreinigung</h3>
<p className="text-on-surface-variant text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300" >Großflächige Instandhaltung mit Fokus auf stark frequentierte Lernbereiche und Luftqualität.</p>
</div>
</div>
{/*  Service 3  */}
<div className="group relative aspect-4/5 overflow-hidden rounded-xl bg-surface-container-lowest transition-transform hover:-translate-y-2 duration-500">
<img className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" data-alt="Lebendiges, gehobenes Kindergarten-Spielzimmer mit Designer-Holzspielzeug und umweltfreundlichen Oberflächen in warmem, sonnigem Morgenlicht" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqEh7GfHE9Ajz7UcxC1XE8IbPWZLPs6Kzcdq3y47yh3I_n1BtfGs3X8cYZ1V7hv2i1QjiUtxfKTlL0GlhKTttZtLFXslPZW0JC3c6W54X63G4D0AcFS-YECVuCVb0RlewiGufOTsRTblaEoS8BiatLxAxeM_cdl6K4ktRoRvbqAPt_qG1JkNB7MLEFanlFk4FFrBjVlLsXk3R2-CXUj4ZWA78qZpty3tx9hIeOrApfajQbKqkdG7dE5i0b-suGqDy4FmHVvwtTpwU"  />
<div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent"></div>
<div className="absolute bottom-0 p-8 w-full">
<span className="text-secondary font-bold text-4xl opacity-20 mb-2 block font-headline" >03</span>
<h3 className="font-headline text-xl font-bold text-on-surface mb-2" >Kindergartenreinigung</h3>
<p className="text-on-surface-variant text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300" >Hypoallergene, kindersichere Desinfektionsprozesse für primäre Lernräume.</p>
</div>
</div>
{/*  Service 4  */}
<div className="group relative aspect-4/5 overflow-hidden rounded-xl bg-surface-container-lowest transition-transform hover:-translate-y-2 duration-500 md:mt-12">
<img className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" data-alt="Nahaufnahme einer modernen Wolkenkratzer-Glasfassade, die einen blauen Himmel mit funkelnder Kristallklarheit widerspiegelt" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbyDPekcWr72T3naGkyjUn8Ql2UZHStcoCsQPGgDTYfEVRuDHHwGilaCN0LB0NR34W0BDUwgC-hd-Ca-yuHCEhWqXK0jvO4E-3AEvA9PD-EIAXeUkNV39wTU-JB5vLvPxJxiRZWZvry84e6GS1t0ZaNgYjJFxONMDUlvQ5OsOgiscvXgRCu3FIP9-NumvX_UJo4jGUkuJzRa9vT15WJBTBFQm8MR1QwImCCWbIcWYpZEode0LDsDLAA2o3NcMkZNQIGcEOQWIlEZ4"  />
<div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent"></div>
<div className="absolute bottom-0 p-8 w-full">
<span className="text-secondary font-bold text-4xl opacity-20 mb-2 block font-headline" >04</span>
<h3 className="font-headline text-xl font-bold text-on-surface mb-2" >Glas- &amp; Fassadenreinigung</h3>
<p className="text-on-surface-variant text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300" >Architektonische Klarheit durch spezialisierte Zugangssysteme und streifenfreie Behandlungen.</p>
</div>
</div>
</div>
</div>
</section>
{/*  Trust Section  */}
<section className="py-24 bg-inverse-surface text-inverse-on-surface">
<div className="max-w-7xl mx-auto px-8">
<div className="flex flex-col md:flex-row items-center gap-16">
<div className="w-full md:w-1/2">
<div className="relative">
<div className="absolute -top-4 -left-4 w-24 h-24 bg-primary rounded-full blur-3xl opacity-20"></div>
<h2 className="font-headline text-4xl font-extrabold tracking-tight mb-8" >Jahrzehntelange kompromisslose Expertise</h2>
<div className="space-y-6">
<div className="flex gap-4">
<div className="w-12 h-12 shrink-0 bg-primary-container rounded-lg flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary-container" >psychology</span>
</div>
<div>
<h4 className="font-bold text-lg" >Institutionelles Wissen</h4>
<p className="text-inverse-on-surface/70 text-sm" >Wir reinigen nicht nur; wir verstehen die architektonischen und betrieblichen Anforderungen Ihrer spezifischen Einrichtung.</p>
</div>
</div>
<div className="flex gap-4">
<div className="w-12 h-12 shrink-0 bg-secondary rounded-lg flex items-center justify-center">
<span className="material-symbols-outlined text-on-secondary" >verified</span>
</div>
<div>
<h4 className="font-bold text-lg" >Verifizierte Ergebnisse</h4>
<p className="text-inverse-on-surface/70 text-sm" >ATP-Tests und visuelle Audits nach jedem Tiefenreinigungszyklus sorgen für totale Transparenz.</p>
</div>
</div>
</div>
</div>
</div>
<div className="w-full md:w-1/2">
<div className="grid grid-cols-2 gap-4">
<div className="p-8 bg-white/5 rounded-xl border border-white/10 text-center">
<div className="text-4xl font-black text-primary mb-2" >500+</div>
<div className="text-xs uppercase tracking-widest font-label opacity-60" >Medizinische Einrichtungen</div>
</div>
<div className="p-8 bg-white/5 rounded-xl border border-white/10 text-center">
<div className="text-4xl font-black text-primary mb-2" >15k</div>
<div className="text-xs uppercase tracking-widest font-label opacity-60" >Zertifizierte Stunden</div>
</div>
<div className="p-8 bg-white/5 rounded-xl border border-white/10 text-center">
<div className="text-4xl font-black text-primary mb-2" >99.9%</div>
<div className="text-xs uppercase tracking-widest font-label opacity-60" >Desinfektionsrate</div>
</div>
<div className="p-8 bg-white/5 rounded-xl border border-white/10 text-center">
<div className="text-4xl font-black text-primary mb-2" >24/7</div>
<div className="text-xs uppercase tracking-widest font-label opacity-60" >Schneller Support</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  Contact Form Section  */}
<section className="py-24 bg-surface" id="contact">
<div className="max-w-7xl mx-auto px-8">
<div className="bg-surface-container-low rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
<div className="lg:w-2/5 p-12 lg:p-16 bg-primary text-on-primary">
<h2 className="font-headline text-4xl font-extrabold mb-6" >Technisches Audit anfordern</h2>
<p className="text-primary-fixed/80 mb-12" >Lassen Sie unsere Spezialisten den Hygienebedarf Ihrer Einrichtung bewerten. Wir erstellen einen individuellen Sanierungsplan für Ihre Anforderungen.</p>
<div className="space-y-8">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined" >call</span>
<span className="font-medium" >+49 (0) 7225 1234 56</span>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined" >mail</span>
<span className="font-medium" >kontakt@rk-gaggenau.de</span>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined" >location_on</span>
<span className="font-medium" >Gaggenau, Baden-Württemberg</span>
</div>
</div>
</div>
<div className="lg:w-3/5 p-12 lg:p-16 bg-white">
<form className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="space-y-2">
<label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label" >Vorname</label>
<input className="w-full px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface" placeholder="Max" type="text" />
</div>
<div className="space-y-2">
<label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label" >Nachname</label>
<input className="w-full px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface" placeholder="Mustermann" type="text" />
</div>
<div className="space-y-2 md:col-span-2">
<label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label" >E-Mail-Adresse</label>
<input className="w-full px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface" placeholder="max@institution.de" type="email" />
</div>
<div className="space-y-2 md:col-span-2">
<label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label" >Telefonnummer</label>
<input className="w-full px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface" placeholder="+49 000 000000" type="tel" />
</div>
<div className="md:col-span-2 pt-4">
<button className="w-full bg-primary text-white py-5 rounded-lg font-bold text-lg shadow-lg hover:bg-emerald-800 transition-all flex items-center justify-center gap-2" >
<span className="" >Termin vereinbaren</span>
<span className="material-symbols-outlined" >arrow_forward</span>
</button>
</div>
</form>
</div>
</div>
</div>
</section>
{/*  Final CTA  */}
<section className="py-20 bg-primary-container">
<div className="max-w-7xl mx-auto px-8 text-center">
<h2 className="font-headline text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter" >Bereit, Ihre Umgebung neu zu definieren?</h2>
<p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto" >Schließen Sie sich den Elite-Institutionen an, die R&amp;K-Gaggenau für Präzisionshygiene und klinische Sauberkeit vertrauen.</p>
<button className="bg-white text-primary px-12 py-5 rounded-full font-bold text-xl hover:bg-emerald-50 transition-colors shadow-2xl" >
                Kostenloses Angebot anfordern
            </button>
</div>
</section>
{/*  Footer  */}
<footer className="bg-stone-100 dark:bg-stone-950 full-width py-12 tonal-shift from surface to surface-container-low flat no shadows">
<div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto">
<div className="flex items-center mb-2">
<Image src="/RK-Logo-02.png" alt="R&K-Gaggenau Logo" width={200} height={50} className="h-10 w-auto object-contain"  />
</div>
<div className="flex flex-wrap justify-center gap-8 mb-8 md:mb-0 font-inter text-xs tracking-wide uppercase"><a className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="#" >Gewerbe</a>
<Link className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="/landing/privatreinigung" >Privat</Link>
<Link className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="/landing/grundreinigung" >Grundreinigung</Link>
<a className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="#" >Baureinigung</a>
<a className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="#" >Spezialreinigung</a>
<Link className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="/landing/saisonale-pflege" >Saisonal</Link>
<a className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="#" >Datenschutz</a>
<a className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="#" >Impressum</a></div>
<div className="font-inter text-[10px] text-stone-400 uppercase tracking-[0.2em]" >© 2024 R&amp;K-Gaggenau. Atmosphärische Präzision in der Reinigung.</div>
</div>
</footer>

    </>
  );
}