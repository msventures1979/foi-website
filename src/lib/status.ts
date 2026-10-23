/** Anzeigenamen und Farben der Einladungsstatus – im Browser und auf dem Server nutzbar. */
export const STATUS = {
  vorgemerkt: { label: "Vorgemerkt", color: "#888" },
  eingeladen: { label: "Eingeladen", color: "#9ab" },
  zugesagt: { label: "Zugesagt", color: "#6c6" },
  abgesagt: { label: "Abgesagt", color: "#c66" },
  keine_rueckmeldung: { label: "Keine Rückmeldung", color: "#a87" },
  teilgenommen: { label: "Teilgenommen", color: "#e6941a" },
  nicht_erschienen: { label: "Nicht erschienen", color: "#a66" },
} as const;

export type InvitationStatus = keyof typeof STATUS;
export const STATUS_KEYS = Object.keys(STATUS) as InvitationStatus[];

export const CATEGORY: Record<string, string> = {
  "": "–",
  gruender: "Gründer",
  fuehrung: "Führungskraft",
  politik: "Politik",
  wildcard: "Wild Card",
  partner: "Partner",
  presse: "Presse",
  team: "Team",
};

export const INQUIRY_STATUS: Record<string, string> = {
  neu: "Neu",
  in_bearbeitung: "In Bearbeitung",
  erledigt: "Erledigt",
  abgelehnt: "Abgelehnt",
};
