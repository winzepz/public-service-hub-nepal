"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { AccessIcon } from "./Icons";

const KEY = "psh-a11y";
type Prefs = { text: "1" | "2" | "3"; contrast: boolean };

const read = (): Prefs => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    return { text: ["1", "2", "3"].includes(raw.text) ? raw.text : "1", contrast: raw.contrast === true };
  } catch {
    return { text: "1", contrast: false };
  }
};

const apply = (prefs: Prefs) => {
  const root = document.documentElement;
  root.dataset.text = prefs.text;
  if (prefs.contrast) root.dataset.contrast = "high";
  else delete root.dataset.contrast;
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* storage unavailable */
  }
};

/** Text size and contrast settings in a small disclosure panel. */
export const A11yControls = ({ dict }: { dict: Dictionary }) => {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ text: "1", contrast: false });
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const name = useId();

  useEffect(() => setPrefs(read()), []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const update = (next: Prefs) => {
    setPrefs(next);
    apply(next);
  };

  const sizes: { value: Prefs["text"]; label: string; aria: string }[] = [
    { value: "1", label: "A", aria: "100%" },
    { value: "2", label: "A+", aria: "112%" },
    { value: "3", label: "A++", aria: "125%" },
  ];

  return (
    <div className="a11y-wrap" ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className="tool-btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <AccessIcon />
        <span className="visually-hidden">
          {dict.textSize}, {dict.contrast}
        </span>
      </button>
      {open && (
        <div id={panelId} className="a11y-panel">
          <fieldset>
            <legend>{dict.textSize}</legend>
            <div className="segmented">
              {sizes.map((s) => (
                <label key={s.value}>
                  <input
                    type="radio"
                    name={name}
                    value={s.value}
                    checked={prefs.text === s.value}
                    onChange={() => update({ ...prefs, text: s.value })}
                    aria-label={`${s.label} (${s.aria})`}
                  />
                  <span aria-hidden="true">{s.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="check-row">
            <input
              type="checkbox"
              checked={prefs.contrast}
              onChange={(e) => update({ ...prefs, contrast: e.target.checked })}
            />
            {dict.contrast}
          </label>
        </div>
      )}
    </div>
  );
};
