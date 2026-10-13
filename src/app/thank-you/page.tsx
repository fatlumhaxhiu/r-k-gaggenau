import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Vielen Dank – Anfrage erhalten",
  description: "Ihre Anfrage wurde erfolgreich übermittelt. Unser Team meldet sich in Kürze bei Ihnen.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-emerald-50 via-white to-emerald-50 px-6 py-24 text-center">
      {/* Logo */}
      <Link href="/" className="mb-12 inline-flex items-center gap-3">
        <Image
          src="/RK-Logo-02.png"
          alt="R&K-Gaggenau Logo"
          width={200}
          height={50}
          className="h-10 w-auto object-contain"
          priority
        />
      </Link>

      {/* Animated check circle */}
      <div className="relative mb-10">
        <div className="w-28 h-28 rounded-full bg-emerald-100 flex items-center justify-center shadow-lg shadow-emerald-200/60 animate-[ping_1.5s_ease-out_1]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-14 h-14 text-emerald-600 relative z-10"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full bg-emerald-600/10 scale-110 blur-xl -z-10" />
      </div>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
        Vielen Dank für Ihre Anfrage!
      </h1>
      <p className="text-lg text-gray-600 max-w-md leading-relaxed mb-4">
        Wir haben Ihre Nachricht erhalten und melden uns innerhalb von{" "}
        <strong className="text-emerald-700">2 Werktagsstunden</strong> bei Ihnen.
      </p>
      <p className="text-sm text-gray-600 max-w-sm mb-12">
        Wir kontaktieren Sie über die angegebenen Kontaktdaten. Eine automatische Eingangsbestätigung per E-Mail wird nicht versendet.
      </p>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full mb-14">
        {[
          { icon: "⏱️", label: "Schnelle Antwort", sub: "Innerhalb von 2 Werktagsstunden" },
          { icon: "📋", label: "Individuelle Beratung", sub: "Maßgeschneidertes Angebot" },
          { icon: "✅", label: "Kostenlos & Unverbindlich", sub: "Keine versteckten Kosten" },
        ].map(({ icon, label, sub }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 flex flex-col items-center gap-2"
          >
            <span className="text-3xl">{icon}</span>
            <p className="font-bold text-gray-900 text-sm">{label}</p>
            <p className="text-xs text-gray-500">{sub}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5"
      >
        Zurück zur Startseite
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
            clipRule="evenodd"
          />
        </svg>
      </Link>

      <nav aria-label="Rechtliche Informationen" className="mt-4 flex gap-6 text-xs text-gray-600">
        <Link href="/impressum" className="underline underline-offset-4">Impressum</Link>
        <Link href="/datenschutz" className="underline underline-offset-4">Datenschutz</Link>
      </nav>
      <p className="mt-10 text-xs text-gray-400">
        © {new Date().getFullYear()} R&K-Gaggenau – Professionelle Reinigung
      </p>
    </div>
  );
}
