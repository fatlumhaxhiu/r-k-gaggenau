import Link from "next/link";
import Image from "next/image";
import LandingMobileNav from "@/components/layout/LandingMobileNav";
import LeadForm from "@/components/LeadForm";
export default function GrundreinigungPage() {
  return (
    <>

<nav className="bg-emerald-50/80 dark:bg-stone-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50">
<div className="flex justify-between items-center w-full px-4 sm:px-8 py-4 max-w-7xl mx-auto">
<Link href="/" className="flex items-center gap-3">
<Image src="/RK-Logo-02.png" alt="R&K-Gaggenau Logo" width={200} height={50} className="h-10 w-auto object-contain" priority />
<span className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">R&amp;K-GAGGENAU</span>
</Link>
<div className="hidden md:flex items-center space-x-8 font-manrope tracking-tight text-sm font-semibold"><Link className="text-zinc-600 dark:text-zinc-400 font-medium hover:text-emerald-600 transition-colors" href="/landing/gewerbereinigung">Gewerblich</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-medium hover:text-emerald-600 transition-colors" href="/landing/privatreinigung">Privat</Link>
<Link className="text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-700 dark:border-emerald-400 pb-1" href="/landing/grundreinigung">Grundreinigung</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-medium hover:text-emerald-600 transition-colors" href="/landing/baureinigung">Baugrundreinigung</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-medium hover:text-emerald-600 transition-colors" href="/landing/spezialreinigung">Institutionell</Link>
<Link className="text-zinc-600 dark:text-zinc-400 font-medium hover:text-emerald-600 transition-colors" href="/landing/saisonale-pflege">Saisonal</Link></div>
<Link href="#appointment" className="hidden md:inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-lg text-white bg-emerald-700 hover:bg-emerald-800 transition-colors duration-300">Jetzt buchen</Link>
<LandingMobileNav activePath="/landing/grundreinigung" />
</div>
</nav>
<header className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48 bg-surface">
<div className="max-w-7xl mx-auto px-8 flex flex-col lg:grid lg:grid-cols-12 gap-12 items-center w-full">
<div className="lg:col-span-7 z-10">
<span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary uppercase bg-primary-fixed rounded-full font-label">
                    Premium-Service-Stufe
                </span>
<h1 className="font-headline text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-on-surface mb-8 leading-[1.1]">
                    Intensive <span className="text-gradient-primary">Grundreinigung</span> für jede Oberfläche
                </h1>
<p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
                    Werten Sie Ihre Räumlichkeiten mit unserer präzisen Reinigung auf höchstem Niveau auf. Wir erreichen Stellen, die herkömmliche Dienste übersehen, und stellen Klarheit sowie hygienische Frische in Ihren wertvollsten Umgebungen wieder her.
                </p>
<div className="flex flex-col sm:flex-row gap-4">
<Link className="bg-primary text-white px-8 py-4 rounded-lg font-headline font-bold text-lg tracking-tight shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:bg-emerald-800 transition-all block text-center" href="#appointment">
                        Termin vereinbaren
                    </Link>
<Link className="bg-surface-container-low text-primary px-8 py-4 rounded-xl font-bold text-center border border-primary hover:bg-surface-container-high transition-all inline-block" href="/leistungen">Leistungen entdecken</Link>
</div>
</div>
<div className="lg:col-span-5 relative">
<div className="aspect-4/5 rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
<img alt="Makellose moderne weiße Küche" className="w-full h-full object-cover" data-alt="Close up of a minimalist luxury kitchen with marble countertops and sunlight reflecting off pristine stainless steel appliances" src="/assets/images/458fcdc7a435ce1ee2b1.png"/>
</div>
<div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary-fixed-dim rounded-2xl -z-10 mix-blend-multiply opacity-50 blur-2xl"></div>
</div>
</div>
</header>
<section className="py-24 bg-surface-container-low" id="included">
<div className="max-w-7xl mx-auto px-8">
<div className="flex flex-col md:flex-row justify-between items-end mb-20">
<div className="max-w-2xl">
<h2 className="font-headline text-3xl lg:text-5xl font-bold tracking-tight text-on-surface mb-6">Was enthalten ist</h2>
<p className="text-on-surface-variant text-lg">Unser Grundreinigungsprotokoll ist eine architektonische Wiederherstellung Ihrer Wohn- oder Arbeitsumgebung.</p>
</div>
<div className="hidden md:block h-px w-32 bg-outline-variant mb-4"></div>
</div>
<div className="flex flex-col md:grid md:grid-cols-3 gap-8 w-full min-w-0">
<div className="bg-surface-container-lowest p-10 rounded-3xl group hover:-translate-y-2 transition-transform duration-300">
<div className="w-14 h-14 bg-primary-fixed rounded-2xl flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-3xl">floor</span>
</div>
<h3 className="font-headline text-2xl font-bold mb-4">Intensive Bodenpflege</h3>
<p className="text-on-surface-variant leading-relaxed">Dampfextraktion, Fugendetailierung und Hochleistungspolitur, die jedem Material seinen ursprünglichen Glanz zurückgibt.</p>
</div>
<div className="bg-surface-container-lowest p-10 rounded-3xl group hover:-translate-y-2 transition-transform duration-300 border-t-4 border-primary">
<div className="w-14 h-14 bg-primary-fixed rounded-2xl flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-3xl">sanitizer</span>
</div>
<h3 className="font-headline text-2xl font-bold mb-4">Detaillierte Desinfektion</h3>
<p className="text-on-surface-variant leading-relaxed">Desinfektion auf medizinischem Niveau für häufig berührte Flächen, Luftkanäle und verborgene Nischen, in denen sich Keime sammeln.</p>
</div>
<div className="bg-surface-container-lowest p-10 rounded-3xl group hover:-translate-y-2 transition-transform duration-300">
<div className="w-14 h-14 bg-primary-fixed rounded-2xl flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-3xl">cleaning_services</span>
</div>
<h3 className="font-headline text-2xl font-bold mb-4">Spezial-Grundreinigung</h3>
<p className="text-on-surface-variant leading-relaxed">Individuelle Behandlung für empfindliche Stoffe, Kristallleuchten und hochwertige architektonische Oberflächen, die fachgerechte Pflege erfordern.</p>
</div>
</div>
</div>
</section>
<section className="py-24 bg-surface relative overflow-hidden">
<div className="max-w-7xl mx-auto px-8 flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center w-full min-w-0">
<div className="relative order-2 lg:order-1">
<div className="grid grid-cols-2 gap-4">
<div className="space-y-4">
<div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
<img alt="Sauberes modernes Badezimmer" className="w-full h-full object-cover" data-alt="Ultra-clean bathroom with white tiles and minimalist fixtures under bright natural morning light" src="/assets/images/cf335f7cd3bd109721dd.png"/>
</div>
<div className="aspect-3/4 rounded-2xl overflow-hidden shadow-lg">
<img alt="Saubere Küchendetails" className="w-full h-full object-cover" data-alt="Macro shot of a sparkling clean kitchen faucet and marble sink with water droplets reflecting the light" src="/assets/images/04844cce1976266ba201.png"/>
</div>
</div>
<div className="space-y-4 pt-8">
<div className="aspect-3/4 rounded-2xl overflow-hidden shadow-lg">
<img alt="Organisierter moderner Wohnraum" className="w-full h-full object-cover" data-alt="Sunlit modern living room with perfectly arranged furniture and immaculate hardwood floors" src="/assets/images/7de674a991424e3428b2.png"/>
</div>
<div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
<img alt="Sauberes architektonisches Detail" className="w-full h-full object-cover" data-alt="Detailed view of white minimalist stairs and pristine glass railing in a luxury home" src="/assets/images/bf291d9ddf19e578c9b4.png"/>
</div>
</div>
</div>
</div>
<div className="order-1 lg:order-2">
<h2 className="font-headline text-3xl lg:text-5xl font-bold tracking-tight text-on-surface mb-12">Warum Sie uns wählen sollten</h2>
<div className="space-y-10">
<div className="flex gap-6">
<div className="shrink-0 w-12 h-12 text-secondary">
<span className="material-symbols-outlined text-4xl" data-weight="fill">verified</span>
</div>
<div>
<h4 className="font-headline text-xl font-bold mb-2">Akribische Detailarbeit</h4>
<p className="text-on-surface-variant">Wir arbeiten mit einer architektonischen Denkweise und stellen sicher, dass selbst Mikro-Oberflächen unseren Standards für atmosphärische Präzision entsprechen.</p>
</div>
</div>
<div className="flex gap-6">
<div className="shrink-0 w-12 h-12 text-secondary">
<span className="material-symbols-outlined text-4xl" data-weight="fill">precision_manufacturing</span>
</div>
<div>
<h4 className="font-headline text-xl font-bold mb-2">Modernste Ausrüstung</h4>
<p className="text-on-surface-variant">Einsatz von HEPA-Filtration und industrieller Dampftechnologie für ein überlegenes, chemikalienfreies Ergebnis.</p>
</div>
</div>
<div className="flex gap-6">
<div className="shrink-0 w-12 h-12 text-secondary">
<span className="material-symbols-outlined text-4xl" data-weight="fill">energy_savings_leaf</span>
</div>
<div>
<h4 className="font-headline text-xl font-bold mb-2">Vollständige Erneuerung</h4>
<p className="text-on-surface-variant">Ein umfassender Reset für Ihre Räumlichkeiten, der die Luftqualität und visuelle Klarheit sofort verbessert.</p>
</div>
</div>
<div className="flex gap-6">
<div className="shrink-0 w-12 h-12 text-secondary">
<span className="material-symbols-outlined text-4xl" data-weight="fill">schedule</span>
</div>
<div>
<h4 className="font-headline text-xl font-bold mb-2">Langanhaltende Ergebnisse</h4>
<p className="text-on-surface-variant">Unsere intensive Methodik stellt sicher, dass Ihre Oberflächen länger makellos bleiben als bei herkömmlichen Reinigungszyklen.</p>
</div>
</div>
</div>
</div>
</div>
</section>
<section className="py-24 bg-primary text-on-primary">
<div className="max-w-4xl mx-auto px-8 text-center">
<span className="material-symbols-outlined text-6xl mb-8" >shield</span>
<h2 className="font-headline text-3xl lg:text-4xl font-bold mb-6">Unser Qualitätsversprechen</h2>
<p className="text-xl opacity-90 leading-relaxed font-light italic">
                &quot;Atmosphärische Präzision ist nicht nur unser Slogan; es ist unser Versprechen. Wenn sich Ihr Raum nicht spürbar verwandelt anfühlt, haben wir unsere Arbeit noch nicht beendet.&quot;
            </p>
<div className="mt-8 flex justify-center items-center gap-4">
<div className="h-px w-12 bg-on-primary/30"></div>
<span className="font-bold tracking-widest text-sm uppercase">R&amp;K-Gaggenau Geschäftsführung</span>
<div className="h-px w-12 bg-on-primary/30"></div>
</div>
</div>
</section>
<section className="py-24 bg-surface-container-low scroll-mt-24" id="appointment">
<div className="max-w-7xl mx-auto px-8">
<p className="text-center text-sm font-semibold text-on-surface-variant mb-6">Dieses Formular ist für Reinigungsanfragen, nicht für Bewerbungen.</p>
<div className="bg-surface-container-lowest rounded-[2rem] shadow-xl overflow-hidden flex flex-col lg:flex-row">
<div className="lg:w-1/2 p-6 sm:p-12 lg:p-20">
<h2 className="font-headline text-3xl font-bold mb-6">Kostenlose Beratung zur Reinigung</h2>
<p className="text-on-surface-variant mb-10 text-lg">Beschreiben Sie kurz Ihren Reinigungsbedarf. Beratung und Besichtigung sind kostenlos und unverbindlich. Ihr Preisangebot erhalten Sie nach der ersten Beratung.</p>
<LeadForm serviceName="Grundreinigung" />
</div>
<div className="lg:w-1/2 bg-surface-container-highest relative min-h-[400px]">
<img alt="Luxuriöses Wohninterieur" className="absolute inset-0 w-full h-full object-cover" data-alt="Wide angle shot of a luxury modern penthouse living room with expansive windows and pristine furniture layout" src="/assets/images/e4827bf999217d14ab60.png"/>
<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end p-12">
<div className="text-white">
<div className="flex gap-1 mb-2">
<span className="material-symbols-outlined text-yellow-400" >star</span>
<span className="material-symbols-outlined text-yellow-400" >star</span>
<span className="material-symbols-outlined text-yellow-400" >star</span>
<span className="material-symbols-outlined text-yellow-400" >star</span>
<span className="material-symbols-outlined text-yellow-400" >star</span>
</div>
<p className="font-headline text-lg sm:text-2xl font-bold">&quot;Der Standard der Reinigung ist unübertroffen. Es fühlt sich wirklich so an, als würde man wieder in ein neues Zuhause einziehen.&quot;</p>
<p className="mt-4 opacity-80">— Privatkunde, München</p>
</div>
</div>
</div>
</div>
</div>
</section>


    </>
  );
}
