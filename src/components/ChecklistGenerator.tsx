"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { formatDate, toLocaleDigits } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { DownloadIcon, ListCheck, PrintIcon } from "./Icons";

export type ChecklistTask = {
  slug: string;
  title: string;
  category: string;
  where: string;
  documents: string[];
};

type Props = {
  locale: Locale;
  dict: Dictionary;
  tasks: ChecklistTask[];
  categories: { id: string; label: string }[];
};

type Saved = { selected: string[]; checked: Record<string, boolean>; name: string };

const KEY = "psh-checklist";

const load = (): Saved => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    return {
      selected: Array.isArray(raw.selected) ? raw.selected.filter((s: unknown) => typeof s === "string") : [],
      checked: raw.checked && typeof raw.checked === "object" ? raw.checked : {},
      name: typeof raw.name === "string" ? raw.name.slice(0, 80) : "",
    };
  } catch {
    return { selected: [], checked: {}, name: "" };
  }
};

export const ChecklistGenerator = ({ locale, dict, tasks, categories }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState("");

  const validSlugs = useMemo(() => new Set(tasks.map((t) => t.slug)), [tasks]);

  useEffect(() => {
    const saved = load();
    const fromUrl = (new URLSearchParams(window.location.search).get("s") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const merged = Array.from(new Set([...saved.selected, ...fromUrl])).filter((s) => validSlugs.has(s));
    setSelected(merged);
    setChecked(saved.checked);
    setName(saved.name);
    setToday(formatDate(new Date(), locale));
    setReady(true);
  }, [locale, validSlugs]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ selected, checked, name }));
    } catch {
      /* storage unavailable */
    }
  }, [selected, checked, name, ready]);

  const chosen = tasks.filter((t) => selected.includes(t.slug));
  const total = chosen.reduce((n, t) => n + t.documents.length, 0);
  const done = chosen.reduce((n, t) => n + t.documents.filter((_, i) => checked[`${t.slug}:${i}`]).length, 0);

  const toggleTask = (slug: string) =>
    setSelected((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]));

  const toggleItem = (key: string) => setChecked((cur) => ({ ...cur, [key]: !cur[key] }));

  const clearAll = () => {
    setSelected([]);
    setChecked({});
  };

  const download = () => {
    const lines: string[] = [dict.checklistTitle, `${dict.siteName}`, ""];
    if (name.trim()) lines.push(name.trim());
    lines.push(`${dict.generatedOn}: ${today}`, "");
    for (const t of chosen) {
      lines.push(t.title.toUpperCase(), `${dict.where}: ${t.where}`, "");
      t.documents.forEach((d, i) => lines.push(`[${checked[`${t.slug}:${i}`] ? "x" : " "}] ${d}`));
      lines.push("");
    }
    lines.push(dict.feeNote);
    const blob = new Blob([lines.join("\r\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `checklist-${chosen.map((t) => t.slug).join("-").slice(0, 60) || "documents"}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="checklist-layout">
      <section className="panel no-print" aria-labelledby="choose-tasks">
        <h2 id="choose-tasks">
          <span className="step-badge" aria-hidden="true">{toLocaleDigits(1, locale)}</span>
          {dict.chooseTasks}
        </h2>
        {categories.map((c) => {
          const group = tasks.filter((t) => t.category === c.id);
          if (!group.length) return null;
          return (
            <fieldset key={c.id} className="task-group">
              <legend>{c.label}</legend>
              {group.map((t) => (
                <label key={t.slug} className="task-option">
                  <input type="checkbox" checked={selected.includes(t.slug)} onChange={() => toggleTask(t.slug)} />
                  <span>{t.title}</span>
                </label>
              ))}
            </fieldset>
          );
        })}
      </section>

      <section aria-labelledby="your-checklist">
        <h2 id="your-checklist" className="no-print" style={{ fontSize: "1.125rem", marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
          <span className="step-badge" aria-hidden="true">{toLocaleDigits(2, locale)}</span>
          {dict.yourChecklist}
        </h2>

        <div className="no-print">
          <div className="field">
            <label htmlFor="cl-name">{dict.applicantName}</label>
            <input id="cl-name" type="text" value={name} maxLength={80} autoComplete="name" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="checklist-tools">
            <button type="button" className="btn" onClick={() => window.print()} disabled={!chosen.length}>
              <PrintIcon />
              {dict.print}
            </button>
            <button type="button" className="btn btn--ghost" onClick={download} disabled={!chosen.length}>
              <DownloadIcon />
              {dict.download}
            </button>
            <button type="button" className="btn btn--ghost" onClick={clearAll} disabled={!chosen.length}>
              {dict.clear}
            </button>
          </div>
        </div>

        {chosen.length === 0 ? (
          <div className="empty-state">
            <ListCheck />
            <p>{dict.emptyChecklist}</p>
          </div>
        ) : (
          <div className="cl-sheet">
            <div className="cl-sheet-head">
              <div>
                <strong>{dict.checklistTitle}</strong>
                {name.trim() && <div>{name.trim()}</div>}
              </div>
              <span>
                {dict.generatedOn}: {today}
              </span>
            </div>
            <div style={{ padding: "14px 20px 0" }}>
              <div className="progress" role="status">
                <span>
                  {locale === "ne"
                    ? `${toLocaleDigits(total, locale)} ${dict.packedOf} ${toLocaleDigits(done, locale)} ${dict.packedWord}`
                    : `${done} ${dict.packedOf} ${total} ${dict.packedWord}`}
                </span>
                <span className="progress-bar" aria-hidden="true">
                  <span style={{ width: `${pct}%` }} />
                </span>
              </div>
            </div>
            {chosen.map((t) => (
              <div key={t.slug} className="cl-task">
                <h3>{t.title}</h3>
                <p className="where">
                  <strong>{dict.where}:</strong> {t.where}
                </p>
                <ul className="cl-items">
                  {t.documents.map((doc, i) => {
                    const key = `${t.slug}:${i}`;
                    return (
                      <li key={key}>
                        <label>
                          <input type="checkbox" checked={!!checked[key]} onChange={() => toggleItem(key)} />
                          <span>{doc}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <p className="checklist-print-only" style={{ padding: "0 20px 20px", fontSize: "9pt" }}>
              {dict.feeNote} · {dict.siteName}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
