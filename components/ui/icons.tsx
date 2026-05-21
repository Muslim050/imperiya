import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Open-window line icon — the new logo mark requested in the TZ. */
export function WindowMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden {...props}>
      <rect x="5" y="4" width="22" height="24" rx="1.5" {...stroke} />
      <line x1="16" y1="4" x2="16" y2="28" {...stroke} />
      <line x1="5" y1="16" x2="27" y2="16" {...stroke} />
      <path d="M27 7l4 2.4v13.2L27 25" {...stroke} />
    </svg>
  );
}

export function Phone(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        d="M6.5 3h3l1.5 5-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5a2 2 0 0 1 2-2Z"
        {...stroke}
      />
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M6 9l6 6 6-6" {...stroke} />
    </svg>
  );
}

export function ChevronLeft(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M15 6l-6 6 6 6" {...stroke} />
    </svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M9 6l6 6-6 6" {...stroke} />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M5 13l4 4L19 7" {...stroke} />
    </svg>
  );
}

export function MapPin(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" {...stroke} />
      <circle cx="12" cy="10" r="2.5" {...stroke} />
    </svg>
  );
}

export function ShieldCheck(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z" {...stroke} />
      <path d="M9 12l2 2 4-4" {...stroke} />
    </svg>
  );
}

export function Clock(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path d="M12 7v5l3 2" {...stroke} />
    </svg>
  );
}

export function Factory(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M3 21V9l6 4V9l6 4V5h4v16H3Z" {...stroke} />
      <path d="M7 21v-4M12 21v-4M17 21v-4" {...stroke} />
    </svg>
  );
}

export function Wrench(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        d="M14.5 6a4 4 0 0 0 5 5l-9 9a2.8 2.8 0 0 1-4-4l9-9Z"
        {...stroke}
      />
    </svg>
  );
}

export const SERVICE_ICONS = {
  facade: Factory,
  shutters: WindowMark,
  adjustment: Wrench,
  shower: WindowMark,
  sliding: WindowMark,
  pergola: Factory,
  gates: WindowMark,
  wpc: Factory,
} as const;
