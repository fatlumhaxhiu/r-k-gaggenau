import Image from "next/image";
import { ArrowRight, Building2, Sparkles, Home, Hammer, Droplets, Snowflake, ShieldCheck, Clock, CheckCircle2, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteData } from "@/data/mockData";
import Link from "next/link";

// Icon mapping helper
const getIcon = (name: string) => {
  switch (name) {
    case 'building': return <Building2 className="h-6 w-6" />;
    case 'sparkles': return <Sparkles className="h-6 w-6" />;
    case 'home': return <Home className="h-6 w-6" />;
    case 'hammer': return <Hammer className="h-6 w-6" />;
    case 'spray': return <Droplets className="h-6 w-6" />;
    case 'snowflake': return <Snowflake className="h-6 w-6" />;
    default: return <CheckCircle2 className="h-6 w-6" />;
  }
};

export default function Startseite() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section with Badge Overlay */}
      <section className="relative overflow-hidden bg-background pt-20 pb-32">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            
            {/* Text Content */}
            <div className="flex flex-col items-start max-w-xl pr-8">
              <div className="inline-flex items-center rounded-sm bg-primary/10 px-3 py-1 mb-6">
                <span className="text-xs font-bold tracking-widest text-primary uppercase">
                  {siteData.hero.badge}
                </span>
              </div>
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05] mb-6">
                Professionelle <span className="text-primary">Reinigung</span> in Deutschland
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Zuverlässig. Effizient. Hochwertige Reinigungsleistungen, maßgeschneidert für anspruchsvolle Geschäfts- und Privatkunden.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground h-14 px-8 text-base shadow-xl rounded-md">
                  Angebot anfordern
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-border bg-transparent hover:bg-muted text-foreground transition-all rounded-md">
                  Unsere Leistungen
                </Button>
              </div>
            </div>

            {/* Image Content with overlapping Trust Badge */}
            <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1200&auto=format&fit=crop"
                alt="Professional cleaner working"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-r from-background/60 to-transparent lg:hidden" />
              
              {/* Floating Trust Badge */}
              <div className="absolute bottom-8 right-8 bg-background/95 backdrop-blur-[10px] p-4 pr-6 rounded-lg shadow-2xl border border-border/50 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground leading-none mb-1">Vertraute Qualität</h4>
                  <p className="text-xs text-muted-foreground leading-tight">Über 1000 standardisierte<br/>Reinigungsabläufe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Präzisions-Leistungen - 3x2 Grid */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <h5 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-2 flex items-center gap-4">
              <span className="w-8 h-px bg-muted-foreground/30"></span> 
              Maßgeschneiderte Pflege
            </h5>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Präzisions-Leistungen
            </h2>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-4 gap-6">
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                Relevanz ist Verpflichtung, kein Portfolio zu verkaufen. Wir verbinden wissenschaftliche Präzision mit legendärer deutscher Qualität, um Ihren Raum neu zu definieren.
              </p>
              <Link href="/leistungen">
                <Button className="bg-primary text-primary-foreground hover:bg-emerald-800">
                  Alle Leistungen ansehen <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {siteData.benefits.map((service) => (
              <div key={service.id} className="group relative flex flex-col p-8 lg:p-10 bg-background border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 rounded-2xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  {getIcon(service.icon)}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 font-heading">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8 flex-1">
                  {service.description}
                </p>
                <Link href={service.href || "/leistungen"} className="text-xs font-bold text-primary tracking-widest uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
                  Mehr Erfahren <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Feature Split (5 Jahre Exzellenz) */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <div className="relative">
              <div className="relative h-[600px] w-full max-w-lg mx-auto lg:h-[700px] rounded-[2rem] overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop"
                  alt="Modern clean interior space"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-10 lg:bottom-10 lg:-right-10 bg-primary p-8 lg:p-12 rounded-xl shadow-2xl z-20 max-w-[280px]">
                <h2 className="font-heading text-5xl lg:text-6xl font-black text-primary-foreground leading-none mb-2">5 JAHRE</h2>
                <p className="text-xl text-primary-foreground/90 font-medium">Exzellenz</p>
              </div>
            </div>

            <div className="flex flex-col justify-center pt-16 lg:pt-0">
              <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-12">
                Atmosphärische <br/>Präzision in jeder Ecke
              </h2>

              <div className="flex flex-col gap-10">
                <div className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground mb-2">Erfahrenes Team</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Unser Personal besteht aus streng geprüften und geschulten Spezialisten, die auf die absolute Nuancen verstehen.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground mb-2">Flexible Zeitplanung</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Service rund um die Uhr, abgestimmt auf Ihren Geschäftszyklus oder Leerezeit – ohne Störungen.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground mb-2">Höchste Standards</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Verwendung erstklassiger, umweltfreundlicher Reinigungsmittel und modernster Ausrüstung für ein perfektes Ergebnis.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Vertrauen von Experten (Testimonials) */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h5 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Kundenstimmen</h5>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground">
              Vertrauen von Experten
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {siteData.testimonials.map((test) => (
              <div key={test.id} className="bg-background border border-border/60 p-8 lg:p-10 rounded-2xl relative shadow-sm">
                <Quote className="absolute top-8 right-8 h-10 w-10 text-muted/50" />
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-primary-container" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground italic leading-relaxed mb-8 text-[15px]">
                  {test.quote}
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 text-sm font-bold text-muted-foreground">
                    {test.author.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-foreground">{test.author}</h5>
                    <p className="text-xs text-muted-foreground">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Branchen-Insights */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Branchen-Insights
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {siteData.blogArticles.map((article) => (
              <Link key={article.id} href={`/magazin/${article.slug}`} className="group flex flex-col">
                <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors z-10" />
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Circular cutout approximation via pseudo-elements or just simple badge for now */}
                  <div className="absolute bottom-4 left-4 bg-background px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase rounded z-20">
                    {article.tag}
                  </div>
                </div>
                <h3 className="text-lg font-bold font-heading text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {article.desc}
                </p>
                <span className="text-xs font-bold text-primary tracking-widest uppercase flex items-center gap-2 mt-auto">
                  Mehr lesen <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Deep Green Footer CTA */}
      <section className="bg-primary pt-24 pb-32">
        <div className="container mx-auto px-6 lg:px-12 text-center flex flex-col items-center">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight text-primary-foreground mb-6 max-w-3xl">
            Bereit für atmosphärische Präzision?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl leading-relaxed">
            Kontaktieren Sie uns noch heute für eine kostenlose Beratung und einen maßgeschneiderten Pflegeplan für Ihr Objekt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="bg-background text-foreground hover:bg-muted h-14 px-8 text-base">
              Kontaktieren Sie uns
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-white h-14 px-8 text-base">
              Ablauf entdecken
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
