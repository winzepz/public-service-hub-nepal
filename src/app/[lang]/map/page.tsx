import type { Metadata } from "next";
import { MapExplorer } from "@/components/MapExplorer";
import { getServices } from "@/lib/content";
import { getDictionary, pick } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export const generateMetadata = ({ params }: { params: { lang: Locale } }): Metadata => {
  const dict = getDictionary(params.lang);
  return { title: dict.mapTitle, description: dict.mapPromoBody };
};

export default function MapPage({ params }: { params: { lang: Locale } }) {
  const locale = params.lang;
  const dict = getDictionary(locale);
  const serviceTitles = Object.fromEntries(getServices().map((s) => [s.slug, pick(s.title, locale)]));

  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">{dict.nav.map}</p>
        <h1>{dict.mapTitle}</h1>
        <p className="lead">{dict.mapIntro}</p>
      </header>
      <MapExplorer locale={locale} dict={dict} serviceTitles={serviceTitles} />
    </div>
  );
}
