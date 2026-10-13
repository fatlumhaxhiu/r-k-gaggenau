import type { Metadata } from "next"
import type { ReactNode } from "react"
import PrivacySettingsButton from "@/components/PrivacySettingsButton"


export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutz bei RK-Gaggenau: Kontaktanfragen, Cookies, Besuchsmessung und Ihre Rechte.",
  alternates: { canonical: "/datenschutz" },

}

const contents = [
  ["verantwortlicher", "Verantwortlicher und Kontakt"],
  ["betrieb", "Bereitstellung der Website"],
  ["anfragen", "Kontaktanfragen und Kundenverwaltung"],
  ["einwilligung", "Cookies und Ihre Auswahl"],
  ["analytics", "Google Analytics"],
  ["marketing", "Herkunft von Anfragen und Werbung"],
  ["inhalte", "Schriften, Bilder und externe Links"],
  ["empfaenger", "Empfänger und internationale Übermittlungen"],
  ["speicherdauer", "Speicherdauer"],
  ["rechte", "Ihre Rechte"],
] as const

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} className="scroll-mt-28 border-t border-border pt-8">
    <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h2>
    <div className="space-y-4 leading-7 text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_strong]:text-foreground">{children}</div>
  </section>
}

export default function DatenschutzPage() {
  return <article className="mx-auto max-w-5xl px-6 pb-24 pt-32 sm:px-10">
    <header className="mb-10 max-w-3xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">RK-Gaggenau · Datenschutz</p>
      <h1 className="break-words text-3xl font-bold tracking-tight sm:text-5xl">Datenschutzerklärung</h1>
      <p className="mt-5 text-lg leading-8 text-muted-foreground">Hier erfahren Sie, wie wir mit Ihren Daten umgehen, wenn Sie unsere Website besuchen oder eine Reinigung anfragen.</p>
      <p className="mt-3 text-sm text-muted-foreground">Bearbeitungsstand: 2. Oktober 2026</p>
    </header>
    <div className="mb-10 rounded-xl border border-border bg-muted/30 p-6">
      <h2 className="text-lg font-semibold">Ihre Entscheidung</h2>
      <p className="mb-5 mt-2 leading-7 text-muted-foreground">Sie können eine Anfrage senden, ohne Statistik oder Marketing zu erlauben. Ihre Cookie-Auswahl können Sie jederzeit ändern oder Ihre Einwilligung mit Wirkung für die Zukunft widerrufen.</p>
      <PrivacySettingsButton />
    </div>
    <nav aria-label="Inhaltsverzeichnis Datenschutz" className="mb-12">
      <h2 className="mb-4 text-lg font-semibold">Inhalt</h2>
      <ol className="grid gap-3 sm:grid-cols-2">
        {contents.map(([id, title], i) => <li key={id}><a className="text-sm underline underline-offset-4 hover:text-primary" href={`#${id}`}>{i + 1}. {title}</a></li>)}
      </ol>
    </nav>
    <div className="space-y-10">
      <Section id="verantwortlicher" title="1. Verantwortlicher und Kontakt">
        <p>Verantwortlich für diese Website und die hier beschriebene Datenverarbeitung:</p>
        <address className="not-italic">Fatlinda Kryeziu<br />R &amp; K Gewerbereinigung (RK-Gaggenau)<br />Bäumbachallee 1<br />76571 Gaggenau, Deutschland<br />
          E-Mail: <a href="mailto:info@rk-gaggenau.de">info@rk-gaggenau.de</a><br />
          Telefon: <a href="tel:+4915776790522">+49 1577 6790522</a>
        </address>
        <p>Eine Datenschutzbeauftragte oder ein Datenschutzbeauftragter ist nicht benannt. Für Datenschutzanfragen können Sie die oben genannte E-Mail-Adresse verwenden.</p>
      </Section>
      <Section id="betrieb" title="2. Bereitstellung der Website">
        <p>Wir nutzen Hostinger International Ltd., 61 Lordou Vironos Street, Larnaca 6023, Zypern, für das Hosting unserer Website und der Datenbank unseres internen Kundenverwaltungssystems. Dort werden auch die über die Formulare übermittelten Anfragen gespeichert. Im Rahmen der technischen Bereitstellung verarbeitet der Hostinganbieter die hierfür erforderlichen Verbindungsdaten. Weitere Informationen finden Sie in den <a href="https://www.hostinger.com/legal/privacy-policy">Datenschutzhinweisen von Hostinger</a> und im <a href="https://www.hostinger.com/legal/dpa">Data Processing Addendum von Hostinger</a>.</p>
        <p>Die DNS-Einträge für <code>rk-gaggenau.de</code> und <code>www.rk-gaggenau.de</code> sind über Cloudflare, Inc. (USA), als Proxy geschaltet. Cloudflare verarbeitet bei der Weiterleitung und Absicherung der Website-Anfragen insbesondere die IP-Adresse, angeforderte Adresse, Zeitpunkte und technische Verbindungsinformationen; je nach Anfrage können auch übertragene Inhalte durch das Netzwerk geleitet werden. Dies dient der Erreichbarkeit, Beschleunigung und Sicherheit der Website. Weitere Informationen enthalten die <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare-Datenschutzhinweise</a> und das <a href="https://www.cloudflare.com/cloudflare-customer-dpa/">Data Processing Addendum</a>.</p>
        <p>Beim Aufruf unserer Website werden Verbindungsdaten verarbeitet, insbesondere Ihre IP-Adresse, angeforderte Seiten, Zeitpunkt, Browser- und Geräteinformationen sowie gegebenenfalls die zuvor besuchte Seite. Dies dient der Auslieferung der Website, der Fehlerbehebung und der Abwehr von Missbrauch.</p>
        <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in einer sicheren und zuverlässig erreichbaren Website. Technisch unbedingt erforderliche Speicherzugriffe richten sich nach § 25 Abs. 2 TDDDG.</p>
        <p>Website und Datenbank laufen auf einem Hostinger-VPS in Frankfurt, Deutschland. Für den VPS sind wöchentliche automatische Sicherheitskopien eingerichtet, die laut Hostinger-Panel getrennt vom Server in Litauen gespeichert und durch neuere Kopien ersetzt werden. Bei Bedarf erstellen wir zusätzliche Sicherheitskopien für die Wiederherstellung.</p>
      </Section>
      <Section id="anfragen" title="3. Kontaktanfragen und Kundenverwaltung">
        <p>Wenn Sie uns über ein Formular, per E-Mail oder telefonisch kontaktieren, verarbeiten wir Ihre Angaben, um Ihren Reinigungsbedarf zu klären, Rückfragen zu beantworten und eine Beratung oder ein Angebot vorzubereiten.</p>
        <p>Anfragen aus den Website-Formularen werden in unserem internen CRM gespeichert und nicht automatisch an Gmail weitergeleitet. E-Mails, die Sie direkt an uns senden, bearbeiten wir dagegen in unserem Google-Workspace-Postfach.</p>
        <p>Für direkte E-Mail-Kommunikation verwenden wir Gmail im Rahmen von Google Workspace Business Standard. Anbieter ist Google Cloud EMEA Limited, Velasco, Clanwilliam Place, Dublin 2, Irland. Dabei werden insbesondere Absender- und Empfängeradressen, Nachrichteninhalte, gegebenenfalls Anhänge sowie technische Zustellinformationen verarbeitet. Informationen zur Auftragsverarbeitung finden Sie im <a href="https://cloud.google.com/terms/data-processing-addendum/">Cloud Data Processing Addendum</a>; ergänzende Informationen enthält die <a href="https://policies.google.com/privacy?hl=de">Google-Datenschutzerklärung</a>. Die Bearbeitung Ihrer E-Mail ist unabhängig von Ihrer Cookie-Auswahl.</p>
        <p>Die Formulare erfassen Name, E-Mail-Adresse, Telefonnummer, Stadt, Objektart und gewünschte Reinigungsleistung sowie gegebenenfalls Ihre Nachricht. Im internen Kundenverwaltungssystem speichern wir außerdem die Ausgangsseite, den Eingangszeitpunkt, Bearbeitungsstatus und technische Kennungen zur Vermeidung doppelter Anfragen. Mit Marketing-Einwilligung können Kanal und Kampagnenname hinzukommen.</p>
        <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO für vorvertragliche Maßnahmen oder die Vertragsabwicklung. Bei allgemeinen Anfragen oder Anfragen von Ansprechpartnern eines Unternehmens ist Art. 6 Abs. 1 lit. f DSGVO maßgeblich; unser Interesse ist die sachgerechte Bearbeitung der geschäftlichen Kommunikation.</p>
        <p>Die im Formular erforderlichen Angaben werden für die Bearbeitung benötigt. Ohne diese Angaben kann es nicht abgesendet werden; alternativ können Sie uns per E-Mail oder telefonisch erreichen. Die Anfrage verpflichtet Sie nicht zum Vertragsabschluss. Bitte senden Sie keine sensiblen Angaben, die für Ihre Reinigungsanfrage nicht erforderlich sind.</p>
        <p>Unsere eigene Ereignismessung sendet Name, E-Mail-Adresse, Telefonnummer und Nachrichtentext nicht als Ereignisparameter an Google Analytics, Google Ads oder Meta. Die Anfrage wird unabhängig von einer Statistik- oder Marketing-Einwilligung bearbeitet.</p>
      </Section>
      <Section id="einwilligung" title="4. Cookies und Ihre Auswahl">
        <p>Statistik und Marketing sind zunächst ausgeschaltet. Erst nach Ihrer entsprechenden Auswahl werden die dafür vorgesehenen Speicherzugriffe und Messungen freigegeben. Rechtsgrundlagen für die optionalen Funktionen sind Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG.</p>
        <p>Ihre Auswahl wird im Browser unter <code>rk_consent_v1</code> gespeichert und höchstens 180 Tage als gültig berücksichtigt. Danach fragen wir erneut. Der Eintrag kann bis zum Überschreiben oder Löschen Ihrer Browserdaten bestehen bleiben. Diese Speicherung dient der Umsetzung Ihrer Auswahl (§ 25 Abs. 2 TDDDG; Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit den Einwilligungsanforderungen).</p>
        <p>Sie können über „Cookie-Einstellungen“ oder die Schaltfläche oben widerrufen. Bereits rechtmäßig erfolgte Verarbeitungen bleiben davon unberührt. Das Löschen der Browserdaten entfernt auch Ihre gespeicherte Auswahl.</p>
      </Section>
      <Section id="analytics" title="5. Google Analytics">
        <p>Mit Ihrer Einwilligung in „Statistik“ nutzen wir Google Analytics 4 zur Auswertung der Website-Nutzung. Anbieter ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Gemessen werden Seitenaufrufe und erfolgreich gespeicherte Kontaktanfragen. Eine gespeicherte Anfrage wird durch eine pseudonyme Ereigniskennung erfasst; dies ist keine anonyme Verarbeitung.</p>
        <p>Analytics ist mit unserem Google-Ads-Konto verknüpft. Das Ereignis für eine erfolgreich gespeicherte Anfrage kann dort zur Messung der Wirksamkeit unserer Anzeigen verwendet werden. Mit Ihrer Einwilligung in „Statistik“ wird das Ereignis in Analytics erfasst. Ohne „Marketing“ bleiben die Werbe-Einwilligungssignale verweigert und die Zuordnung zu Anzeigenklicks ist eingeschränkt. Die separate Marketing-Auswahl steuert zusätzliche Klickkennungen und, sofern eingesetzt, die direkte Google-Ads-Messung und das Meta Pixel.</p>
        <p>Verarbeitet werden insbesondere Seiten- und Kampagneninformationen, Nutzungszeitpunkte, Browser- und Geräteinformationen sowie Cookie-Kennungen. Bei der Verbindung zu Google wird technisch auch die IP-Adresse übermittelt. Unsere Messung übermittelt keine Namen, Telefonnummern, E-Mail-Adressen oder Nachrichtentexte als Ereignisparameter. Google Signals und Signale zur Anzeigenpersonalisierung sind für diese Messung deaktiviert.</p>
        <p>Analytics kann die Cookies <code>_ga</code> und <code>_ga_…</code> verwenden. Google nennt hierfür standardmäßig zwei Jahre; Laufzeiten können durch Einstellungen verändert oder bei erneuter Nutzung verlängert werden. Die unter <code>rk_measured_…</code> im Sitzungsspeicher abgelegte Kennung verhindert die wiederholte Messung derselben Anfrage und endet grundsätzlich mit der Browsersitzung.</p>
        <p>In unserer Analytics-Property ist die Aufbewahrung von Ereignisdaten auf zwei Monate und von Nutzerdaten auf 14 Monate eingestellt. Bei neuer Nutzeraktivität wird die Aufbewahrungsfrist für Nutzerdaten zurückgesetzt. Diese Einstellungen betreffen nicht alle aggregierten Berichte und sind von Cookie-Laufzeiten zu unterscheiden. Die optionalen Datenfreigaben an Google für Produkte und Dienste, Modellierungsbeiträge, technischen Support und geschäftliche Empfehlungen sind in unserem Analytics-Konto ausgeschaltet. Google Signals, die Erfassung nutzerbereitgestellter Daten und die automatische erweiterte Ereignismessung sind nicht aktiviert. Die zusätzlichen automatischen Erkennungen für Scrollen, ausgehende Klicks, Formularinteraktionen, Videos und Downloads sind im Google-Tag ausgeschaltet; dort ist keine abweichende Cookie-Laufzeit eingestellt.</p>
        <p>Rechtsgrundlagen sind Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Weitere Informationen: <a href="https://policies.google.com/privacy?hl=de">Google-Datenschutzerklärung</a> und <a href="https://support.google.com/analytics/answer/11397207?hl=de">Analytics-Cookies</a>.</p>
      </Section>
      <Section id="marketing" title="6. Herkunft von Anfragen und Werbung">
        <p>Wenn Sie „Marketing“ erlauben, können wir anhand von Kampagnenparametern im Link und der Herkunftsseite erkennen, über welchen Kanal Sie uns gefunden haben. Kanal und Kampagnenname werden unter <code>rk_marketing_attribution</code> im Sitzungsspeicher gespeichert und beim Absenden Ihrer Anfrage dem internen CRM-Eintrag zugeordnet. Der Sitzungsspeicher endet grundsätzlich mit der Browsersitzung; die CRM-Kopie unterliegt der Aufbewahrung für Anfragen.</p>
        <p>Dies hilft uns, die Herkunft und Qualität von Anfragen zu bewerten. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Ein Widerruf stoppt die zukünftige Erfassung; eine bereits im CRM gespeicherte Zuordnung wird dadurch nicht automatisch entfernt. Dazu können Sie sich an uns wenden.</p>
        <p><strong>Google Ads:</strong> Unsere Analytics-Property ist mit dem Google-Ads-Konto verknüpft. Das Ereignis <code>generate_lead</code> kann zur Messung von Anfragen nach Anzeigenklicks genutzt werden. Bei aktiviertem Auto-Tagging kann Google dafür eine Klickkennung an die Zieladresse anhängen. Die Einstellung „Personalisierte Werbung“ ist für diese Verknüpfung ausgeschaltet. Eine zusätzliche direkte Conversion-Messung über das Google-Ads-Tag wird nur eingesetzt, wenn Sie „Marketing“ erlauben und wir diese Funktion aktivieren.</p>
        <p><strong>Facebook und Instagram / Meta Pixel:</strong> Wenn das Meta Pixel auf unserer Website aktiviert ist und Sie „Marketing“ erlauben, werden Seitenaufrufe und erfolgreich gespeicherte Anfragen als Ereignisse an Meta übermittelt. Dabei können insbesondere IP-Adresse, Browser- und Geräteinformationen, Seiten- und Herkunftsadresse, Kampagnenparameter sowie Cookie- und pseudonyme Ereigniskennungen verarbeitet werden. Unsere Ereignisparameter enthalten keine Formularinhalte wie Namen, E-Mail-Adressen, Telefonnummern oder Nachrichtentexte. Die automatische erweiterte Zuordnung ist ausgeschaltet; eine serverseitige Conversions API ist nicht eingerichtet.</p>
        <p>Meta kann hierfür insbesondere die Erstanbieter-Cookies <code>_fbp</code> und <code>_fbc</code> verwenden. Die lokale Sitzungskennung <code>rk_meta_measured_…</code> dient der Vermeidung doppelter Anfragemessungen. Die Marketing-Einwilligung kann über die Cookie-Einstellungen widerrufen werden. Weitere Angaben enthalten die <a href="https://www.facebook.com/privacy/policy/">Meta-Datenschutzerklärung</a> und die <a href="https://www.facebook.com/legal/technology_terms">Meta Business Tools Terms</a>.</p>
        <p>Nach den Meta Business Tools Terms kann Meta Ereignisdaten für höchstens zwei Jahre speichern; aus den Bedingungen ergibt sich kein genauer Löschzeitpunkt für jedes einzelne Ereignis. Für Messung und Analyse beschreiben die Bedingungen Meta Platforms Ireland Limited als Auftragsverarbeiter; für bestimmte gemeinsame Zwecke der Erhebung und Übermittlung von Website-Ereignissen sehen sie eine gemeinsame Verantwortlichkeit und danach eine eigenständige Verarbeitung durch Meta vor.</p>
      </Section>
      <Section id="inhalte" title="7. Schriften, Bilder und externe Links">
        <p>Die im Seitenlayout verwendeten Schriften und die fest eingebundenen Bilder werden über unsere eigene Website bereitgestellt. Ihr Browser muss diese Dateien daher nicht von Google Fonts, Unsplash oder Google-Bildservern abrufen. Die dafür erforderlichen Verbindungsdaten verarbeitet unser Hostinganbieter wie in Abschnitt 2 beschrieben.</p>
        <p>Links zu Google Maps oder anderen externen Seiten öffnen den jeweiligen Dienst erst beim Anklicken. Dort gelten dessen Datenschutzinformationen. Eine interaktive Google-Maps-Karte ist auf unserer Kontaktseite nicht eingebettet.</p>
      </Section>
      <Section id="empfaenger" title="8. Empfänger und internationale Übermittlungen">
        <p>Anfragen werden im internen CRM zur Bearbeitung bereitgestellt. Hostinger stellt Website und Datenbank bereit; Cloudflare leitet Anfragen an den Server weiter; für E-Mail-Kommunikation wird Gmail über Google Workspace mit Google Cloud EMEA Limited genutzt. Diese Dienstleister verarbeiten Daten im Rahmen der jeweils genutzten Leistungen. Bei aktivierter Statistik erhält Google zusätzlich die in Abschnitt 5 beschriebenen Daten. Über die Verknüpfung mit Google Ads können auch zugeordnete Conversion-Daten bereitgestellt werden. Wenn das Meta Pixel mit Marketing-Einwilligung aktiviert wird, erhält Meta die in Abschnitt 6 beschriebenen Ereignisdaten.</p>
        <p>Bei Cloudflare sowie bei Google- und Meta-Diensten kann eine Verarbeitung außerhalb der EU bzw. des EWR, insbesondere in den USA, stattfinden. Google erläutert seine Übermittlungsmechanismen unter <a href="https://policies.google.com/privacy/frameworks?hl=de">Rahmenbedingungen für Datenübermittlungen</a>.</p>
      </Section>
      <Section id="speicherdauer" title="9. Speicherdauer">
        <p>Für gewöhnliche Reinigungsanfragen im CRM, die ohne Auftrag abgeschlossen werden, gilt ein Aufbewahrungsrahmen von höchstens sechs Monaten nach dokumentiertem Abschluss, soweit eine weitere Speicherung noch erforderlich ist, beispielsweise zur Klärung der Anfrage oder des Angebots. Die Fälle werden manuell geprüft; es erfolgt keine automatische Löschung. Gesetzliche Aufbewahrungspflichten und die erforderliche Sicherung konkreter Rechtsansprüche werden gesondert berücksichtigt.</p>
        <p>Direkte E-Mails unterliegen nicht automatisch der CRM-Frist. Ihre Aufbewahrung richtet sich nach dem Zweck der Korrespondenz, dem Stand einer Anfrage oder eines Auftrags sowie gegebenenfalls gesetzlichen Aufbewahrungspflichten und konkreten Rechtsansprüchen. Auch für andere Daten gilt: Sie werden nur so lange aufbewahrt, wie der jeweilige Zweck oder eine rechtliche Pflicht dies erfordert.</p>
      </Section>
      <Section id="rechte" title="10. Ihre Rechte">
        <p>Im Rahmen der gesetzlichen Voraussetzungen haben Sie das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit. Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.</p>
        <p><strong>Widerspruch:</strong> Gegen eine Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO können Sie aus Gründen Ihrer besonderen Situation Widerspruch einlegen. Gegen eine Verarbeitung für Direktwerbung können Sie jederzeit Widerspruch einlegen.</p>
        <p>Wenden Sie sich hierzu an <a href="mailto:info@rk-gaggenau.de">info@rk-gaggenau.de</a>. Sie haben außerdem das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren, insbesondere an Ihrem Aufenthaltsort, Arbeitsplatz oder am Ort des vermuteten Verstoßes. Für Baden-Württemberg erreichen Sie den Landesbeauftragten für den Datenschutz und die Informationsfreiheit über dessen <a href="https://www.baden-wuerttemberg.datenschutz.de/beschwerde/">Beschwerdeseite</a>.</p>
        <p>Die Website trifft keine ausschließlich automatisierten Entscheidungen mit rechtlicher oder vergleichbar erheblicher Wirkung über Ihre Anfrage.</p>
      </Section>
    </div>
    <p className="mt-12 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">Wenn sich unsere Datenverarbeitung oder die eingesetzten Dienste ändern, passen wir diese Erklärung an. Neue einwilligungspflichtige Zwecke werden erst nach entsprechender Information und Einwilligung eingesetzt.</p>
  </article>
}
