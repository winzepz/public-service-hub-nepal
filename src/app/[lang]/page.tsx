import Link from "next/link";
import { HeroArt } from "@/components/HeroArt";
import { ArrowRight, ListCheck, MapIcon, ShieldCheck } from "@/components/Icons";
import { SearchBox } from "@/components/SearchBox";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceIcon } from "@/components/ServiceIcon";
import { buildSearchIndex, getServices } from "@/lib/content";
import { CATEGORIES, categoryLabel, getDictionary, pick, toLocaleDigits } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const CATEGORY_ICON: Record<string, string> = {
  identity: "id-card",
  travel: "passport",
  transport: "car",
  civil: "family",
  "tax-business": "pan",
  "land-property": "land",
};

const QUICK = ["passport-renewal", "driving-licence-new", "police-clearance", "national-id-card"];

export default function Home({ params }: { params: { lang: Locale } }) {
  const locale = params.lang;
  const dict = getDictionary(locale);
  const services = getServices();
  const popular = services.filter((s) => s.popular).slice(0, 6);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">{dict.heroEyebrow}</p>
            <h1>{dict.heroTitle}</h1>
            <p className="lead">{dict.heroBody}</p>
            <SearchBox
              locale={locale}
              items={buildSearchIndex(locale)}
              labels={{
                label: dict.searchLabel,
                placeholder: dict.searchPlaceholder,
                noResults: dict.noResults,
                resultsCount: dict.resultsCount,
                viewAll: dict.viewAll,
              }}
            />
            <div className="quick-links">
              {QUICK.map((slug) => {
                const s = services.find((x) => x.slug === slug);
                return s ? (
                  <Link key={slug} className="chip" href={`/${locale}/services/${slug}/`}>
                    {pick(s.title, locale)}
                  </Link>
                ) : null;
              })}
            </div>
          </div>
          <div className="hero-art">
            <HeroArt />
          </div>
        </div>
      </section>

      <section className="section container" aria-labelledby="popular-heading">
        <div className="section-head">
          <h2 id="popular-heading">{dict.popular}</h2>
          <Link href={`/${locale}/services/`} className="link-arrow">
            {dict.viewAll} <ArrowRight width={18} height={18} />
          </Link>
        </div>
        <div className="grid grid--3">
          {popular.map((s) => (
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

      <section className="section container" aria-labelledby="cat-heading">
        <div className="section-head">
          <h2 id="cat-heading">{dict.browseByCategory}</h2>
        </div>
        <div className="grid grid--3">
          {CATEGORIES.map((c) => {
            const count = services.filter((s) => s.category === c.id).length;
            return (
              <article key={c.id} className="card cat-card">
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <span className="icon-tile" style={{ width: 48, height: 48 }}>
                    <ServiceIcon name={CATEGORY_ICON[c.id]} />
                  </span>
                  <div>
                    <h3 style={{ fontSize: "1.0625rem" }}>
                      <Link href={`/${locale}/services/?category=${c.id}`}>{pick(c.label, locale)}</Link>
                    </h3>
                    <span className="count">
                      {toLocaleDigits(count, locale)} {dict.servicesWord}
                    </span>
                  </div>
                </div>
                <p>{pick(c.description, locale)}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section container" aria-label={dict.nav.checklist}>
        <div className="promo-grid">
          <div className="promo promo--dark">
            <ListCheck className="promo-icon" />
            <h2 style={{ fontSize: "1.25rem" }}>{dict.checklistPromoTitle}</h2>
            <p>{dict.checklistPromoBody}</p>
            <Link href={`/${locale}/checklist/`} className="link-arrow">
              {dict.makeChecklist} <ArrowRight width={18} height={18} />
            </Link>
          </div>
          <div className="promo">
            <ShieldCheck className="promo-icon" />
            <h2 style={{ fontSize: "1.25rem" }}>{dict.portalPromoTitle}</h2>
            <p>{dict.portalPromoBody}</p>
            <Link href={`/${locale}/portals/`} className="link-arrow">
              {dict.seePortals} <ArrowRight width={18} height={18} />
            </Link>
          </div>
          <div className="promo">
            <MapIcon className="promo-icon" />
            <h2 style={{ fontSize: "1.25rem" }}>{dict.mapPromoTitle}</h2>
            <p>{dict.mapPromoBody}</p>
            <Link href={`/${locale}/map/`} className="link-arrow">
              {dict.openMap} <ArrowRight width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
