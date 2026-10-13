import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Impressum",
  description: "Anbieterkennzeichnung und Kontakt von R & K Gewerbereinigung in Gaggenau.",
  alternates: { canonical: "/impressum" },
}

export default function ImpressumPage() {
  return <article className="mx-auto max-w-4xl px-6 pb-24 pt-32 sm:px-10">
    <header className="mb-12">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">RK-Gaggenau · Rechtliche Angaben</p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Impressum</h1>
      <p className="mt-5 text-lg text-muted-foreground">Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)</p>
    </header>

    <div className="space-y-10 leading-7">
      <section>
        <h2 className="mb-4 text-xl font-bold">Diensteanbieterin</h2>
        <address className="not-italic text-muted-foreground">
          Fatlinda Kryeziu<br />
          R &amp; K Gewerbereinigung (RK-Gaggenau)<br />
          Bäumbachallee 1<br />
          76571 Gaggenau<br />
          Deutschland
        </address>
      </section>

      <section className="border-t border-border pt-8">
        <h2 className="mb-4 text-xl font-bold">Kontakt</h2>
        <p className="text-muted-foreground">Telefon: <a className="underline underline-offset-4" href="tel:+4915776790522">+49 1577 6790522</a></p>
        <p className="text-muted-foreground">E-Mail: <a className="underline underline-offset-4" href="mailto:info@rk-gaggenau.de">info@rk-gaggenau.de</a></p>
      </section>

      <section className="border-t border-border pt-8">
        <h2 className="mb-4 text-xl font-bold">Datenschutz</h2>
        <p className="text-muted-foreground">Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer <Link className="underline underline-offset-4" href="/datenschutz">Datenschutzerklärung</Link>.</p>
      </section>
    </div>
  </article>
}
