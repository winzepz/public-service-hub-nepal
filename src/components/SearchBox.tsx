"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { categoryLabel } from "@/lib/i18n";
import { searchServices } from "@/lib/search";
import type { Locale, SearchItem } from "@/lib/types";
import { SearchIcon } from "./Icons";
import { ServiceIcon } from "./ServiceIcon";

type Props = {
  locale: Locale;
  items: SearchItem[];
  labels: { label: string; placeholder: string; noResults: string; resultsCount: string; viewAll: string };
  showLabel?: boolean;
};

/** ARIA 1.2 combobox with instant keyword matching across English and Nepali. */
export const SearchBox = ({ locale, items, labels, showLabel = true }: Props) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const listId = `${id}-list`;
  const inputId = `${id}-input`;

  const results = useMemo(() => searchServices(items, query), [items, query]);
  const showList = open && query.trim().length > 0;

  useEffect(() => setActive(-1), [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable='true']")) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  const go = (slug: string) => {
    setOpen(false);
    router.push(`/${locale}/services/${slug}/`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (results.length ? (i + 1) % results.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i <= 0 ? results.length - 1 : i - 1) : -1));
    } else if (e.key === "Enter") {
      const pick = results[active] ?? results[0];
      if (pick) {
        e.preventDefault();
        go(pick.slug);
      }
    } else if (e.key === "Escape") {
      if (open) setOpen(false);
      else setQuery("");
    }
  };

  const optionId = (i: number) => `${id}-opt-${i}`;
  const countText = query.trim() ? `${results.length} ${labels.resultsCount}` : "";

  return (
    <div className="search" ref={wrapRef} role="search">
      <label htmlFor={inputId} className={showLabel ? "search-label" : "visually-hidden"}>
        {labels.label}
      </label>
      <div className="search-field">
        <SearchIcon />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          inputMode="search"
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
          placeholder={labels.placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        <kbd className="kbd" aria-hidden="true">/</kbd>
      </div>
      <div aria-live="polite" className="visually-hidden">{countText}</div>
      <ul id={listId} role="listbox" aria-label={labels.label} className="search-results" hidden={!showList}>
        {results.map((r, i) => (
          <li
            key={r.slug}
            id={optionId(i)}
            role="option"
            aria-selected={i === active}
            className="search-option"
            onMouseDown={(e) => {
              e.preventDefault();
              go(r.slug);
            }}
            onMouseEnter={() => setActive(i)}
          >
            <span className="icon-tile"><ServiceIcon name={r.icon} /></span>
            <span>
              <strong>{r.title}</strong>
              <small>{categoryLabel(r.category, locale)}</small>
            </span>
          </li>
        ))}
        {showList && results.length === 0 && (
          <li className="search-empty" role="presentation">
            {labels.noResults} <Link href={`/${locale}/services/`}>{labels.viewAll}</Link>
          </li>
        )}
      </ul>
    </div>
  );
};
