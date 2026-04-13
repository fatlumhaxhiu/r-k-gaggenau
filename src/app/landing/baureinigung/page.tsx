import Link from "next/link";
import Image from "next/image";
import LandingMobileNav from "@/components/layout/LandingMobileNav";
export default function BaureinigungPage() {
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
<Link className="font-manrope tracking-tight text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 transition-colors" href="/landing/gewerbereinigung" >Gewerblich</Link>
<Link className="font-manrope tracking-tight text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 transition-colors" href="/landing/privatreinigung" >Privat</Link>
<Link className="font-manrope tracking-tight text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 transition-colors" href="/landing/grundreinigung" >Grundreinigung</Link>
<Link className="font-manrope tracking-tight text-sm font-bold text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-700 dark:border-emerald-400 pb-1" href="/landing/baureinigung" >Baugrundreinigung</Link>
<Link className="font-manrope tracking-tight text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 transition-colors" href="/landing/spezialreinigung" >Institutionell</Link>
<Link className="font-manrope tracking-tight text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 transition-colors" href="/landing/saisonale-pflege" >Saisonal</Link>
</div>
<Link href="#contact" className="hidden md:inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-lg text-white bg-emerald-700 hover:bg-emerald-800 transition-colors duration-300">
            Jetzt buchen
        </Link>
<LandingMobileNav activePath="/landing/baureinigung" />
</div>
</nav>
<main>
{/*  Hero Section  */}
<section className="relative min-h-[921px] flex items-center overflow-hidden bg-surface-container-low">
<div className="max-w-7xl mx-auto px-8 w-full asymmetric-grid relative z-10">
<div className="col-span-12 md:col-span-7 flex flex-col justify-center py-20">
<span className="font-label text-secondary font-bold tracking-[0.2em] mb-4 uppercase text-sm" >Industrielle Präzision</span>
<h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface leading-none mb-8" >
                    Experten für <span className="text-primary" >Baureinigung &amp; Übergabe</span>
</h1>
<p className="text-on-surface-variant text-lg md:text-xl max-w-xl mb-10 leading-relaxed" >
                    Nahtloser Übergang von der Baustelle zur schlüsselfertigen Übergabe. Unsere spezialisierten Teams entfernen feinsten Staub, Schutt und Rückstände, die Standardreiniger übersehen.
                </p>
<div className="flex flex-col sm:flex-row gap-4">
<a className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-center transition-all hover:bg-emerald-800 hover:shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-2" href="#contact" >
                        Termin vereinbaren
                        <span className="material-symbols-outlined text-lg" >arrow_forward</span>
</a>
<a className="border border-outline-variant text-primary px-8 py-4 rounded-xl font-bold text-center transition-all hover:bg-surface-container-lowest" href="#included" >
                        Leistungen entdecken
                    </a>
</div>
</div>
<div className="hidden md:block col-span-5 relative h-full min-h-[600px]">
<div className="absolute inset-0 bg-primary/5 rounded-[2rem] -rotate-3 translate-x-4 translate-y-4"></div>
<img alt="Pristine modern architectural space" className="absolute inset-0 w-full h-full object-cover rounded-[2rem] shadow-2xl z-10 grayscale hover:grayscale-0 transition-all duration-700" data-alt="Modern architectural interior with clean lines and large windows, reflecting sunlight on a perfectly polished concrete floor in a minimalist building." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFWug9_ZaFrLm9zUDJogRVW6sYx4y4GXbZ3P-K-8dbKj6wsOtsOSsoSojD2QpUUht_3Z6NrwGubgLPl9ZHNcJwEQ1TM_Mlco9WxjqAVjuZpQorSyB8Q_o1PoEc-bnhS482Te5C7Kpq3yHixqxdT7OqkxDgocdTJcNNz8LqVli4rTTFSAD4BMYz4XhUlmpSBl4z7eBAJhwIazhYGJdjDHPJqKropI-DLbTczEwAEl8OaybOYkcKyw-_i5GalzLwAdVNggr5eyvsTrc"  />
</div>
</div>
{/*  Decorative Element  */}
<div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
</section>
{/*  What's Included (Bento Style)  */}
<section className="py-32 bg-surface" id="included">
<div className="max-w-7xl mx-auto px-8">
<div className="mb-20 text-left md:indent-20">
<span className="font-label text-primary font-semibold tracking-widest uppercase" >Der Prozess</span>
<h2 className="font-headline text-4xl md:text-5xl font-bold mt-2" >Was enthalten ist</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto">
{/*  Major Card  */}
<div className="md:col-span-8 group bg-surface-container-low rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden transition-all hover:bg-surface-container-lowest border border-transparent hover:border-outline-variant/30">
<div className="relative z-10">
<span className="text-6xl font-headline font-black text-primary/10 absolute -top-4 -left-2" >01</span>
<h3 className="text-3xl font-headline font-bold mb-4 mt-8" >Baufeinreinigung</h3>
<p className="text-on-surface-variant max-w-md leading-relaxed" >
                            Detaillierte, phasenweise Desinfektion aller Oberflächen, einschließlich staubintensiver Bereiche, Lüftungen und Innenschränke. Wir garantieren staubfreie Räume, bereit für den Einzug.
                        </p>
</div>
<div className="mt-12 flex items-center gap-6">
<div className="flex flex-col">
<span className="font-bold text-primary" >Innenpolitur</span>
<span className="text-sm text-on-surface-variant" >Fenster, Beschläge &amp; Leisten</span>
</div>
<div className="h-10 w-px bg-outline-variant"></div>
<div className="flex flex-col">
<span className="font-bold text-primary" >HEPA-Luftreinigung</span>
<span className="text-sm text-on-surface-variant" >Partikelentfernung</span>
</div>
</div>
<div className="absolute bottom-[-10%] right-[-5%] w-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-[200px]!" data-icon="cleaning_services" >cleaning_services</span>
</div>
</div>
{/*  Side Card 1  */}
<div className="md:col-span-4 bg-secondary text-on-secondary rounded-3xl p-10 flex flex-col justify-center hover:scale-[1.02] transition-transform">
<span className="text-5xl font-headline font-black opacity-30 mb-4" >02</span>
<h3 className="text-2xl font-headline font-bold mb-4" >Baugrobreinigung</h3>
<p className="text-secondary-fixed opacity-90" >
                        Aufrechterhaltung einer sicheren, organisierten Arbeitsumgebung während der Bauphase, um Effizienz und Sicherheit für alle Gewerke zu maximieren.
                    </p>
</div>
{/*  Bottom Card  */}
<div className="md:col-span-12 bg-surface-container-highest rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-12 group">
<div className="md:w-1/2">
<span className="text-5xl font-headline font-black text-primary/20 mb-4 block" >03</span>
<h3 className="text-3xl font-headline font-bold mb-4" >Schuttentsorgung</h3>
<p className="text-on-surface-variant leading-relaxed" >
                            Fachgerechte Entsorgung von Restmaterialien, Abfallmanagement und Geländebereinigung. Wir erledigen die grobe Arbeit, damit Ihr Design glänzen kann.
                        </p>
<ul className="mt-8 space-y-3">
<li className="flex items-center gap-3 font-semibold text-primary" >
<span className="material-symbols-outlined" >check_circle</span>
                                Umweltfreundliche Entsorgungsstandards
                            </li>
<li className="flex items-center gap-3 font-semibold text-primary" >
<span className="material-symbols-outlined" >check_circle</span>
                                Sicherheitsorientierte Geräteführung
                            </li>
</ul>
</div>
<div className="md:w-1/2 w-full h-64 relative rounded-2xl overflow-hidden">
<img alt="Construction site interior" className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" data-alt="Interior of a large modern construction site with professional grade cleaning equipment and a clear, dust-free atmosphere." src="https://lh3.googleusercontent.com/aida-public/AB6AXuByKR5klSRWgLM8jki43aT-sIwsqi_jUkqPNq7PmLIiKwqv9uuM_-OtysVo3ldRfWNnUZ0JTH1t52B63RHd7RwdkYmwZHvwZ13fpAIo7utuRHrvx8T5p8lEiHiDriEbOGx4tOTjF_9yLc7p3xBtY1h_6U_mvUnIZy2UKyy8nRLYdT5VCpAsaLYGKxXsIQHQH1X96WyDqACORTT_QHspJhmDn0umpuZzTqdSmkNjPjmQN5EtqGLlW7iP7MNyuS3hvqnQSL_k893-4-I"  />
</div>
</div>
</div>
</div>
</section>
{/*  Why Choose Us  */}
<section className="py-32 bg-surface-container-low overflow-hidden">
<div className="max-w-7xl mx-auto px-8 relative">
<div className="text-center mb-24">
<h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight" >Auf Exzellenz programmiert</h2>
<p className="mt-4 text-on-surface-variant max-w-2xl mx-auto italic" >"Präzision ist kein Zufall; sie ist unser Standard."</p>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
{/*  Feature 1  */}
<div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 border-primary">
<div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-3xl!" data-icon="speed" >speed</span>
</div>
<h4 className="font-headline font-bold text-xl mb-3" >Schnelle Abwicklung</h4>
<p className="text-on-surface-variant text-sm leading-relaxed" >Optimierte Arbeitsabläufe, um aggressive Deadlines ohne Qualitätsverlust einzuhalten.</p>
</div>
{/*  Feature 2  */}
<div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 border-primary">
<div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-3xl!" data-icon="precision_manufacturing" >precision_manufacturing</span>
</div>
<h4 className="font-headline font-bold text-xl mb-3" >Industriestandards</h4>
<p className="text-on-surface-variant text-sm leading-relaxed" >Einsatz medizinischer Filtertechnik und schwerer Industriestaubsauger.</p>
</div>
{/*  Feature 3  */}
<div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 border-primary">
<div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-3xl!" data-icon="verified_user" >verified_user</span>
</div>
<h4 className="font-headline font-bold text-xl mb-3" >Zertifizierte Sicherheit</h4>
<p className="text-on-surface-variant text-sm leading-relaxed" >Vollständig geschulte Teams für die Navigation auf risikoreichen Baustellen.</p>
</div>
{/*  Feature 4  */}
<div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 border-primary">
<div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-3xl!" data-icon="award_star" >award_star</span>
</div>
<h4 className="font-headline font-bold text-xl mb-3" >Professionelle Ergebnisse</h4>
<p className="text-on-surface-variant text-sm leading-relaxed" >Akribische Liebe zum Detail, die Kundenzufriedenheit garantiert.</p>
</div>
</div>
</div>
</section>
{/*  Trust Section  */}
<section className="py-24 bg-surface border-y border-outline-variant/10">
<div className="max-w-7xl mx-auto px-8">
<div className="flex flex-col md:flex-row items-center gap-16">
<div className="md:w-1/3">
<h3 className="font-headline text-3xl font-bold mb-4" >Vertraut von führenden Entwicklern</h3>
<p className="text-on-surface-variant mb-6" >Über 50.000 Quadratmeter hochwertiger Gewerbe- und Wohnimmobilien perfekt poliert.</p>
<div className="flex items-center gap-2">
<div className="flex -space-x-4">
<div className="w-12 h-12 rounded-full border-4 border-surface bg-primary/20 flex items-center justify-center font-bold" >RK</div>
<div className="w-12 h-12 rounded-full border-4 border-surface bg-secondary/20 flex items-center justify-center font-bold" >GG</div>
<div className="w-12 h-12 rounded-full border-4 border-surface bg-primary/10 flex items-center justify-center font-bold" >CP</div>
</div>
<span className="text-sm font-semibold ml-4" >+120 Lokale Projekte</span>
</div>
</div>
<div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
<div className="h-20 flex items-center justify-center font-black text-2xl" >ARCHITECTS INC</div>
<div className="h-20 flex items-center justify-center font-black text-2xl" >BUILD-CO</div>
<div className="h-20 flex items-center justify-center font-black text-2xl" >SKYLINE</div>
<div className="h-20 flex items-center justify-center font-black text-2xl" >URBAN GRID</div>
</div>
</div>
</div>
</section>
{/*  Contact Form Section  */}
<section className="py-32 bg-surface" id="contact">
<div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
<div className="order-2 lg:order-1">
<div className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-2xl shadow-primary/5">
<h3 className="font-headline text-3xl font-bold mb-8" >Angebot anfordern</h3>
<form className="space-y-6">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" >Vorname</label>
<input className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" placeholder="Max" type="text" />
</div>
<div className="space-y-2">
<label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" >Nachname</label>
<input className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" placeholder="Mustermann" type="text" />
</div>
</div>
<div className="space-y-2">
<label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" >E-Mail Adresse</label>
<input className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" placeholder="max@beispiel.de" type="email" />
</div>
<div className="space-y-2">
<label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" >Telefonnummer</label>
<input className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" placeholder="+49 (0) 000 000000" type="tel" />
</div>
<button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:bg-emerald-800 transition-all active:scale-[0.98]" type="submit" >
                            Termin vereinbaren
                        </button>
</form>
</div>
</div>
<div className="order-1 lg:order-2">
<span className="font-label text-primary font-bold tracking-widest uppercase" >Heute starten</span>
<h2 className="font-headline text-4xl md:text-5xl font-extrabold mt-4 mb-8" >Machen wir Ihr Objekt bereit für die Übergabe.</h2>
<p className="text-on-surface-variant text-lg leading-relaxed mb-12" >
                    Unsere spezialisierten Baureinigungs-Teams sind kurzfristig einsatzbereit. Wir wissen um die hohe Bedeutung von Endabnahmen und feierlichen Eröffnungen.
                </p>
<div className="space-y-6">
<div className="flex items-start gap-4">
<span className="material-symbols-outlined text-primary bg-primary/10 p-3 rounded-lg" >call</span>
<div>
<h5 className="font-bold" >Sofortige Rückmeldung</h5>
<p className="text-sm text-on-surface-variant" >24/7 Support für dringende Standortanforderungen.</p>
</div>
</div>
<div className="flex items-start gap-4">
<span className="material-symbols-outlined text-primary bg-primary/10 p-3 rounded-lg" >location_on</span>
<div>
<h5 className="font-bold" >Einsatzgebiete</h5>
<p className="text-sm text-on-surface-variant" >Einsatzbereit in der gesamten Metropolregion.</p>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  Final CTA  */}
<section className="py-24 bg-inverse-surface text-inverse-on-surface relative overflow-hidden">
<div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
<span className="material-symbols-outlined text-[500px]!" data-icon="corporate_fare" >corporate_fare</span>
</div>
<div className="max-w-7xl mx-auto px-8 text-center relative z-10">
<h2 className="font-headline text-4xl md:text-6xl font-bold mb-8" >Bereit für die Eröffnung?</h2>
<p className="text-xl opacity-80 mb-12 max-w-2xl mx-auto" >Lassen Sie Baustaub nicht den Glanz Ihres Entwurfs trüben. Sichern Sie sich heute eine Präzisionsreinigung.</p>
<a className="inline-flex bg-primary-fixed text-on-primary-fixed px-12 py-5 rounded-full font-black text-xl hover:scale-105 transition-transform" href="#contact" >
                Kostenloses Angebot
            </a>
</div>
</section>
</main>
{/*  Footer  */}
<footer className="bg-stone-100 dark:bg-stone-950 full-width py-12">
<div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto">
<div className="mb-8 md:mb-0">
<div className="flex items-center gap-3 mb-2">
<Image src="/RK-Logo-02.png" alt="R&K-Gaggenau Logo" width={200} height={50} className="h-10 w-auto object-contain" />
<span className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">R&amp;K-GAGGENAU</span>
</div>
<p className="font-inter text-xs tracking-wide uppercase text-stone-500" >© 2024 R&amp;K-Gaggenau Präzisionsreinigung. Alle Rechte vorbehalten.</p>
</div>
<div className="flex flex-wrap justify-center gap-8 font-inter text-xs tracking-wide uppercase">
<a className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 opacity-80 hover:opacity-100 transition-opacity underline-offset-4 hover:underline" href="#" >Datenschutz</a>
<a className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 opacity-80 hover:opacity-100 transition-opacity underline-offset-4 hover:underline" href="#" >AGB</a>
<a className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 opacity-80 hover:opacity-100 transition-opacity underline-offset-4 hover:underline" href="#" >Servicegebiete</a>
<a className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 opacity-80 hover:opacity-100 transition-opacity underline-offset-4 hover:underline" href="#" >Karriere</a>
</div>
</div>
</footer>

    </>
  );
}