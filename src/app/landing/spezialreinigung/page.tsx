import Link from "next/link";
import Image from "next/image";
import LandingMobileNav from "@/components/layout/LandingMobileNav";
import LeadForm from "@/components/LeadForm";
export default function SpezialreinigungPage() {
  return (
    <>
      
{/*  TopNavBar  */}
<nav className="bg-emerald-50/80 dark:bg-stone-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 tonal-shift flat no shadows">
<div className="flex justify-between items-center w-full px-4 sm:px-8 py-4 max-w-7xl mx-auto">
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
<header className="relative min-h-svh flex items-center overflow-hidden">
<div className="absolute inset-0 z-0">
<img className="w-full h-full object-cover grayscale-20 opacity-90" data-alt="Moderne High-End-Zahnklinik mit makellosen weißen Oberflächen, präziser chirurgischer Beleuchtung und architektonischen Glastrennwänden in einer sanften Tageslichtatmosphäre" src="/assets/images/7018d7311cf164ad0f89.png"  />
<div className="absolute inset-0 bg-linear-to-r from-surface via-surface/60 to-transparent"></div>
</div>
<div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
<div className="max-w-2xl">
<span className="inline-block text-primary font-bold tracking-[0.2em] text-xs uppercase mb-4 font-label" >Institutioneller Standard</span>
<h1 className="font-headline text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface leading-[1.05] mb-8" >
                    Präzisionshygiene für <span className="text-primary" >sensible Bereiche</span>
</h1>
<p className="text-lg text-on-surface-variant mb-10 leading-relaxed max-w-lg" >
                    Spezialisierte Reinigung auf wissenschaftlichem Niveau. Wir bieten klinische Desinfektion für das Gesundheitswesen, Bildungseinrichtungen und anspruchsvolle Architektur.
                </p>
<div className="flex flex-col sm:flex-row gap-4">
<Link className="bg-primary text-white px-8 py-4 rounded-lg font-headline font-bold text-lg tracking-tight shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:bg-emerald-800 transition-all block text-center" href="#contact">
                        Termin vereinbaren
                    </Link>
<Link className="bg-surface-container-low text-primary px-8 py-4 rounded-xl font-bold text-center border border-primary hover:bg-surface-container-high transition-all text-lg inline-block" href="/leistungen" >
                        Leistungen entdecken</Link>
</div>
</div>
</div>
</header>
{/*  Why Choose Us: Bento Grid  */}
<section className="py-24 bg-surface">
<div className="max-w-7xl mx-auto px-8">
<div className="flex flex-col md:grid md:grid-cols-4 gap-6 w-full min-w-0">
<div className="md:col-span-2 bg-surface-container-low p-10 rounded-xl flex flex-col justify-between">
<div>
<span className="material-symbols-outlined text-primary text-4xl mb-6" >workspace_premium</span>
<h3 className="font-headline text-xl md:text-3xl font-bold mb-4 tracking-tight" >Compliance-Standards</h3>
<p className="text-sm md:text-base text-on-surface-variant leading-relaxed" >Vollständige Einhaltung internationaler Gesundheitsprotokolle und ISO-Zertifizierungen für institutionelle Sicherheit.</p>
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
<img className="absolute inset-0 w-full h-full object-cover" data-alt="Professioneller Reinigungstechniker in einem minimalistischen medizinischen Büro mit modernster Sanierungsausrüstung, klaren architektonischen Linien und weichem natürlichem Licht" src="/assets/images/b8307fd32cbe2c3c7110.png"  />
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
<h2 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tighter mb-6" >Spezialisierte Lösungen</h2>
<p className="text-on-surface-variant text-lg" >Detaillierte Pflege für Umgebungen, die nichts weniger als Perfektion verlangen.</p>
</div>
<div className="hidden md:block h-px flex-1 bg-outline-variant/30 mx-12 mb-4"></div>
<div className="text-primary font-bold text-8xl opacity-10 font-headline select-none" >LEISTUNGEN</div>
</div>
<div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 w-full min-w-0">
{/*  Service 1  */}
<div className="group relative aspect-4/5 overflow-hidden rounded-xl bg-surface-container-lowest transition-transform hover:-translate-y-2 duration-500">
<img className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" data-alt="Steriler moderner Arztpraxis-Untersuchungsraum mit hochwertigen klinischen Möbeln und makellosen Oberflächen in kühler chirurgischer Beleuchtung" src="/assets/images/e56a7597335231d536c5.png"  />
<div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent"></div>
<div className="absolute bottom-0 p-8 w-full">
<span className="text-secondary font-bold text-4xl opacity-20 mb-2 block font-headline" >01</span>
<h3 className="font-headline text-xl font-bold text-on-surface mb-2" >Arztpraxisreinigung</h3>
<p className="text-on-surface-variant text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300" >Strikte Einhaltung von Biogefährdungsprotokollen und Sanierungsstandards für Operationssäle.</p>
</div>
</div>
{/*  Service 2  */}
<div className="group relative aspect-4/5 overflow-hidden rounded-xl bg-surface-container-lowest transition-transform hover:-translate-y-2 duration-500 md:mt-12">
<img className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" data-alt="Heller moderner High-School-Korridor mit minimalistischen Schließfächern und polierten architektonischen Betonböden in heller Nachmittagssonne" src="/assets/images/3062f574399e329ab711.png"  />
<div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent"></div>
<div className="absolute bottom-0 p-8 w-full">
<span className="text-secondary font-bold text-4xl opacity-20 mb-2 block font-headline" >02</span>
<h3 className="font-headline text-xl font-bold text-on-surface mb-2" >Schulreinigung</h3>
<p className="text-on-surface-variant text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300" >Großflächige Instandhaltung mit Fokus auf stark frequentierte Lernbereiche und Luftqualität.</p>
</div>
</div>
{/*  Service 3  */}
<div className="group relative aspect-4/5 overflow-hidden rounded-xl bg-surface-container-lowest transition-transform hover:-translate-y-2 duration-500">
<img className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" data-alt="Lebendiges, gehobenes Kindergarten-Spielzimmer mit Designer-Holzspielzeug und umweltfreundlichen Oberflächen in warmem, sonnigem Morgenlicht" src="/assets/images/6d6da8454564f75a5e2e.png"  />
<div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent"></div>
<div className="absolute bottom-0 p-8 w-full">
<span className="text-secondary font-bold text-4xl opacity-20 mb-2 block font-headline" >03</span>
<h3 className="font-headline text-xl font-bold text-on-surface mb-2" >Kindergartenreinigung</h3>
<p className="text-on-surface-variant text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300" >Hypoallergene, kindersichere Desinfektionsprozesse für primäre Lernräume.</p>
</div>
</div>
{/*  Service 4  */}
<div className="group relative aspect-4/5 overflow-hidden rounded-xl bg-surface-container-lowest transition-transform hover:-translate-y-2 duration-500 md:mt-12">
<img className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" data-alt="Nahaufnahme einer modernen Wolkenkratzer-Glasfassade, die einen blauen Himmel mit funkelnder Kristallklarheit widerspiegelt" src="/assets/images/fc42731b59c47ffbc240.png"  />
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
<h2 className="font-headline text-3xl font-extrabold tracking-tight mb-8" >Jahrzehntelange kompromisslose Expertise</h2>
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
<div className="grid grid-cols-2 gap-2 sm:gap-4">
<div className="p-4 sm:p-8 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center min-w-0">
<div className="text-3xl sm:text-4xl font-black text-primary mb-2" >500+</div>
<div className="text-[10px] sm:text-xs uppercase tracking-widest font-label opacity-60 wrap-break-word max-w-full break-all sm:break-normal" >Medizinische Einrichtungen</div>
</div>
<div className="p-4 sm:p-8 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center min-w-0">
<div className="text-3xl sm:text-4xl font-black text-primary mb-2" >15k</div>
<div className="text-[10px] sm:text-xs uppercase tracking-widest font-label opacity-60 wrap-break-word max-w-full break-all sm:break-normal" >Zertifizierte Stunden</div>
</div>
<div className="p-4 sm:p-8 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center min-w-0">
<div className="text-3xl sm:text-4xl font-black text-primary mb-2" >99.9%</div>
<div className="text-[10px] sm:text-xs uppercase tracking-widest font-label opacity-60 wrap-break-word max-w-full break-all sm:break-normal" >Desinfektionsrate</div>
</div>
<div className="p-4 sm:p-8 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center min-w-0">
<div className="text-3xl sm:text-4xl font-black text-primary mb-2" >24/7</div>
<div className="text-[10px] sm:text-xs uppercase tracking-widest font-label opacity-60 wrap-break-word max-w-full break-all sm:break-normal" >Schneller Support</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  Contact Form Section  */}
<section className="py-24 bg-surface scroll-mt-24" id="contact">
<div className="max-w-7xl mx-auto px-8">
<p className="text-center text-sm font-semibold text-on-surface-variant mb-6">Dieses Formular ist für Reinigungsanfragen, nicht für Bewerbungen.</p>
<div className="bg-surface-container-low rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
<div className="lg:w-2/5 p-6 sm:p-12 lg:p-16 bg-primary text-on-primary">
<h2 className="font-headline text-3xl font-extrabold mb-6" >Kostenlose Beratung zur Reinigung</h2>
<p className="text-primary-fixed/80 mb-12" >Beschreiben Sie kurz Ihren Reinigungsbedarf. Beratung und Besichtigung sind kostenlos und unverbindlich. Ihr Preisangebot erhalten Sie nach der ersten Beratung.</p>
<div className="space-y-8">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined" >call</span>
<a href="tel:+4915776790522" className="font-medium hover:text-emerald-200 transition-colors" >+49 1577 6790522</a>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined" >mail</span>
<a href="mailto:info@rk-gaggenau.de" className="font-medium hover:text-emerald-200 transition-colors" >info@rk-gaggenau.de</a>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined" >location_on</span>
<a href="https://maps.google.com/?q=Bäumbachallee+1,+76571+Gaggenau,+Germany" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-emerald-200 transition-colors" >Bäumbachallee 1, 76571 Gaggenau, Germany</a>
</div>
</div>
</div>
<div className="lg:w-3/5 p-6 sm:p-12 lg:p-16 bg-white">
<LeadForm serviceName="Spezialreinigung" />
</div>
</div>
</div>
</section>
{/*  Final CTA  */}
<section className="py-20 bg-primary-container">
<div className="max-w-7xl mx-auto px-8 text-center">
<h2 className="font-headline text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter" >Bereit, Ihre Umgebung neu zu definieren?</h2>
<p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto" >Schließen Sie sich den Elite-Institutionen an, die R&amp;K-Gaggenau für Präzisionshygiene und klinische Sauberkeit vertrauen.</p>
<button className="bg-white w-full sm:w-auto text-primary px-8 sm:px-12 py-5 rounded-full font-bold text-xl hover:bg-emerald-50 transition-colors shadow-2xl" >
                Kostenloses Angebot anfordern
            </button>
</div>
</section>


    </>
  );
}
