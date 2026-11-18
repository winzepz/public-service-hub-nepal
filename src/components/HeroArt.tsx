/** Line illustration: Himalayan ridge, a stupa and the paperwork this site explains. */
export const HeroArt = () => (
  <svg viewBox="0 0 400 320" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {/* sun */}
    <circle cx="318" cy="62" r="20" fill="var(--red)" stroke="none" />
    {/* far ridge */}
    <path d="M0 170l40-34 22 14 38-52 26 24 30-40 40 50 22-18 46 58 34-30 40 36 34-26 28 22" stroke="var(--line-strong)" />
    {/* main ridge with snow lines */}
    <path d="M0 196l56-46 30 22 54-74 40 44 26-22 60 74 30-24 44 40 60-52" />
    <path d="M140 98l-14 22 10-4 6 8 8-12 10 6zM296 170l-10 14 8-2 4 6 6-8 6 4z" fill="var(--bg)" />
    {/* ground */}
    <path d="M0 236h400" />
    {/* prayer flags */}
    <path d="M34 150c40 22 80 30 116 26" stroke="var(--line-strong)" />
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const x = 46 + i * 18;
      const y = 156 + Math.sin(i / 1.6) * 8 + i * 1.6;
      const fills = ["var(--accent)", "var(--bg)", "var(--red)", "var(--surface-2)", "var(--accent)", "var(--red)"];
      return <path key={i} d={`M${x} ${y}l10 1-2 11-9-2z`} fill={fills[i]} strokeWidth="1.2" />;
    })}
    {/* stupa */}
    <g transform="translate(70 0)">
      <path d="M10 236h96M20 236v-10h76v10M28 226v-8h60v8" />
      <path d="M32 218c0-26 12-38 26-38s26 12 26 38" fill="var(--bg)" />
      <path d="M48 180v-12h20v12" fill="var(--bg)" />
      <path d="M52 174c2 2 4 2 6 0 2 2 4 2 6 0" />
      <path d="M50 168l8-34 8 34" fill="var(--bg)" />
      <path d="M52 158h12M53.5 151h9M55 144h6" />
      <path d="M58 134v-8" />
      <circle cx="58" cy="124" r="2.5" fill="var(--red)" stroke="none" />
    </g>
    {/* documents */}
    <g transform="translate(222 152) rotate(-6)">
      <rect x="0" y="0" width="74" height="100" rx="5" fill="var(--bg)" />
      <circle cx="37" cy="36" r="13" />
      <path d="M24 36h26M37 23c-5 4-5 22 0 26M37 23c5 4 5 22 0 26M20 68h34M26 78h22" />
      <rect x="56" y="8" width="6" height="10" rx="1" fill="var(--red)" stroke="none" />
    </g>
    <g transform="translate(286 196) rotate(5)">
      <rect x="0" y="0" width="92" height="60" rx="5" fill="var(--bg)" />
      <path d="M0 10h92" stroke="var(--accent)" />
      <rect x="10" y="18" width="22" height="28" rx="2" />
      <circle cx="21" cy="28" r="4.5" />
      <path d="M13 42c2-4 14-4 16 0M42 24h38M42 32h38M42 40h24" />
    </g>
    {/* check stamp */}
    <g transform="translate(338 262)">
      <circle cx="0" cy="0" r="18" fill="var(--accent)" stroke="none" />
      <path d="M-8 0l5.5 5.5L9-6" stroke="#fff" strokeWidth="2.6" />
    </g>
    <path d="M190 270h120" stroke="var(--line-strong)" />
  </svg>
);
