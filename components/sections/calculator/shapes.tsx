/* Shape thumbnails reproduced from the precise design file */
import type { Shape } from "@/data/calculator";

export const SHAPE_SVG: Record<Shape, React.ReactNode> = {
  single: (
    <svg width="58" height="48" viewBox="0 0 58 48" fill="none">
      <rect x="3" y="3" width="52" height="42" stroke="#222" strokeWidth="2" />
      <path d="M29 3v42" stroke="#222" strokeWidth="1.4" strokeDasharray="3 3" />
      <path d="M3 24h52" stroke="#bbb" strokeWidth="1" />
    </svg>
  ),
  double: (
    <svg width="58" height="48" viewBox="0 0 58 48" fill="none">
      <rect x="3" y="3" width="52" height="42" stroke="#222" strokeWidth="2" />
      <path d="M29 3v42" stroke="#222" strokeWidth="2" />
      <path d="M5 5l24 19M53 5L29 24" stroke="#222" strokeWidth="1.2" />
    </svg>
  ),
  triple: (
    <svg width="58" height="48" viewBox="0 0 58 48" fill="none">
      <rect x="3" y="3" width="52" height="42" stroke="#222" strokeWidth="2" />
      <path d="M21 3v42M37 3v42" stroke="#222" strokeWidth="2" />
      <path d="M5 5l16 19M53 5L37 24" stroke="#222" strokeWidth="1.2" />
    </svg>
  ),
  panoramic: (
    <svg width="68" height="48" viewBox="0 0 68 48" fill="none">
      <rect x="3" y="3" width="62" height="42" stroke="#222" strokeWidth="2" />
      <path d="M19 3v42M34 3v42M49 3v42" stroke="#222" strokeWidth="1.4" />
    </svg>
  ),
  balcony: (
    <svg width="58" height="48" viewBox="0 0 58 48" fill="none">
      <rect x="3" y="3" width="22" height="42" stroke="#222" strokeWidth="2" />
      <rect x="25" y="3" width="30" height="42" stroke="#222" strokeWidth="2" />
      <path d="M14 5l11 18M5 5l9 18" stroke="#222" strokeWidth="1.2" />
    </svg>
  ),
};

export const TYPE_SVG: Record<string, React.ReactNode> = {
  window: (
    <svg className="size-[18px]" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3v18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  door: (
    <svg className="size-[18px]" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="2" width="14" height="20" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  stained: (
    <svg className="size-[18px]" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 4v16M16 4v16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  balcony: (
    <svg className="size-[18px]" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  facade: (
    <svg className="size-[18px]" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="20" height="18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3v18M16 3v18M2 12h20" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
};
