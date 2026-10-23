type Ev = {
  id?: string;
  name?: string;
  edition?: number | null;
  starts_at?: string | null;
  venue?: string;
  address?: string;
  details?: string;
  rsvp_deadline?: string | null;
  capacity?: number | null;
  closed_message?: string;
  status?: string;
};

function berlinParts(iso?: string | null) {
  if (!iso) return { date: "", time: "18:00" };
  const d = new Date(iso);
  const date = d.toLocaleDateString("sv-SE", { timeZone: "Europe/Berlin" });
  const time = d.toLocaleTimeString("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

/** Formularfelder für Anlegen und Bearbeiten eines Events (ohne <form>) */
export function EventFields({ ev = {} }: { ev?: Ev }) {
  const { date, time } = berlinParts(ev.starts_at);
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ev.id ? <input type="hidden" name="id" value={ev.id} /> : null}
      <div className="lg:col-span-2">
        <label className="lbl">Name</label>
        <input name="name" className="field" defaultValue={ev.name ?? "Frontline of Innovation"} required />
      </div>
      <div>
        <label className="lbl">Edition (Nummer)</label>
        <input name="edition" type="number" min={1} className="field" defaultValue={ev.edition ?? ""} />
      </div>
      <div>
        <label className="lbl">Status</label>
        <select name="status" className="field" defaultValue={ev.status ?? "entwurf"}>
          <option value="entwurf">Entwurf</option>
          <option value="aktiv">Aktiv</option>
          <option value="abgeschlossen">Abgeschlossen</option>
        </select>
      </div>
      <div>
        <label className="lbl">Datum</label>
        <input name="date" type="date" className="field" defaultValue={date} />
      </div>
      <div>
        <label className="lbl">Beginn</label>
        <input name="time" type="time" className="field" defaultValue={time} />
      </div>
      <div>
        <label className="lbl">Rückmeldung bis</label>
        <input name="rsvp_deadline" type="date" className="field" defaultValue={ev.rsvp_deadline ?? ""} />
      </div>
      <div>
        <label className="lbl">Plätze</label>
        <input name="capacity" type="number" min={1} className="field" defaultValue={ev.capacity ?? 200} />
      </div>
      <div className="lg:col-span-2">
        <label className="lbl">Ort</label>
        <input name="venue" className="field" defaultValue={ev.venue ?? ""} placeholder="z. B. Alte Schildkrötfabrik" />
      </div>
      <div className="lg:col-span-2">
        <label className="lbl">Adresse</label>
        <input name="address" className="field" defaultValue={ev.address ?? ""} placeholder="Straße, PLZ Ort" />
      </div>
      <div className="sm:col-span-2 lg:col-span-4">
        <label className="lbl">Hinweise für Gäste (erscheinen in der Bestätigungsmail und auf der Einladungsseite)</label>
        <textarea name="details" className="field" rows={3} defaultValue={ev.details ?? ""} placeholder="Ablauf, Anfahrt, Parken, Dresscode" />
      </div>
      <div className="sm:col-span-2 lg:col-span-4">
        <label className="lbl">Text, wenn die Anmeldung geschlossen ist</label>
        <input name="closed_message" className="field" defaultValue={ev.closed_message ?? "Die Anmeldung ist geschlossen."} />
      </div>
    </div>
  );
}
