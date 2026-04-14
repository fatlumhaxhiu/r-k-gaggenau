import Link from "next/link";
import Image from "next/image";
import LandingMobileNav from "@/components/layout/LandingMobileNav";
export default function GrundreinigungPage() {
  return (
    <>
      
<nav className="bg-emerald-50/80 dark:bg-stone-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50">
<div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
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
<div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-12 gap-12 items-center">
<div className="lg:col-span-7 z-10">
<span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary uppercase bg-primary-fixed rounded-full font-label">
                    Premium-Service-Stufe
                </span>
<h1 className="font-headline text-5xl lg:text-7xl font-extrabold tracking-tight text-on-surface mb-8 leading-[1.1]">
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
<img alt="Makellose moderne weiße Küche" className="w-full h-full object-cover" data-alt="Close up of a minimalist luxury kitchen with marble countertops and sunlight reflecting off pristine stainless steel appliances" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP8Us3akmYDdMb-w60oH17sUviYDQHQKKl_Ao6X4n6VdRHmZ5dnWtLbNYX0X6XYseX2Flz1ZOO0F5Emv8e3dQ0-n_XsqegZix_M-V9OKVO6QOAjMEc2bLDLv5EQ2r4dTAdmEUCcKz9HtFm_I7B3iMoDIV2FJiMr3a3O5rF2AvJUitEDej5GvD2rlRPKjDV60a4PVurLcehbelCFGAptagkxcXpKdh-Fe_HEV3TjKqOWZfxRUnFMAaCP44dsNJxzvwIzUrbhwyczuk"/>
</div>
<div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary-fixed-dim rounded-2xl -z-10 mix-blend-multiply opacity-50 blur-2xl"></div>
</div>
</div>
</header>
<section className="py-24 bg-surface-container-low" id="included">
<div className="max-w-7xl mx-auto px-8">
<div className="flex flex-col md:flex-row justify-between items-end mb-20">
<div className="max-w-2xl">
<h2 className="font-headline text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-6">Was enthalten ist</h2>
<p className="text-on-surface-variant text-lg">Unser Grundreinigungsprotokoll ist eine architektonische Wiederherstellung Ihrer Wohn- oder Arbeitsumgebung.</p>
</div>
<div className="hidden md:block h-px w-32 bg-outline-variant mb-4"></div>
</div>
<div className="grid md:grid-cols-3 gap-8">
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
<div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
<div className="relative order-2 lg:order-1">
<div className="grid grid-cols-2 gap-4">
<div className="space-y-4">
<div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
<img alt="Sauberes modernes Badezimmer" className="w-full h-full object-cover" data-alt="Ultra-clean bathroom with white tiles and minimalist fixtures under bright natural morning light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJTq1iLt6pKYXxoZi8rOcaeiKkNstqfeqna3AJIG1MANcSnCRlo9S-sLoKyHAkvsHGwHlz-_OtPbpNIa2f83Yk4Ue2J2lCJSqFAuX5zBatUFhO7CnSM87s4AhmqUECK3jv5WsN1rz2fR8K14h1l6hx_2D50gtT_O0fBy8yphu4nbhAkJCpMe9tcx6uCTd5l7geYiEm04-KQIu-T1GHGAWkRuNOLinspnbSY75vRYP_QES2sojgdC4KRbr8JSyoYEbGOV3FmiMIC6Y"/>
</div>
<div className="aspect-3/4 rounded-2xl overflow-hidden shadow-lg">
<img alt="Saubere Küchendetails" className="w-full h-full object-cover" data-alt="Macro shot of a sparkling clean kitchen faucet and marble sink with water droplets reflecting the light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRLeMyNRATGU0-ZrkFKF_bLd5LIeRVQheHCrnxMmmUTMCK04hx8inBdaThbXtTcAUnyEmDVvdBfNKspOv7I_BuUi1Ev7JPoFSWzmXBppx7OVU8oA6PEogwyjXWEqMDX3CKagSB1DJGhLXyrYwH2BXNSY-KPlIY99dOFPCuV8fH7asCbTIB9ks0FmE09DwEtMSvWvmMfN7kIYxkoJ4mNIPjRUBya1A0yd3Nx08r4WSc3JnwSes2BZJue_ZrrVmqmcIIupeK2u4thys"/>
</div>
</div>
<div className="space-y-4 pt-8">
<div className="aspect-3/4 rounded-2xl overflow-hidden shadow-lg">
<img alt="Organisierter moderner Wohnraum" className="w-full h-full object-cover" data-alt="Sunlit modern living room with perfectly arranged furniture and immaculate hardwood floors" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6SbrTAAvIJwHUiyEtKE62WGB_WmIAicHHOPTSpP-K9tZmf_eW1fgtk6XldU4eYyF_crY8LK6cuxVrx9MMB3tc3x_1ycraw40uCG1ZKdQJI2miFCKmFCEBS9aWdfsrHb2nBAq5UTwkGTnbyAMry84p9mYfU21HTgnWJ3wBvuEv-USdiWnrvPC6HdKrtyL5un-sTLuygdU3KQhFhjsRgwuecNEnCbOe0o9lSyzSMPrN-YKNTL8EoWLVkhPqynYlW53FKqEVDKBdRKU"/>
</div>
<div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
<img alt="Sauberes architektonisches Detail" className="w-full h-full object-cover" data-alt="Detailed view of white minimalist stairs and pristine glass railing in a luxury home" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXS9UXsq4uVPt6rcxi37tHHQijEtlrHG8lox9wPmEHKj0fwW6OFeHZeMDthinEzOHImkTnXEaL9XCZODRsMGnEDm241tZX5fk6LRDRkPwGdU9RXW3Glb3KuyThEw0T8_cKMa_FTlgXTU-o6LO91xWV52R1K5E5g1SRqftiala_3TcK-XJ1TuyyKF_fhQeCRma1CJJcLZv2BL-QtuJnTVSMxoFIYkm0n1q0pcZPLvHfVIJddXY8LwvtspUbeqRJRmKML-aCaX4hVTI"/>
</div>
</div>
</div>
</div>
<div className="order-1 lg:order-2">
<h2 className="font-headline text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-12">Warum Sie uns wählen sollten</h2>
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
                "Atmosphärische Präzision ist nicht nur unser Slogan; es ist unser Versprechen. Wenn sich Ihr Raum nicht spürbar verwandelt anfühlt, haben wir unsere Arbeit noch nicht beendet."
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
<div className="bg-surface-container-lowest rounded-[2rem] shadow-xl overflow-hidden flex flex-col lg:flex-row">
<div className="lg:w-1/2 p-12 lg:p-20">
<h2 className="font-headline text-4xl font-bold mb-6">Bereit für eine <span className="text-primary">komplette Erneuerung?</span></h2>
<p className="text-on-surface-variant mb-10 text-lg">Vereinbaren Sie noch heute Ihren Beratungstermin für die Grundreinigung. Unsere Spezialisten bewerten Ihre Anforderungen und erstellen einen maßgeschneiderten Plan.</p>
<form className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Vorname</label>
<input className="w-full bg-surface-container-high border-none rounded-xl p-4 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="Vorname eingeben" type="text"/>
</div>
<div className="space-y-2">
<label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Nachname</label>
<input className="w-full bg-surface-container-high border-none rounded-xl p-4 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="Nachname eingeben" type="text"/>
</div>
<div className="space-y-2 md:col-span-2">
<label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">E-Mail-Adresse</label>
<input className="w-full bg-surface-container-high border-none rounded-xl p-4 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="email@firma.de" type="email"/>
</div>
<div className="space-y-2 md:col-span-2">
<label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Telefonnummer</label>
<input className="w-full bg-surface-container-high border-none rounded-xl p-4 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="+49 (0) 000 000000" type="tel"/>
</div>
<div className="md:col-span-2 mt-4">
<button className="bg-primary hover:bg-emerald-800 w-full text-white font-bold py-4 rounded-xl shadow-lg transition-colors" type="submit">
                                Termin vereinbaren
                            </button>
</div>
</form>
</div>
<div className="lg:w-1/2 bg-surface-container-highest relative min-h-[400px]">
<img alt="Luxuriöses Wohninterieur" className="absolute inset-0 w-full h-full object-cover" data-alt="Wide angle shot of a luxury modern penthouse living room with expansive windows and pristine furniture layout" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqdfp7H0lMAZBQxPPIeG4n0heLmXyNY3KVpUKt9EArj3jPyFG44pauJW8P8WZalucis3AtbaXpnf513iPAEU-iF9F_Jeon1KM8OrC4BFAnWI86tqNBD0z31lZoQr2k7bvO31We1Mc_XPPM3cWDxHT-2ypys7iSiKkBjd7TVrBlIdjWhT0CJJphRszmMlynZa7KpFqPR-hB5jW7K_kEtCxjH1SK0hrPuw1rW7PsFr4JHUNFcEuhAzcfYZHKePnnPJ-b7ejZRuYIyJk"/>
<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end p-12">
<div className="text-white">
<div className="flex gap-1 mb-2">
<span className="material-symbols-outlined text-yellow-400" >star</span>
<span className="material-symbols-outlined text-yellow-400" >star</span>
<span className="material-symbols-outlined text-yellow-400" >star</span>
<span className="material-symbols-outlined text-yellow-400" >star</span>
<span className="material-symbols-outlined text-yellow-400" >star</span>
</div>
<p className="font-headline text-2xl font-bold">"Der Standard der Reinigung ist unübertroffen. Es fühlt sich wirklich so an, als würde man wieder in ein neues Zuhause einziehen."</p>
<p className="mt-4 opacity-80">— Privatkunde, München</p>
</div>
</div>
</div>
</div>
</div>
</section>
<footer className="bg-zinc-100 dark:bg-zinc-950 w-full px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 font-inter text-sm tracking-wide">
<div className="md:col-span-1">
<div className="flex items-center gap-3 mb-2">
<Image src="/RK-Logo-02.png" alt="R&K-Gaggenau Logo" width={200} height={50} className="h-10 w-auto object-contain" />
<span className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">R&amp;K-GAGGENAU</span>
</div>
<p className="text-zinc-500 dark:text-zinc-400">Atmosphärische Präzision in der Reinigung.</p>
</div>
<div className="md:col-span-2">
<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
<Link className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="/landing/gewerbereinigung">Gewerblich</Link>
<Link className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="/landing/privatreinigung">Privat</Link>
<Link className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="/landing/grundreinigung">Grundreinigung</Link>
<Link className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="/landing/baureinigung">Baugrundreinigung</Link>
<Link className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="/landing/spezialreinigung">Institutionell</Link>
<Link className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="/landing/saisonale-pflege">Saisonal</Link>
<a className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="#">Datenschutz</a>
<a className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors" href="#">AGB</a>
</div>
</div>
<div className="md:col-span-1 md:text-right">
<p className="text-zinc-500 dark:text-zinc-400">© 2024 R&amp;K-Gaggenau. Atmosphärische Präzision in der Reinigung.</p>
</div>
</footer>

    </>
  );
}
