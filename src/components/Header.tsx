"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { CloseIcon, GlobeIcon, LogoMark, MenuIcon } from "./Icons";
import { A11yControls } from "./A11yControls";

type Props = { locale: Locale; dict: Dictionary };

const LANG_KEY = "psh-lang";

const normalize = (path: string) => (path.endsWith("/") ? path : `${path}/`);

export const Header = ({ locale, dict }: Props) => {
  const pathname = normalize(usePathname() || `/${locale}/`);
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const other: Locale = locale === "en" ? "ne" : "en";
  const switchHref = pathname.replace(new RegExp(`^/${locale}(/|$)`), `/${other}/`);

  const links = [
    { href: `/${locale}/services/`, label: dict.nav.services },
    { href: `/${locale}/checklist/`, label: dict.nav.checklist },
    { href: `/${locale}/portals/`, label: dict.nav.portals },
    { href: `/${locale}/map/`, label: dict.nav.map },
    { href: `/${locale}/about/`, label: dict.nav.about },
  ];

  const isCurrent = (href: string) => pathname === href || (href !== `/${locale}/` && pathname.startsWith(href));

  const rememberLanguage = () => {
    try {
      localStorage.setItem(LANG_KEY, other);
    } catch {
      /* storage unavailable */
    }
  };

  const navList = (
    <ul>
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} aria-current={isCurrent(l.href) ? "page" : undefined}>
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={`/${locale}/`} className="brand" aria-label={`${dict.siteName}, ${dict.nav.home}`}>
          <LogoMark className="brand-mark" />
          <span className="brand-text">
            {dict.siteName}
            <small>{dict.tagline}</small>
          </span>
        </Link>

        <nav className="main-nav" aria-label={locale === "ne" ? "मुख्य" : "Main"}>
          {navList}
        </nav>

        <div className="header-tools">
          <A11yControls dict={dict} />
          <Link
            href={switchHref}
            className="tool-btn"
            hrefLang={other}
            lang={other}
            aria-label={dict.languageLabel}
            onClick={rememberLanguage}
          >
            <GlobeIcon />
            <span className="lang-label-long">{dict.languageSwitch}</span>
          </Link>
          <button
            type="button"
            className="tool-btn menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
            <span className="visually-hidden">{dict.menu}</span>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" className="mobile-nav container" aria-label={dict.menu}>
          {navList}
        </nav>
      )}
    </header>
  );
};
