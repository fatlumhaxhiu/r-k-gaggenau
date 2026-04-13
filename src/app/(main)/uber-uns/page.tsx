import Image from "next/image";
import { ArrowRight, ShieldCheck, Leaf, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UberUns() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section with Expertise Badge */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 bg-background flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            
            {/* Typography Left */}
            <div className="max-w-xl">
              <h5 className="text-xs font-bold tracking-widest text-primary-container uppercase mb-4">
                ETABLIERTE EXZELLENZ
              </h5>
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-[5.5rem] font-black tracking-tight text-foreground leading-none mb-8">
                Atmosphärische <span className="text-primary-container italic">Präzision</span> bis ins kleinste Detail.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Seit über 5 Jahren definiert R&K-GAGGENAU die Standards der professionellen Reinigung neu — durch eine Fusion aus deutscher Präzision und engagierter Sorgfalt.
              </p>
            </div>

            {/* Image Right with Badge */}
            <div className="relative w-full max-w-lg mx-auto lg:ml-auto">
              <div className="relative h-[450px] lg:h-[650px] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=800&auto=format&fit=crop"
                  alt="High-end corporate building interior"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              
              {/* Floating Expertise Badge */}
              <div className="absolute -bottom-8 left-0 lg:-left-8 bg-primary-container p-6 lg:p-10 rounded-xl shadow-2xl z-20">
                <h3 className="font-heading text-4xl lg:text-5xl font-black text-white leading-none mb-2">
                  5 JAHRE
                </h3>
                <p className="text-sm text-white/90 font-bold tracking-widest uppercase">
                  Expertise
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Asymmetrical Masonry & History */}
      <section className="py-32 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Asymmetrical 4-Image Grid Left */}
            <div className="grid grid-cols-2 gap-4 min-h-[400px] lg:h-[600px] w-full max-w-xl mx-auto">
              <div className="space-y-4 h-full flex flex-col">
                <div className="relative h-[45%] w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" alt="Team meeting" fill className="object-cover" />
                </div>
                <div className="relative h-[55%] w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  <Image src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop" alt="Cleaning session" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-4 h-full flex flex-col pt-12">
                <div className="relative h-[55%] w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop" alt="Conference room" fill className="object-cover" />
                </div>
                <div className="relative h-[45%] w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hue-rotate-15">
                  <Image src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600&auto=format&fit=crop" alt="Antique detail" fill className="object-cover" />
                </div>
              </div>
            </div>

            {/* History Text Right */}
            <div className="flex flex-col justify-center">
              <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-8">
                Eine Tradition des Vertrauens
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Gegründet auf den Prinzipien von Integrität und akribischer Detailarbeit, begann R&K-GAGGENAU als kleines Familienunternehmen mit einer einzigen Vision: editoriale Sauberkeit in jedes Zuhause und jeden Unternehmensraum zu bringen.
                </p>
                <p>
                  Wir reinigen nicht nur; wir stellen die architektonische Intention Ihrer Räume wieder her. Unser Team setzt fortschrittliche, nachhaltige Technologien ein, die sowohl Ihre Umgebung als auch unseren Planeten schützen.
                </p>
              </div>
              <div className="mt-10">
                <Button variant="link" className="text-primary-container text-base font-bold p-0 hover:no-underline hover:opacity-80">
                  Unsere Methodik <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Kernpfeiler (Core Pillars) Grid */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h5 className="text-xs font-bold tracking-widest text-primary-container uppercase mb-4">
              UNSER FUNDAMENT
            </h5>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Die Kernpfeiler
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-6">
            
            {/* Card 1: Zuverlässigkeit */}
            <div className="relative bg-background border border-border/70 p-10 rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
              <ShieldCheck className="absolute -bottom-4 -right-4 h-40 w-40 text-muted/20 group-hover:text-muted/30 transition-colors" strokeWidth={1} />
              
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 text-primary mb-6 z-10">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-foreground mb-4 z-10">
                Zuverlässigkeit
              </h3>
              <p className="text-muted-foreground leading-relaxed z-10">
                Pünktlichkeit ist unser stilles Versprechen. Wir verstehen, dass Ihre Zeit Ihr wertvollstes Gut ist, und wir ehren sie durch konsistente, tadellose Leistung.
              </p>
            </div>

            {/* Card 2: Nachhaltigkeit (Highlighted) */}
            <div className="relative bg-[#a5f0c5]/40 border border-[#a5f0c5] p-10 rounded-2xl shadow-lg shadow-primary-container/5 overflow-hidden flex flex-col group md:-translate-y-6">
              <Leaf className="absolute -bottom-4 -right-4 h-40 w-40 text-primary-container/10 group-hover:text-primary-container/20 transition-colors" strokeWidth={1} />
              
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary-container text-white mb-6 z-10 shadow-md">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-foreground mb-4 z-10">
                Nachhaltigkeit
              </h3>
              <p className="text-foreground/80 leading-relaxed font-medium z-10">
                Unser ökologischer Fußabdruck zählt. Wir verwenden ausschließlich zertifizierte, umweltfreundliche Lösungen, die einen giftfreien Rückzugsort für Sie und Ihre Familie garantieren.
              </p>
            </div>

            {/* Card 3: Expertise */}
            <div className="relative bg-background border border-border/70 p-10 rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
              <Award className="absolute -bottom-4 -right-4 h-40 w-40 text-muted/20 group-hover:text-muted/30 transition-colors" strokeWidth={1} />
              
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 text-primary mb-6 z-10">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-foreground mb-4 z-10">
                Expertise
              </h3>
              <p className="text-muted-foreground leading-relaxed z-10">
                Über die Grundreinigung hinaus sind unsere Spezialisten in der Pflege hochwertiger Materialien geschult, darunter Marmor, seltene Hölzer und maßgeschneiderte architektonische Oberflächen.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Cinematic Space CTA */}
      <section className="py-32 relative flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1920&auto=format&fit=crop"
            alt="Dark architecture"
            fill
            className="object-cover grayscale brightness-50"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/90 to-black/70" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-2xl bg-black/40 backdrop-blur-md border border-white/10 p-10 lg:p-14 rounded-[2rem] shadow-2xl">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              Bereit für atmosphärische Präzision?
            </h2>
            <p className="text-white/80 leading-relaxed font-medium mb-10 text-lg">
              Schließen Sie sich über 1.000 zufriedenen Kunden an, die R&K-GAGGENAU ihre wichtigsten Räume anvertrauen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-primary-container text-white hover:bg-primary-container/90 rounded-md shrink-0">
                Angebot anfordern
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent w-full sm:w-auto h-14 px-8 border-white/30 text-white hover:bg-white hover:text-black rounded-md shrink-0 transition-colors">
                Services ansehen
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
