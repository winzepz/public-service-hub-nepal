"use client";

import { PrintIcon } from "./Icons";

export const PrintButton = ({ label, className = "btn btn--ghost" }: { label: string; className?: string }) => (
  <button type="button" className={className} onClick={() => window.print()}>
    <PrintIcon />
    {label}
  </button>
);
