import Link from "next/link";
import { Sparkles, MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30 pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/RK-Logo-02.png"
                alt="R&K-Gaggenau Logo"
                width={200}
                height={50}
                className="h-10 w-auto object-contain"
                priority
              />
              <span className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
                R&K-GAGGENAU
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Atmospheric Precision. We don't just clean spaces—we elevate them. Premium facility management and commercial cleaning solutions.
            </p>
          </div>

          {/* Links Col 1 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-semibold text-foreground tracking-tight">Leistungen</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/leistungen/privatreinigung" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privatreinigung</Link>
              <Link href="/leistungen/gewerbereinigung" className="text-sm text-muted-foreground hover:text-primary transition-colors">Gewerbereinigung</Link>
              <Link href="/leistungen/baureinigung" className="text-sm text-muted-foreground hover:text-primary transition-colors">Baureinigung</Link>
              <Link href="/leistungen/spezialreinigung" className="text-sm text-muted-foreground hover:text-primary transition-colors">Spezialreinigung</Link>
              <Link href="/leistungen/grundreinigung" className="text-sm text-muted-foreground hover:text-primary transition-colors">Grundreinigung</Link>
            </nav>
          </div>

          {/* Links Col 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-semibold text-foreground tracking-tight">Unternehmen</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/uber-uns" className="text-sm text-muted-foreground hover:text-primary transition-colors">Über uns</Link>
              <Link href="/magazin" className="text-sm text-muted-foreground hover:text-primary transition-colors">Magazin</Link>
              <Link href="/karriere" className="text-sm text-muted-foreground hover:text-primary transition-colors">Karriere</Link>
              <Link href="/kontakt" className="text-sm text-muted-foreground hover:text-primary transition-colors">Kontakt</Link>
            </nav>
          </div>

          {/* Contact Col */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-semibold text-foreground tracking-tight">Kontakt</h4>
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <a href="https://maps.google.com/?q=Bäumbachallee+1,+76571+Gaggenau,+Germany" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Bäumbachallee 1<br/>76571 Gaggenau, Germany
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+4915776790522" className="hover:text-primary transition-colors">+49 1577 6790522</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:info@rk-gaggenau.de" className="hover:text-primary transition-colors">info@rk-gaggenau.de</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} R&K-Gaggenau. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/impressum" className="text-xs text-muted-foreground hover:text-primary transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="text-xs text-muted-foreground hover:text-primary transition-colors">Datenschutz</Link>
            <Link href="/agb" className="text-xs text-muted-foreground hover:text-primary transition-colors">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
