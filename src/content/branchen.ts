/**
 * Branchenmix der Einladungsliste – ausgewertet am 23.10.2026 aus Google Sheet „Einladungen“ und der
 * Website-Gästeliste (625 eindeutige Personen, davon 545 einer Branche zuordenbar). Details: Dropbox FOI/FOI_Branchenanalyse.xlsx
 * Anteile gerundet, Summe 100.
 */
export const INVITE_LIST_SIZE = "1.000";

export const branchen: { label: string; share: number }[] = [
  { label: "Finanzen & Investoren", share: 18 },
  { label: "Tech, Software & Start-ups", share: 15 },
  { label: "Immobilien & Bau", share: 13 },
  { label: "Marketing & Medien", share: 11 },
  { label: "Handel & Konsumgüter", share: 11 },
  { label: "Beratung, Recht & Steuern", share: 8 },
  { label: "Industrie & Energie", share: 5 },
  { label: "Weitere: Sport, Politik, Gesundheit, Mobilität u. a.", share: 19 },
];
