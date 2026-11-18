import type { Metadata } from "next";
import { AlertIcon, ExternalIcon, ShieldCheck } from "@/components/Icons";
import { getPortals } from "@/lib/content";
import { CATEGORIES, getDictionary, pick } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export const generateMetadata = ({ params }: { params: { lang: Locale } }): Metadata => {
  const dict = getDictionary(params.lang);
  return { title: dict.portalsTitle, description: dict.portalsIntro };
};

export default function PortalsPage({ params }: { params: { lang: Locale } }) {
  const locale = params.lang;
  const dict = getDictionary(locale);
  const portals = getPortals();
  const groups = [
    { id: "general", label: locale === "ne" ? "सामान्य" : "General" },
    ...CATEGORIES.map((c) => ({ id: c.id as string, label: pick(c.label, locale) })),
  ];

  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">{dict.nav.portals}</p>
        <h1>{dict.portalsTitle}</h1>
        <p className="lead">{dict.portalsIntro}</p>
      </header>

      <aside className="phish" style={{ marginTop: 24 }} aria-labelledby="phish-heading">
        <h2 id="phish-heading">
          <AlertIcon />
          {dict.phishingTitle}
        </h2>
        <ul>
          {dict.phishingTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </aside>

      <div style={{ marginTop: 48 }}>
        {groups.map((g) => {
          const items = portals.filter((p) => p.category === g.id);
          if (!items.length) return null;
          return (
            <section key={g.id} className="portal-group" aria-labelledby={`pg-${g.id}`}>
              <h2 id={`pg-${g.id}`}>{g.label}</h2>
              <ul className="portal-list">
                {items.map((p) => {
                  const host = new URL(p.url).hostname;
                  return (
                    <li key={p.id} className="portal">
                      <div>
                        <h3>{pick(p.name, locale)}</h3>
                        <span className="domain">
                          <ShieldCheck />
                          {host.replace(/\.gov\.np$/, "")}
                          <b>.gov.np</b>
                        </span>
                        <p>
                          {pick(p.description, locale)}{" "}
                          <span style={{ color: "var(--ink-3)" }}>· {pick(p.authority, locale)}</span>
                        </p>
                        {p.note && <p className="note">{pick(p.note, locale)}</p>}
                      </div>
                      <a className="btn btn--ghost btn--small portal-link" href={p.url} target="_blank" rel="noopener noreferrer">
                        {dict.visit}
                        <ExternalIcon />
                        <span className="visually-hidden">
                          {pick(p.name, locale)} {dict.opensNewTab}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
