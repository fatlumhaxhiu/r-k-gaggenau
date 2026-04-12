import Image from "next/image";
import { ArrowRight, Building2, SprayCan, Home, Hammer, Droplets, Snowflake, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const serviceDetails = [
  {
    id: "01",
    title: "GEWERBEREINIGUNG",
    href: "/landing/gewerbereinigung",
    description: "Zuverlässige Reinigungslösungen für Büros und Gewerbeflächen.",
    icon: <Building2 className="h-6 w-6" />,
    bullets: [
      "Büroreinigung",
      "Unterhaltsreinigung",
      "Gebäudereinigung",
      "Treppenhausreinigung"
    ]
  },
  {
    id: "02",
    title: "SONDERREINIGUNG",
    href: "/landing/spezialreinigung",
    description: "Höchste Hygienestandards für sensible Umgebungen.",
    icon: <SprayCan className="h-6 w-6" />,
    bullets: [
      "Praxisreinigung",
      "Schulen & Kindergärten",
      "Solar- & Fassadenreinigung"
    ]
  },
  {
    id: "03",
    title: "PRIVATREINIGUNG",
    href: "/landing/privatreinigung",
    description: "Maßgeschneiderte Pflege für Ihr privates Zuhause.",
    icon: <Home className="h-6 w-6" />,
    bullets: [
      "Haushaltsreinigung",
      "Wohnungsreinigung",
      "Einzugs- / Auszugsreinigung"
    ]
  },
  {
    id: "04",
    title: "BAUREINIGUNG",
    href: "/landing/baureinigung",
    description: "Fachmännische Pflege nach Abschluss Ihrer Bau- oder Renovierungsprojekte.",
    icon: <Hammer className="h-6 w-6" />,
    bullets: [
      "Bauendreinigung",
      "Baugrobreinigung"
    ]
  },
  {
    id: "05",
    title: "GRUNDREINIGUNG",
    href: "/landing/grundreinigung",
    description: "Intensive und detaillierte Tiefenreinigung für außergewöhnliche Standards.",
    icon: <Droplets className="h-6 w-6" />,
    bullets: [
      "Grundreinigung",
      "Intensive Bodenpflege"
    ]
  },
  {
    id: "06",
    title: "WINTERDIENST",
    href: "/landing/saisonale-pflege",
    description: "Zuverlässige Instandhaltung zu jeder Jahreszeit für Ihre Sicherheit.",
    icon: <Snowflake className="h-6 w-6" />,
    bullets: [
      "Winterdienst",
      "Schnee- & Eisbeseitigung"
    ]
  }
];

export default function Leistungen() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-32 overflow-hidden bg-background">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl pt-10">
              <h5 className="text-xs font-bold tracking-widest text-primary uppercase mb-4">
                EXZELLENZ IN DER INSTANDHALTUNG
              </h5>
              <h1 className="font-heading text-6xl lg:text-[5.5rem] font-black tracking-tight text-foreground leading-none mb-8">
                Unsere <span className="text-primary">Leistungen</span>
              </h1>
              <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary/40">
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  Professionelle Reinigungslösungen für Unternehmen, Institutionen und Privatkunden in ganz Deutschland. Wir definieren Hygiene durch atmosphärische Präzision neu.
                </p>
              </div>
            </div>

            <div className="relative h-[500px] w-full rounded-[2rem] overflow-hidden lg:-mr-20 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop"
                alt="Professional cleaner wiping glass"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Complex Services Grid */}
      <section className="py-24 bg-muted/20 border-t border-border/40">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceDetails.map((service) => (
              <div key={service.id} className="flex flex-col bg-background p-10 rounded-2xl shadow-sm border border-border/60 hover:shadow-2xl hover:border-primary/20 transition-all duration-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-primary/10 text-primary mb-8">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black font-heading text-foreground mb-4 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                  {service.description}
                </p>
                <ul className="flex flex-col gap-3 mb-10">
                  {service.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                      <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                      </div>
                      {bullet}
                    </li>
                  ))}
                </ul>
                <Link href={service.href} className="text-sm font-bold text-primary flex items-center gap-2 group mt-auto hover:text-primary/80 transition-colors">
                  Mehr erfahren <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Highlight */}
      <section className="py-24 bg-muted/40 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[450px] w-full rounded-[2rem] overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1200&auto=format&fit=crop"
                alt="Cleaner wiping floor"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex flex-col items-start pr-12">
              <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
                Bereit für einen makellosen Raum?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                Kontaktieren Sie uns noch heute für ein unverbindliches Angebot, das genau auf Ihre Anforderungen zugeschnitten ist. Wir sind stolz auf unsere Zuverlässigkeit und höchste Qualitätsstandards.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground h-14 px-8 text-base shadow-xl rounded-md hover:bg-primary/90">
                  Angebot anfordern
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-primary/20 bg-transparent text-foreground hover:bg-primary/5 transition-all rounded-md">
                  Portfolio ansehen
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
