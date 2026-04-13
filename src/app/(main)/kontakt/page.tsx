import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopySlash as MapPin, PhoneCall, Mail, Clock, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function Kontakt() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-[380px] lg:h-[550px] w-full flex items-center justify-center">
        <Image 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920&auto=format&fit=crop"
          alt="Modern corporate building interior"
          fill
          className="object-cover"
          priority
        />
        {/* Deep gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/60 to-background/90" />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl">
            <h5 className="text-xs font-bold tracking-widest text-primary uppercase mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-primary"></span>
              PRÄZISIONSVERBINDUNG
            </h5>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[6rem] font-black tracking-tight text-foreground leading-none">
              Atmosphärische <br/><span className="text-primary">Klarheit.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Overlapping Contact Details Box */}
      <section className="relative -mt-24 lg:-mt-32 z-20 pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1100px]">
          <div className="bg-background rounded-2xl shadow-2xl overflow-hidden border border-border/50 flex flex-col lg:flex-row">
            
            {/* Form Column */}
            <div className="flex-1 p-10 lg:p-14">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-10">
                Beginnen Sie die Transformation
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Vollständiger Name</label>
                    <Input placeholder="Max Mustermann" className="h-14 bg-background border border-input focus-visible:ring-primary/20 hover:border-primary/50 transition-colors rounded-md shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">E-Mail-Adresse</label>
                    <Input placeholder="max@beispiel.de" type="email" className="h-14 bg-background border border-input focus-visible:ring-primary/20 hover:border-primary/50 transition-colors rounded-md shadow-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Telefonnummer</label>
                  <Input placeholder="+49 (0) 000 0000000" className="h-14 bg-background border border-input focus-visible:ring-primary/20 hover:border-primary/50 transition-colors rounded-md shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Nachricht</label>
                  <textarea 
                    placeholder="Erzählen Sie uns von Ihren Räumlichkeiten..." 
                    className="flex min-h-[140px] w-full bg-background border border-input px-4 py-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/50 hover:border-primary/50 transition-colors rounded-md shadow-sm resize-none"
                  />
                </div>
                <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base rounded-sm mt-4">
                  Nachricht senden
                </Button>
              </form>
            </div>

            {/* Information Column (Grayscale Map + Details) */}
            <div className="w-full lg:w-[400px] bg-muted/30 flex flex-col">
              <div className="p-10 lg:p-14 flex-1">
                <h3 className="text-xl font-heading font-bold text-foreground mb-8">Direkte Kanäle</h3>
                
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-1">Unser Studio</p>
                      <p className="text-sm text-foreground font-medium">742 Precision Ave.<br/>Gaggenau Corporate Park,<br/>Ste. 104</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <PhoneCall className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-1">Kundenbeziehungen</p>
                      <p className="text-sm text-foreground font-medium">+1 (800) GAGGENAU</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-1">Anfragen</p>
                      <p className="text-sm text-foreground font-medium">precision@rk-gaggenau.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Image container */}
              <div className="h-[250px] relative mt-auto border-t border-border/40 saturate-0 opacity-80 hover:saturate-100 hover:opacity-100 transition-all duration-700">
                <Image
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop"
                  alt="City map layout"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Standards Split Section */}
      <section className="py-24 bg-background pb-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative">
              <div className="relative h-[400px] lg:h-[650px] w-full max-w-md rounded-[1.5rem] overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop"
                  alt="Cleaning professional focused on work"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-6 right-6 bg-primary rounded-xl p-5 shadow-2xl hidden md:flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start lg:pl-10">
              <h2 className="font-heading text-4xl lg:text-5xl font-black tracking-tight text-foreground mb-8">
                Kompromisslose<br/>Standards.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                Unsere Kommunikation ist so präzise wie unsere Reinigungsmethodik. Jede Anfrage wird von einem leitenden Projektleiter bearbeitet, um sicherzustellen, dass Ihre atmosphärischen Anforderungen mit klinischer Genauigkeit erfüllt werden.
              </p>
              
              <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-lg w-full max-w-sm">
                <Clock className="text-primary h-5 w-5 shrink-0" />
                <span className="text-sm font-bold text-foreground">Antwort innerhalb von 2 Werktagsstunden</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
