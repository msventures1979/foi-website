/**
 * Rechtstexte für frontlineofinnovation.de
 * Impressum: unverändert von der bisherigen Seite übernommen (auf Wunsch von Matthias, Stand 23.10.2026).
 * Datenschutz: auf die tatsächliche Datenverarbeitung dieser Seite zugeschnitten (Stand Oktober 2026).
 */
import { CONTACT_MAIL } from "@/lib/site";

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-12 font-display text-2xl font-semibold uppercase tracking-[0.02em] text-white">{children}</h2>;
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 mt-7 text-[17px] font-semibold text-white">{children}</h3>;
}

function Mail() {
  return <a href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a>;
}

export function Impressum() {
  return (
    <>
      <H2>Angaben gemäß § 5 DDG</H2>
      <p>
        not a usual business GmbH
        <br />
        „Frontline of Innovation“
        <br />
        Stresemannstr. 23
        <br />
        10963 Berlin
      </p>

      <H2>Kontakt</H2>
      <p>
        E-Mail: <Mail />
      </p>

      <H2>Haftung für Inhalte und Links</H2>
      <p>
        Wir erstellen die Inhalte dieser Seite mit Sorgfalt, übernehmen für ihre Richtigkeit, Vollständigkeit und Aktualität aber keine Gewähr. Für Inhalte
        verlinkter externer Seiten sind ausschließlich deren Betreiber verantwortlich. Werden uns Rechtsverletzungen bekannt, entfernen wir die betreffenden
        Inhalte oder Links umgehend.
      </p>

      <H2>Bildnachweis</H2>
      <p>Fotos: Frontline of Innovation.</p>
    </>
  );
}

export function Datenschutz() {
  return (
    <>
      <p>
        Mit dieser Erklärung informieren wir Sie, welche personenbezogenen Daten wir beim Besuch dieser Website und bei einer Anfrage über unsere Formulare
        verarbeiten, wozu wir das tun und welche Rechte Sie haben. Diese Seite setzt keine Cookies, verwendet keine Analyse- oder Werbedienste und lädt
        keine Inhalte von Drittanbietern wie Google Fonts, Karten, Videos oder Social-Media-Plugins. Schriften und Bilder liegen auf unserem eigenen Server.
      </p>

      <H2>1. Verantwortlicher</H2>
      <p>
        not a usual business GmbH („Frontline of Innovation“)
        <br />
        Stresemannstr. 23, 10963 Berlin
        <br />
        E-Mail: <Mail />
      </p>

      <H2>2. Welche Daten wir verarbeiten und wozu</H2>

      <H3>Aufruf der Website</H3>
      <p>
        Beim Aufruf der Seite verarbeitet unser Hosting-Anbieter technisch notwendige Daten wie IP-Adresse, Datum und Uhrzeit, aufgerufene Seite und
        Browserkennung, um die Seite auszuliefern und vor Missbrauch zu schützen. Diese Protokolle werden nach kurzer Zeit automatisch gelöscht.
        Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
      </p>

      <H3>Kontakt, Empfehlungen und Wild-Card-Bewerbungen</H3>
      <p>
        Wenn Sie uns über das Kontaktformular schreiben, verarbeiten wir Ihr Anliegen, Vor- und Nachname, E-Mail-Adresse, Ihre Nachricht sowie freiwillig
        Unternehmen, Position und LinkedIn-Profil. Wir nutzen die Angaben, um Ihre Anfrage zu beantworten und – bei Empfehlungen und Bewerbungen – um über
        eine Einladung zu entscheiden. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit mit Wirkung für die Zukunft
        widerrufen können.
      </p>
      <p className="mt-4">
        Wenn Sie uns eine andere Person empfehlen, geben Sie bitte nur Angaben weiter, die diese Person ohnehin beruflich öffentlich macht, etwa Name,
        Unternehmen und Position. Bevor wir eine empfohlene Person einladen, sprechen wir sie direkt an.
      </p>

      <H3>Partner- und Ticketanfragen</H3>
      <p>
        Bei Anfragen zu einer Partnerschaft oder zu Plätzen für Ihre Kunden verarbeiten wir zusätzlich Telefonnummer, gewünschtes Paket bzw. Anzahl der
        Plätze, Rechnungsanschrift und die Namen der Gäste, die Sie mitbringen möchten. Rechtsgrundlage ist die Anbahnung eines Vertrags mit Ihrem
        Unternehmen (Art. 6 Abs. 1 lit. b DSGVO) sowie, für die Angaben zu Ihren Gästen, unser berechtigtes Interesse an der Zusammensetzung des Abends
        (Art. 6 Abs. 1 lit. f DSGVO). Bitte informieren Sie Ihre Gäste, dass Sie uns ihre Namen nennen.
      </p>

      <H3>Schutz vor Missbrauch</H3>
      <p>
        Um automatisierte Einsendungen zu erkennen, enthalten die Formulare ein unsichtbares Feld und prüfen die Zeit zwischen Aufruf und Absenden. Wir
        begrenzen außerdem die Zahl der Anfragen je E-Mail-Adresse. Dafür werden keine zusätzlichen Daten gespeichert.
      </p>

      <H2>3. Wer Ihre Daten erhält</H2>
      <p>Ihre Anfragen lesen nur die Gastgeber Matthias Storch und Süleyman Acar. Wir setzen Dienstleister ein, die Daten in unserem Auftrag verarbeiten:</p>
      <ul className="mt-3 list-disc space-y-2 pl-6">
        <li>
          <b className="text-white">Vercel Inc.</b> (USA) – Hosting der Website, Rechenzentrum in Frankfurt am Main
        </li>
        <li>
          <b className="text-white">Supabase Inc.</b> (USA) – Speicherung der Anfragen, Speicherort Irland (EU)
        </li>
        <li>
          <b className="text-white">Resend</b> (USA) – Zustellung der Benachrichtigung über eine neue Anfrage an unser Postfach
        </li>
        <li>
          <b className="text-white">Google Workspace</b> (Google Ireland Ltd.) – unser E-Mail-Postfach, in dem Ihre Anfrage und unsere Antwort liegen
        </li>
      </ul>
      <p className="mt-4">
        Mit diesen Dienstleistern bestehen Verträge zur Auftragsverarbeitung. Soweit dabei Daten in die USA übermittelt werden können, geschieht dies auf
        Grundlage des EU-US Data Privacy Framework, soweit der Anbieter danach zertifiziert ist, und im Übrigen auf Grundlage der
        EU-Standardvertragsklauseln. Eine Weitergabe zu Werbezwecken findet nicht statt.
      </p>

      <H2>4. Links zu LinkedIn und YouTube</H2>
      <p>
        Auf dieser Seite verlinken wir unsere Profile bei LinkedIn und YouTube. Es handelt sich um einfache Links: Erst wenn Sie darauf klicken, verlassen
        Sie unsere Seite, und es gelten die Datenschutzbestimmungen des jeweiligen Anbieters.
      </p>

      <H2>5. Wie lange wir Daten speichern</H2>
      <ul className="mt-3 list-disc space-y-2 pl-6">
        <li>Kontaktanfragen, Empfehlungen und Bewerbungen löschen wir spätestens zwölf Monate nach Abschluss der Bearbeitung.</li>
        <li>
          Partner- und Ticketanfragen, aus denen kein Vertrag entsteht, löschen wir spätestens zwölf Monate nach der letzten Kommunikation. Kommt ein
          Vertrag zustande, gelten die gesetzlichen Aufbewahrungsfristen.
        </li>
      </ul>

      <H2>6. Ihre Rechte</H2>
      <p>
        Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
        Datenübertragbarkeit (Art. 20) sowie auf Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3). Soweit wir Daten auf
        Grundlage berechtigter Interessen verarbeiten, können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen
        (Art. 21). Eine kurze Nachricht an <Mail /> genügt.
      </p>
      <p className="mt-4">
        Sie können sich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren. Für uns zuständig ist die Berliner Beauftragte für Datenschutz und
        Informationsfreiheit, Alt-Moabit 59–61, 10555 Berlin.
      </p>

      <H2>7. Pflicht zur Bereitstellung</H2>
      <p>
        Die als Pflichtangabe gekennzeichneten Felder brauchen wir, um Ihre Anfrage bearbeiten zu können. Alle übrigen Angaben sind freiwillig. Eine
        automatisierte Entscheidungsfindung findet nicht statt.
      </p>

      <p className="mt-12 text-sm text-dim">Stand: Oktober 2026</p>
    </>
  );
}
