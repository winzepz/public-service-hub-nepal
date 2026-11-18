import type { Metadata } from "next";
import { ChecklistGenerator } from "@/components/ChecklistGenerator";
import { getServices } from "@/lib/content";
import { CATEGORIES, getDictionary, pick } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export const generateMetadata = ({ params }: { params: { lang: Locale } }): Metadata => {
  const dict = getDictionary(params.lang);
  return { title: dict.checklistTitle, description: dict.checklistIntro };
};

export default function ChecklistPage({ params }: { params: { lang: Locale } }) {
  const locale = params.lang;
  const dict = getDictionary(locale);
  const tasks = getServices().map((s) => ({
    slug: s.slug,
    title: pick(s.title, locale),
    category: s.category,
    where: s.where.map((w) => pick(w, locale)).join(" "),
    documents: s.documents.map((d) => pick(d, locale)),
  }));

  return (
    <div className="container">
      <header className="page-head no-print">
        <p className="eyebrow">{dict.nav.checklist}</p>
        <h1>{dict.checklistTitle}</h1>
        <p className="lead">{dict.checklistIntro}</p>
      </header>
      <ChecklistGenerator
        locale={locale}
        dict={dict}
        tasks={tasks}
        categories={CATEGORIES.map((c) => ({ id: c.id, label: pick(c.label, locale) }))}
      />
    </div>
  );
}
