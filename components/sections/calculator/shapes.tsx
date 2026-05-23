/* Construction-type icons (window/door/etc.) used in the left column. */
export const TYPE_SVG: Record<string, React.ReactNode> = {
  window: (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3v18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  door: (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="5" y="2" width="14" height="20" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  stained: (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 4v16M16 4v16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  balcony: (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  facade: (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="20" height="18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3v18M16 3v18M2 12h20" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
};

/* Tiny pictogram for the frame picker chips. */
export const FRAME_PICTO: Record<string, React.ReactNode> = {
  single: (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
      <rect x="2" y="2" width="24" height="18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  double: (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
      <rect x="2" y="2" width="24" height="18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 2v18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  triple: (
    <svg width="32" height="22" viewBox="0 0 32 22" fill="none">
      <rect x="2" y="2" width="28" height="18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 2v18M21 2v18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
};
