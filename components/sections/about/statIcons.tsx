/**
 * Isometric pictograms for the "Imperiya в цифрах" stat cards. They sit in
 * the top-right corner of each card at low contrast — visible enough to
 * pair with the metric, quiet enough not to fight the number.
 */
export const STAT_ICON: Record<string, React.ReactNode> = {
  // м² площадь производства — schematic factory roof + walls
  area: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      <path d="M6 30 32 14l26 16v22H6V30Z" stroke="currentColor" strokeWidth="2" />
      <path d="M6 30h52" stroke="currentColor" strokeWidth="2" />
      <path d="M14 52V36h12v16M38 52V36h12v16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  // довольных клиентов — pair of people
  clients: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="24" cy="20" r="7" stroke="currentColor" strokeWidth="2" />
      <circle cx="44" cy="22" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M10 50c2-9 8-13 14-13s12 4 14 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 46c1.5-6 6-9 10-9s8 3 8 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  // роботизированных линий — schematic CNC arm
  lines: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="8" y="46" width="48" height="10" stroke="currentColor" strokeWidth="2" />
      <path d="M20 46V28l12-12 14 14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="20" cy="28" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
      <rect x="42" y="26" width="10" height="6" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  // конструкций в год — sash + frame
  constructions: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="10" y="10" width="44" height="44" stroke="currentColor" strokeWidth="2" />
      <path d="M32 10v44M10 32h44" stroke="currentColor" strokeWidth="2" />
      <path d="M14 14h14v14" stroke="currentColor" strokeWidth="1.4" opacity=".6" />
    </svg>
  ),
  // лет на рынке — laurel/badge
  years: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="26" r="14" stroke="currentColor" strokeWidth="2" />
      <path d="M32 18v8l5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 38l-4 14 14-6 14 6-4-14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
};
