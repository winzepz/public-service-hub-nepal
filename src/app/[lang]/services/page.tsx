import type { Metadata } from "next";
import { SearchBox } from "@/components/SearchBox";
import { ServicesBrowser } from "@/components/ServicesBrowser";
import { buildSearchIndex, getServices } from "@/lib/content";
import { CATEGORIES, categoryLabel, getDictionary, pick, toLocaleDigits } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export const generateMetadata = ({ params }: { params: { lang: Locale } }): Metadata => {
  const dict = getDictionary(params.lang);
  return { title: dict.allServices, alternates: { languages: { en: "/en/services/", ne: "/ne/services/" } } };
};

export default function ServicesPage({ params }: { params: { lang: Locale } }) {
  const locale = params.lang;
  const dict = getDictionary(locale);
  const services = getServices();

  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">
          {toLocaleDigits(services.length, locale)} {dict.servicesWord}
        </p>
        <h1>{dict.allServices}</h1>
        <SearchBox
          locale={locale}
          items={buildSearchIndex(locale)}
          showLabel={false}
          labels={{
            label: dict.searchLabel,
            placeholder: dict.searchPlaceholder,
            noResults: dict.noResults,
            resultsCount: dict.resultsCount,
            viewAll: dict.viewAll,
          }}
        />
      </header>
      <ServicesBrowser
        locale={locale}
        labels={{ all: dict.all, filterBy: dict.filterBy, servicesWord: dict.servicesWord }}
        categories={CATEGORIES.map((c) => ({ id: c.id, label: pick(c.label, locale) }))}
        services={services.map((s) => ({
          slug: s.slug,
          title: pick(s.title, locale),
          summary: pick(s.summary, locale),
          category: s.category,
          categoryLabel: categoryLabel(s.category, locale),
          icon: s.icon,
        }))}
      />
    </div>
  );
}
