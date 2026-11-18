import type { ReactNode } from "react";

const RED = "var(--red)";
const BLUE = "var(--accent)";

/** Hand-drawn line illustrations, one per service type. 48×48 grid, 1.6 stroke. */
const ART: Record<string, ReactNode> = {
  passport: (
    <>
      <rect x="11" y="5" width="26" height="38" rx="2.5" />
      <circle cx="24" cy="20" r="7" />
      <path d="M17 20h14M24 13c-2.6 2-2.6 12 0 14M24 13c2.6 2 2.6 12 0 14" />
      <path d="M17 33h14M19 37h10" />
      <rect x="31" y="8" width="3" height="5" rx="0.6" fill={RED} stroke="none" />
    </>
  ),
  "id-card": (
    <>
      <rect x="4" y="10" width="40" height="28" rx="3" />
      <rect x="9" y="16" width="11" height="14" rx="1.5" />
      <circle cx="14.5" cy="21" r="2.4" />
      <path d="M10.5 28.5c1-2.4 7-2.4 8 0" />
      <path d="M25 18h13M25 23h13M25 28h8" />
      <path d="M4 14h40" stroke={BLUE} />
      <rect x="35" y="30" width="5" height="4" rx="0.8" fill={RED} stroke="none" />
    </>
  ),
  citizenship: (
    <>
      <path d="M11 5h18l8 8v30H11z" />
      <path d="M29 5v8h8" />
      <path d="M16 18h12M16 23h16M16 28h10" />
      <circle cx="30" cy="35" r="4.5" fill={RED} stroke="none" />
      <path d="M28 39.5l-1 4 3-1.5 3 1.5-1-4" stroke={RED} />
    </>
  ),
  police: (
    <>
      <path d="M24 4.5l15 5.5v11.5c0 9.5-6.5 16.5-15 21.5-8.5-5-15-12-15-21.5V10z" />
      <path d="M17 23.5l5 5 9.5-10" stroke={BLUE} strokeWidth="2.2" />
    </>
  ),
  licence: (
    <>
      <rect x="4" y="10" width="40" height="28" rx="3" />
      <circle cx="15" cy="24" r="6.5" />
      <circle cx="15" cy="24" r="1.6" fill={RED} stroke="none" />
      <path d="M15 17.5V22M9.2 27.2l4.2-2.2M20.8 27.2l-4.2-2.2" />
      <path d="M26 19h12M26 24h12M26 29h7" />
    </>
  ),
  car: (
    <>
      <path d="M5 30v-5l4-1 5-8h18l6 8 5 1.5V30a2 2 0 0 1-2 2h-3" />
      <path d="M13 32H11M31 32H17" />
      <path d="M16 24l3.5-5.5h6.5V24zM29 24v-5.5h2.5L35 24z" />
      <circle cx="13.5" cy="32" r="3.8" />
      <circle cx="34.5" cy="32" r="3.8" />
      <circle cx="34.5" cy="32" r="1.2" fill={RED} stroke="none" />
      <path d="M3 39h42" stroke="var(--line-strong)" />
    </>
  ),
  bluebook: (
    <>
      <path d="M12 5h24a2 2 0 0 1 2 2v34a2 2 0 0 1-2 2H12z" />
      <path d="M12 5a3 3 0 0 0-3 3v32a3 3 0 0 0 3 3" />
      <path d="M16 5v38" />
      <rect x="20" y="12" width="13" height="8" rx="1" fill={BLUE} stroke="none" />
      <path d="M20 27h13M20 32h9" />
      <circle cx="31" cy="37" r="2" fill={RED} stroke="none" />
    </>
  ),
  birth: (
    <>
      <path d="M11 5h18l8 8v30H11z" />
      <path d="M29 5v8h8" />
      <path d="M24 31.5s-7-4.3-7-9a3.6 3.6 0 0 1 7-1.4 3.6 3.6 0 0 1 7 1.4c0 4.7-7 9-7 9z" fill={RED} stroke="none" />
      <path d="M16 37h16" />
    </>
  ),
  marriage: (
    <>
      <circle cx="18.5" cy="28" r="10" />
      <circle cx="29.5" cy="28" r="10" />
      <path d="M26 6.5h7l2.5 3.5-6 6-6-6z" fill={RED} stroke="none" />
    </>
  ),
  family: (
    <>
      <circle cx="15" cy="13" r="4.5" />
      <circle cx="33" cy="13" r="4.5" />
      <circle cx="24" cy="24" r="3.5" fill={RED} stroke="none" />
      <path d="M6 33c0-6 4-10 9-10 2.2 0 4.2.8 5.6 2.2M42 33c0-6-4-10-9-10-2.2 0-4.2.8-5.6 2.2" />
      <path d="M17 40c0-5 3-8.5 7-8.5s7 3.5 7 8.5" />
      <path d="M4 43h40" stroke="var(--line-strong)" />
    </>
  ),
  ballot: (
    <>
      <path d="M7 24h34v18H7z" />
      <path d="M17 29h14" strokeWidth="2.4" />
      <path d="M15 24V6h18v18" />
      <path d="M19.5 15l3.5 3.5 6-7" stroke={RED} strokeWidth="2.2" />
    </>
  ),
  "work-abroad": (
    <>
      <path d="M6 28l13-4 9-14a2.5 2.5 0 0 1 4.2 2.5L27 21.5l11-3.4 3.4-5 3 .5-2.3 7.4-30 9.2z" />
      <rect x="9" y="33" width="20" height="11" rx="1.5" />
      <path d="M15 33v-2.5a1.5 1.5 0 0 1 1.5-1.5h5a1.5 1.5 0 0 1 1.5 1.5V33" />
      <path d="M9 38h20" stroke={RED} />
    </>
  ),
  graduation: (
    <>
      <path d="M3 18l21-9 21 9-21 9z" />
      <path d="M11 21.5V32c3.5 3.2 8 4.5 13 4.5S33.5 35.2 37 32V21.5" />
      <path d="M41 19.5v12" stroke={RED} />
      <circle cx="41" cy="33" r="2" fill={RED} stroke="none" />
    </>
  ),
  pan: (
    <>
      <path d="M10 4h28v39l-4-2.5-3.5 2.5-3.5-2.5-3 2.5-3-2.5-3.5 2.5-3.5-2.5-4 2.5z" />
      <path d="M16 13h16M16 19h16M16 25h9" />
      <circle cx="29.5" cy="31.5" r="5" fill={BLUE} stroke="none" />
      <path d="M27.5 31.5h4M29.5 29.5v4" stroke="#fff" />
    </>
  ),
  company: (
    <>
      <path d="M8 43V12l14-6v37M22 43V17h18v26" />
      <path d="M4 43h40" />
      <path d="M12 16h5M12 22h5M12 28h5M12 34h5M27 23h3M33 23h3M27 29h3M33 29h3" />
      <rect x="28.5" y="35" width="5" height="8" fill={RED} stroke="none" />
    </>
  ),
  land: (
    <>
      <path d="M3 33l15-7 27 8-15 8z" />
      <path d="M10.5 29.5l27 8M24 28l-9 9.5" />
      <path d="M30 5a7 7 0 0 0-7 7c0 5.3 7 12 7 12s7-6.7 7-12a7 7 0 0 0-7-7z" fill={RED} stroke="none" />
      <circle cx="30" cy="12" r="2.4" fill="#fff" stroke="none" />
    </>
  ),
};

export const ServiceIcon = ({ name, className }: { name: string; className?: string }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    {ART[name] ?? ART.citizenship}
  </svg>
);

export const IconTile = ({ name, large }: { name: string; large?: boolean }) => (
  <span className={large ? "icon-tile icon-tile--lg" : "icon-tile"}>
    <ServiceIcon name={name} />
  </span>
);
