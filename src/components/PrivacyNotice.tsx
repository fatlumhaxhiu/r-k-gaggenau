import Link from "next/link"

export default function PrivacyNotice() {
  return <p className="text-sm leading-relaxed text-muted-foreground md:col-span-2">
    Wir verwenden Ihre Angaben zur Bearbeitung Ihrer Reinigungsanfrage und zur Kontaktaufnahme.
    Weitere Informationen finden Sie in unserer <Link href="/datenschutz" className="underline underline-offset-4">Datenschutzerklärung</Link>.
    Ihre Anfrage ist auch ohne Einwilligung in Statistik oder Marketing möglich.
  </p>
}
