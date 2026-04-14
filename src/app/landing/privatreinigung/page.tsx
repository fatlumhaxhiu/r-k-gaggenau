import Link from "next/link";
import Image from "next/image";
import LandingMobileNav from "@/components/layout/LandingMobileNav";
export default function PrivatreinigungPage() {
  return (
    <>
      
{/*  TopNavBar  */}
<nav className="docked full-width top-0 sticky z-50 bg-emerald-50/80 dark:bg-stone-900/80 backdrop-blur-xl no-border tonal-shift">
<div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
<Link href="/" className="flex items-center gap-3">
<Image src="/RK-Logo-02.png" alt="R&K-Gaggenau Logo" width={200} height={50} className="h-10 w-auto object-contain" priority />
<span className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">R&amp;K-GAGGENAU</span>
</Link>
<div className="hidden md:flex gap-8 items-center">
<Link className="font-manrope tracking-tight text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-emerald-700 transition-colors duration-300" href="/landing/gewerbereinigung" >Gewerblich</Link>
<Link className="font-manrope tracking-tight text-sm font-bold text-emerald-800 dark:text-emerald-300 border-b-2 border-emerald-600" href="/landing/privatreinigung" >Privat</Link>
<Link className="font-manrope tracking-tight text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-emerald-700 transition-colors duration-300" href="/landing/grundreinigung" >Grundreinigung</Link>
<Link className="font-manrope tracking-tight text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-emerald-700 transition-colors duration-300" href="/landing/baureinigung" >Baugrundreinigung</Link>
<Link className="font-manrope tracking-tight text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-emerald-700 transition-colors duration-300" href="/landing/spezialreinigung" >Institutionell</Link>
<Link className="font-manrope tracking-tight text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-emerald-700 transition-colors duration-300" href="/landing/saisonale-pflege" >Saisonal</Link>
</div>
<Link href="#contact" className="hidden md:inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-lg text-white bg-emerald-700 hover:bg-emerald-800 transition-colors duration-300">Jetzt buchen</Link>
<LandingMobileNav activePath="/landing/privatreinigung" />
</div>
</nav>
{/*  Hero Section  */}
<section className="relative min-h-[921px] flex items-center overflow-hidden">
<div className="absolute inset-0 z-0">
<img className="w-full h-full object-cover grayscale-20 brightness-90" data-alt="Luxurious modern minimalist living room with floor-to-ceiling windows, natural wood accents, and pristine white surfaces in soft morning light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIrQyfr4B6vnQ97uepnUgFiA1jXL10Ydu9ARmZm6xpyaGDQm59YTkjEEW_RICkx1oLuqR_TqwZA8VCjk7VJAYvyUSTsQpYU26afhCBGaZyQF4iLfN1vahJ8RoXtYGjGbVsqaM1EUuXMkIxpisdRzw4-F9HNiQSFCOGaFbBfAkRzTMRqRNt3gXzF3TnXpsc4QNzBIswXEVfTQsjeJmCJkhLii1pYfp-V5Kx_67JVM6AHy71bWGJ_V-NKTOKotHgQ1LtIC3_KEkYBsI"  />
<div className="absolute inset-0 bg-linear-to-r from-surface via-surface/40 to-transparent"></div>
</div>
<div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
<div className="max-w-2xl">
<span className="font-label text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block" >Exzellenz im Wohnbereich</span>
<h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tighter mb-8" >
                    Makellose Heime, <br /><span className="text-primary italic" >Veredeltes Ambiente</span>
</h1>
<p className="font-body text-lg text-on-surface-variant mb-10 leading-relaxed max-w-lg" >
                    Wir heben die Wohnraumreinigung auf ein exzellentes Niveau. Wir behandeln Ihren Rückzugsort mit der Präzision, die er verdient, und sorgen dafür, dass jede Oberfläche Perfektion widerspiegelt.
                </p>
<div className="flex flex-col sm:flex-row gap-4">
<Link className="bg-primary text-white px-8 py-4 rounded-lg font-headline font-bold text-lg tracking-tight shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:bg-emerald-800 transition-all block text-center" href="#contact">
                        Termin vereinbaren
                    </Link>
<Link className="bg-surface-container-lowest text-primary border border-primary px-8 py-4 rounded-lg font-headline font-bold text-lg tracking-tight hover:bg-surface transition-colors text-center block" href="/leistungen" >
                        Leistungen entdecken</Link>
</div>
</div>
</div>
</section>
{/*  What's Included Section  */}
<section className="py-24 bg-surface-container-low">
<div className="max-w-7xl mx-auto px-8">
<div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
<div className="max-w-xl">
<h2 className="font-headline text-4xl font-bold tracking-tight mb-4" >Was enthalten ist</h2>
<p className="text-on-surface-variant leading-relaxed" >Umfassende Pflege, maßgeschneidert auf Ihren architektonischen Raum. Wir konzentrieren uns auf die Details, die luxuriöses Wohnen definieren.</p>
</div>
<div className="text-primary font-headline font-bold text-sm tracking-widest uppercase" >Präzisionskatalog</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-1">
{/*  Private House Cleaning  */}
<div className="group relative overflow-hidden bg-surface-container-lowest p-12 transition-all hover:bg-primary duration-500">
<div className="relative z-10">
<span className="text-6xl font-headline font-black text-secondary-fixed-dim/30 absolute -top-4 -right-4 group-hover:text-white/20" >01</span>
<span className="material-symbols-outlined text-primary text-4xl mb-8 group-hover:text-white" >home_work</span>
<h3 className="font-headline text-2xl font-bold mb-4 group-hover:text-white" >Einfamilienhausreinigung</h3>
<p className="text-on-surface-variant group-hover:text-white/80 leading-relaxed" >Systematische Pflege mehrstöckiger Wohnhäuser, mit Fokus auf viel genutzte Oberflächen und Gemeinschaftsbereiche.</p>
</div>
</div>
{/*  Apartment Cleaning  */}
<div className="group relative overflow-hidden bg-surface-container-lowest p-12 transition-all hover:bg-primary duration-500">
<div className="relative z-10">
<span className="text-6xl font-headline font-black text-secondary-fixed-dim/30 absolute -top-4 -right-4 group-hover:text-white/20" >02</span>
<span className="material-symbols-outlined text-primary text-4xl mb-8 group-hover:text-white" >apartment</span>
<h3 className="font-headline text-2xl font-bold mb-4 group-hover:text-white" >Wohnungsreinigung</h3>
<p className="text-on-surface-variant group-hover:text-white/80 leading-relaxed" >Spezialisierte Pflege für urbanes Wohnen, Optimierung der Organisation auf kleinem Raum und makellose Glasflächen.</p>
</div>
</div>
{/*  Move-in/Move-out Cleaning  */}
<div className="group relative overflow-hidden bg-surface-container-lowest p-12 transition-all hover:bg-primary duration-500">
<div className="relative z-10">
<span className="text-6xl font-headline font-black text-secondary-fixed-dim/30 absolute -top-4 -right-4 group-hover:text-white/20" >03</span>
<span className="material-symbols-outlined text-primary text-4xl mb-8 group-hover:text-white" >cleaning_services</span>
<h3 className="font-headline text-2xl font-bold mb-4 group-hover:text-white" >Einzug/Auszug</h3>
<p className="text-on-surface-variant group-hover:text-white/80 leading-relaxed" >Tiefenreinigungs-Protokolle für Übergänge, die eine sterile und makellose Basis für Ihr neues Kapitel schaffen.</p>
</div>
</div>
</div>
</div>
</section>
{/*  Why Choose Us  */}
<section className="py-24 overflow-hidden">
<div className="max-w-7xl mx-auto px-8">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
<div className="col-span-12 md:col-span-5 relative">
<div className="sticky top-32">
<h2 className="font-headline text-5xl font-extrabold tracking-tighter mb-8 leading-tight" >Der R&amp;K-Gaggenau <br /><span className="text-secondary italic" >Standard</span></h2>
<div className="space-y-12 mt-12">
<div className="flex gap-6">
<div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary" >verified_user</span>
</div>
<div>
<h4 className="font-headline font-bold text-xl mb-1" >Geprüfte Fachkräfte</h4>
<p className="text-on-surface-variant text-sm" >Hintergrundgeprüft und in der Pflege hochwertiger Architektur geschult.</p>
</div>
</div>
<div className="flex gap-6">
<div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary" >visibility_off</span>
</div>
<div>
<h4 className="font-headline font-bold text-xl mb-1" >Diskret &amp; Zuverlässig</h4>
<p className="text-on-surface-variant text-sm" >Beständige Planung mit Fokus auf Privatsphäre und Pünktlichkeit.</p>
</div>
</div>
</div>
</div>
</div>
<div className="col-span-12 md:col-span-7">
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="bg-surface-container-high rounded-xl p-8 aspect-square flex flex-col justify-between">
<span className="material-symbols-outlined text-primary text-5xl" >eco</span>
<div>
<h3 className="font-headline text-2xl font-bold mb-2" >Umweltfreundliche Optionen</h3>
<p className="text-on-surface-variant text-sm" >Biologisch abbaubare, ungiftige Mittel, die die Luftqualität Ihres Heims bewahren.</p>
</div>
</div>
<div className="bg-primary text-white rounded-xl p-8 aspect-square flex flex-col justify-between">
<span className="material-symbols-outlined text-white text-5xl" >stylus</span>
<div>
<h3 className="font-headline text-2xl font-bold mb-2 text-white" >Individuelle Heimpflege</h3>
<p className="text-white/80 text-sm" >Spezielle Protokolle für Materialien wie Marmor, Eiche oder Seidenbespannungen.</p>
</div>
</div>
<div className="col-span-1 md:col-span-2 rounded-xl overflow-hidden h-[300px]">
<img className="w-full h-full object-cover" data-alt="Close-up of a professional cleaner's gloved hand dusting a minimalist sculpture with extreme care and focus" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3SiLMZgWiw7731x8qMCTp9d0G7TS-YDg5QFKWxIu19kQ0K5txTCKwmL9Lmh1g1in36_EqNqIgWSsbcIStzLP4LkNNoKpPNHjVc9C-QLIu9tf3_5KXx-9t2ve60ZCd4euSxO42od6XH316tIfnn5_54ZtnrzcVdm2HjKzGz92SghHxgVKXsFVU7O6MBg14gzhdaOTm4TEAFIwtKsVEjpfAgfLppzxjzaGI1Q3En10s0kKRGytmwx-bL3DNVvsv2qYWsr8gJrsGDYo"  />
</div>
</div>
</div>
</div>
</div>
</section>
{/*  Trust Section  */}
<section className="py-24 bg-inverse-surface text-inverse-on-surface">
<div className="max-w-7xl mx-auto px-8">
<div className="flex flex-col items-center text-center mb-16">
<div className="flex gap-1 mb-6">
<span className="material-symbols-outlined text-secondary-fixed-dim" >star</span>
<span className="material-symbols-outlined text-secondary-fixed-dim" >star</span>
<span className="material-symbols-outlined text-secondary-fixed-dim" >star</span>
<span className="material-symbols-outlined text-secondary-fixed-dim" >star</span>
<span className="material-symbols-outlined text-secondary-fixed-dim" >star</span>
</div>
<h2 className="font-headline text-4xl font-bold mb-4" >Eine Atmosphäre des Vertrauens</h2>
<p className="text-white/60 max-w-2xl" >Wir betreuen die anspruchsvollsten Hausbesitzer der Region mit einer Kundenbindungsrate von 98%.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
<blockquote className="border-l-2 border-primary pl-8 py-4" >
<p className="text-2xl font-body italic mb-6 leading-relaxed" >"Die Liebe zum Detail ist unübertroffen. Das Haus ist nicht nur sauber; es fühlt sich kuratiert an. R&amp;K-Gaggenau bringt jede Woche ein Hotel-Luxus-Gefühl in unser Heim."</p>
<cite className="font-headline font-bold not-italic">— Eleanor Vance, <span className="font-normal text-white/50" >Privatbesitzerin</span></cite>
</blockquote>
<blockquote className="border-l-2 border-primary pl-8 py-4" >
<p className="text-2xl font-body italic mb-6 leading-relaxed" >"Der Umzug in ein neues Penthouse verlief reibungslos. Ihr Einzugsteam war unsichtbar und doch gründlich und hinterließ den Raum in Showroom-Zustand."</p>
<cite className="font-headline font-bold not-italic">— Julian Thorne, <span className="font-normal text-white/50" >Projektentwickler</span></cite>
</blockquote>
</div>
</div>
</section>
{/*  Contact Form & Booking  */}
<section className="py-24 bg-surface scroll-mt-24" id="contact">
  <div className="max-w-7xl mx-auto px-4 md:px-8">
    <div className="bg-surface-container-lowest rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row w-full border border-outline-variant/20">
      
      {/* Left Column - Form */}
      <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 text-on-surface">
          Erleben Sie den <span className="text-primary">Gaggenau Unterschied</span>
        </h2>
        <p className="text-on-surface-variant mb-12 text-lg leading-relaxed">
          Geben Sie Ihre Daten an und unser Concierge wird Sie kontaktieren, um einen maßgeschneiderten Reinigungsplan für Ihre Residenz zu besprechen.
        </p>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant block mb-2">Vorname</label>
              <input placeholder="Vorname eingeben" className="w-full bg-surface-container-high border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" type="text" />
            </div>
            <div>
              <label className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant block mb-2">Nachname</label>
              <input placeholder="Nachname eingeben" className="w-full bg-surface-container-high border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" type="text" />
            </div>
          </div>
          <div>
            <label className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant block mb-2">E-Mail Adresse</label>
            <input placeholder="email@firma.de" className="w-full bg-surface-container-high border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" type="email" />
          </div>
          <div>
            <label className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant block mb-2">Telefonnummer</label>
            <input placeholder="+49 (0) 000 000000" className="w-full bg-surface-container-high border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" type="tel" />
          </div>
          <button className="w-full bg-primary text-white hover:bg-emerald-800 font-headline font-bold text-base py-5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all mt-4" type="submit">
            Termin vereinbaren
          </button>
        </form>
      </div>

      {/* Right Column - Image */}
      <div className="w-full md:w-1/2 relative min-h-[500px] md:min-h-0 hidden md:block">
        <img 
          className="absolute inset-0 w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWQhHCerv4vsaveG2ev5-VphwwDwGwyLYHqMw8EshvKr7J-bDsX_gwXDIk9RoBK_9I9Zio470zKU_tOQeTKa2fnYCdQD0XTrg-uHmmv2UUteNu7iwz8Ajl4Cvw_oS_eD8gDBOLNmriY2QC5RjB6MKOti9pX8z2onQEBEJ2mpJLpOrFhKnaST8lGNnVmGeRwusiQKpKOTMEE1_AjhI7LdR73rwcR_hZ7-dldpU1rSa64FduDfhEhQ5Y0wHiGTA6XZup8PcOd-T7V-I" 
          alt="Interior clean hallway" 
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>
        
        {/* Quote Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <div className="flex gap-1 mb-6 text-amber-500">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
          </div>
          <p className="font-headline font-bold text-xl md:text-2xl leading-tight mb-4">
            &quot;Die Liebe zum Detail ist unübertroffen. Das Haus ist nicht nur sauber; es fühlt sich kuratiert an.&quot;
          </p>
          <p className="text-white/60 text-sm">
            — Eleanor Vance, Privatbesitzerin
          </p>
        </div>
      </div>

    </div>
  </div>
</section>
{/*  Final CTA  */}
<section className="py-32 bg-primary-container relative overflow-hidden">
<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
<div className="max-w-4xl mx-auto px-8 text-center relative z-10">
<h2 className="font-headline text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter" >Bereit für Perfektion?</h2>
<p className="text-white/80 text-xl mb-12 font-light" >Werden Sie Teil der Gemeinschaft von Hausbesitzern, die mehr als nur ein sauberes Haus verlangen.</p>
<button className="bg-white text-primary px-12 py-5 rounded-full font-headline font-black text-xl tracking-tight shadow-2xl hover:scale-105 transition-transform" >
                Ersten Besuch buchen
            </button>
</div>
</section>
{/*  Footer  */}
<footer className="bg-stone-100 dark:bg-stone-950 full-width py-12">
<div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto">
<div className="mb-8 md:mb-0">
<div className="text-lg font-black text-stone-900 dark:text-stone-100 font-headline uppercase tracking-widest mb-2" >R&amp;K-Gaggenau</div>
<p className="font-inter text-xs tracking-wide uppercase text-stone-500" >© 2024 R&amp;K-Gaggenau Precision Cleaning. Alle Rechte vorbehalten.</p>
</div>
<div className="flex flex-wrap gap-8 justify-center">
<a className="font-inter text-xs tracking-wide uppercase text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100" href="#" >Datenschutz</a>
<a className="font-inter text-xs tracking-wide uppercase text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100" href="#" >AGB</a>
<a className="font-inter text-xs tracking-wide uppercase text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100" href="#" >Einsatzgebiete</a>
<a className="font-inter text-xs tracking-wide uppercase text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100" href="#" >Karriere</a>
</div>
</div>
</footer>

    </>
  );
}
