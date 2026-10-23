/** Partner der letzten Edition (Mai 2026), wie auf der bisherigen Seite. */
export type Partner = { name: string; logo: string; url: string; w: number; h: number };

export const partnerTiers: { tier: string; partners: Partner[] }[] = [
  {
    tier: "Hauptpartner",
    partners: [
      { name: "Lamborghini Stuttgart", logo: "/images/partner/lamborghini-stuttgart.png", url: "https://www.lamborghini-stuttgart.com/", w: 354, h: 144 },
      { name: "KOS Klima", logo: "/images/partner/kos-klima.png", url: "https://kosklima.de/", w: 801, h: 136 },
    ],
  },
  {
    tier: "Partner",
    partners: [
      { name: "Unzer", logo: "/images/partner/unzer.png", url: "https://www.unzer.com/de/", w: 600, h: 136 },
      { name: "NEXT Mannheim", logo: "/images/partner/next-mannheim.png", url: "https://next-mannheim.de/", w: 176, h: 38 },
      { name: "COVADO", logo: "/images/partner/covado.png", url: "https://covado.de/", w: 493, h: 87 },
      { name: "ox8 Corporate Finance", logo: "/images/partner/ox8.png", url: "https://ox8-cf.com/de/startseite/", w: 900, h: 569 },
      { name: "GIGA.GREEN", logo: "/images/partner/giga-green.png", url: "https://www.giga.green/", w: 900, h: 342 },
    ],
  },
  {
    tier: "Dinner-Partner",
    partners: [
      { name: "billiger.de", logo: "/images/partner/billiger-de.png", url: "https://www.billiger.de/", w: 121, h: 40 },
      { name: "Rohde Baier", logo: "/images/partner/rohde-baier.png", url: "https://rohdebaier.de/", w: 900, h: 96 },
      { name: "KOROS", logo: "/images/partner/koros.svg", url: "https://www.koros-mannheim.de/", w: 182, h: 56 },
      { name: "clickfire", logo: "/images/partner/clickfire.png", url: "https://clickfire.io/de", w: 355, h: 63 },
    ],
  },
  {
    tier: "Weinpartner",
    partners: [{ name: "Weingut von Winning", logo: "/images/partner/von-winning.png", url: "https://www.von-winning.de/", w: 499, h: 433 }],
  },
];
