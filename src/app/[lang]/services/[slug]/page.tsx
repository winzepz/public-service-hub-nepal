import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertIcon, ClockIcon, ExternalIcon, ListCheck, ShieldCheck } from "@/components/Icons";
import { PrintButton } from "@/components/PrintButton";
import { ServiceCard } from "@/components/ServiceCard";
import { IconTile } from "@/components/ServiceIcon";
import { getPortalMap, getService, getServices } from "@/lib/content";
import { categoryLabel, formatMonth, getDictionary, pick, REPO_URL, toLocaleDigits } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

export const dynamicParams = false;

export const generateStaticParams = () =>
  LOCALES.flatMap((lang) => getServices().map((s) => ({ lang, slug: s.slug })));

export const generateMetadata = ({ params }: { params: { lang: Locale; slug: string } }): Metadata => {
  const s = getService(params.slug);
  if (!s) return {};
  return {
    title: pick(s.title, params.lang),
    description: pick(s.summary, params.lang),
    alternates: { languages: { en: `/en/services/${s.slug}/`, ne: `/ne/services/${s.slug}/` } },
  };
};

const hostOf = (url: string) => new URL(url).hostname;

const Domain = ({ url }: { url: string }) => {
  const host = hostOf(url);
  const base = host.endsWith(".gov.np") ? host.slice(0, -".gov.np".length) : host;
  return (
    <span className="domain">
      <ShieldCheck />
      {base}
      {host.endsWith(".gov.np") && <b>.gov.np</b>}
    </span>
  );
};

export default function ServicePage({ params }: { params: { lang: Locale; slug: string } }) {
  const locale = params.lang;
  const service = getService(params.slug);
  if (!service) notFound();
  const dict = getDictionary(locale);
  const portals = getPortalMap();
  const t = (b: { en: string; ne: string }) => pick(b, locale);
  const related = getServices()
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3);

  const sections = [
    { id: "eligibility", label: dict.eligibility },
    { id: "where", label: dict.where },
    { id: "documents", label: dict.documents },
    { id: "steps", label: dict.steps },
    { id: "fees", label: dict.fees },
    { id: "time", label: dict.time },
    { id: "links", label: dict.officialLinks },
    ...(service.tips.length ? [{ id: "tips", label: dict.tips }] : []),
  ];
  const num = (id: string) => toLocaleDigits(sections.findIndex((s) => s.id === id) + 1, locale);

  const issueUrl = `${REPO_URL}/issues/new?title=${encodeURIComponent(`Correction: ${service.title.en}`)}&labels=content`;

  return (
    <div className="container">
      <nav className="breadcrumbs" aria-label={locale === "ne" ? "ब्रेडक्रम्ब" : "Breadcrumb"} style={{ paddingTop: 24 }}>
        <ol>
          <li><Link href={`/${locale}/`}>{dict.nav.home}</Link></li>
          <li><Link href={`/${locale}/services/`}>{dict.nav.services}</Link></li>
          <li><span aria-current="page">{t(service.title)}</span></li>
        </ol>
      </nav>

      <header className="guide-head">
        <IconTile name={service.icon} large />
        <div>
          <p className="eyebrow">{categoryLabel(service.category, locale)}</p>
          <h1>{t(service.title)}</h1>
          <p className="lead">{t(service.summary)}</p>
          <div className="meta-row">
            <span>
              {dict.authority}: <strong>{t(service.authority)}</strong>
            </span>
            <span>
              {dict.updated}: <strong>{formatMonth(service.lastReviewed, locale)}</strong>
            </span>
          </div>
          <div className="action-row">
            <Link href={`/${locale}/checklist/?s=${service.slug}`} className="btn">
              <ListCheck />
              {dict.addToChecklist}
            </Link>
            <PrintButton label={dict.printChecklist} />
          </div>
        </div>
      </header>

      <div className="guide-layout">
        <nav className="toc" aria-labelledby="toc-heading">
          <h2 id="toc-heading">{dict.onThisPage}</h2>
          <ol>
            {sections.map((s) => (
              <li key={s.id}><a href={`#${s.id}`}>{s.label}</a></li>
            ))}
          </ol>
        </nav>

        <div className="guide-body">
          <section id="eligibility" className="guide-section" aria-labelledby="h-eligibility">
            <h2 id="h-eligibility"><span className="num" aria-hidden="true">{num("eligibility")}</span>{dict.eligibility}</h2>
            <ul className="bullets">
              {service.eligibility.map((e) => <li key={e.en}>{t(e)}</li>)}
            </ul>
          </section>

          <section id="where" className="guide-section" aria-labelledby="h-where">
            <h2 id="h-where"><span className="num" aria-hidden="true">{num("where")}</span>{dict.where}</h2>
            <ul className="bullets">
              {service.where.map((w) => <li key={w.en}>{t(w)}</li>)}
            </ul>
          </section>

          <section id="documents" className="guide-section" aria-labelledby="h-documents">
            <h2 id="h-documents"><span className="num" aria-hidden="true">{num("documents")}</span>{dict.documents}</h2>
            <ul className="doc-list">
              {service.documents.map((d) => (
                <li key={d.en}>
                  <span className="doc-box" aria-hidden="true" />
                  <span>{t(d)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="steps" className="guide-section" aria-labelledby="h-steps">
            <h2 id="h-steps"><span className="num" aria-hidden="true">{num("steps")}</span>{dict.steps}</h2>
            <ol className="steps">
              {service.steps.map((s) => <li key={s.en}>{t(s)}</li>)}
            </ol>
          </section>

          <section id="fees" className="guide-section" aria-labelledby="h-fees">
            <h2 id="h-fees"><span className="num" aria-hidden="true">{num("fees")}</span>{dict.fees}</h2>
            <div className="table-wrap">
              <table>
                <caption>{dict.feeNote}</caption>
                <thead>
                  <tr>
                    <th scope="col">{dict.feeItem}</th>
                    <th scope="col">{dict.feeAmount}</th>
                  </tr>
                </thead>
                <tbody>
                  {service.fees.map((f) => (
                    <tr key={f.label.en}>
                      <th scope="row">{t(f.label)}</th>
                      <td className="amount">{t(f.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="time" className="guide-section" aria-labelledby="h-time">
            <h2 id="h-time"><span className="num" aria-hidden="true">{num("time")}</span>{dict.time}</h2>
            <div className="time-box">
              <ClockIcon />
              <p>{t(service.time)}</p>
            </div>
          </section>

          <section id="links" className="guide-section" aria-labelledby="h-links">
            <h2 id="h-links"><span className="num" aria-hidden="true">{num("links")}</span>{dict.officialLinks}</h2>
            <ul className="portal-list">
              {service.portals.map((id) => {
                const p = portals.get(id);
                if (!p) return null;
                return (
                  <li key={id} className="portal">
                    <div>
                      <h3>{t(p.name)}</h3>
                      <Domain url={p.url} />
                      <p>{t(p.description)}</p>
                      {p.note && <p className="note">{t(p.note)}</p>}
                    </div>
                    <a className="btn btn--ghost btn--small portal-link" href={p.url} target="_blank" rel="noopener noreferrer">
                      {dict.visit}
                      <ExternalIcon />
                      <span className="visually-hidden">{t(p.name)} {dict.opensNewTab}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>

          {service.tips.length > 0 && (
            <section id="tips" className="guide-section" aria-labelledby="h-tips">
              <h2 id="h-tips"><span className="num" aria-hidden="true">{num("tips")}</span>{dict.tips}</h2>
              <ul className="bullets">
                {service.tips.map((tip) => <li key={tip.en}>{t(tip)}</li>)}
              </ul>
            </section>
          )}

          <div className="callout">
            <AlertIcon />
            <p>
              {dict.disclaimerShort}{" "}
              <a href={issueUrl} target="_blank" rel="noopener noreferrer">
                {dict.reportIssue}
                <span className="visually-hidden"> {dict.opensNewTab}</span>
              </a>
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section related" aria-labelledby="related-heading">
          <div className="section-head">
            <h2 id="related-heading">{dict.relatedServices}</h2>
          </div>
          <div className="grid grid--3">
            {related.map((s) => (
              <ServiceCard
                key={s.slug}
                locale={locale}
                service={{
                  slug: s.slug,
                  title: pick(s.title, locale),
                  summary: pick(s.summary, locale),
                  category: s.category,
                  categoryLabel: categoryLabel(s.category, locale),
                  icon: s.icon,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
