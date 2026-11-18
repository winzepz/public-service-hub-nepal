"use client";

import { useEffect, useState } from "react";
import { ServiceCard, type ServiceSummary } from "./ServiceCard";

type Props = {
  locale: string;
  services: ServiceSummary[];
  categories: { id: string; label: string }[];
  labels: { all: string; filterBy: string; servicesWord: string };
};

/** Category filter (toggle buttons) over the full service grid. Works without JS: all cards render. */
export const ServicesBrowser = ({ locale, services, categories, labels }: Props) => {
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("category");
    if (fromUrl && categories.some((c) => c.id === fromUrl)) setCategory(fromUrl);
  }, [categories]);

  const choose = (id: string) => {
    setCategory(id);
    const url = new URL(window.location.href);
    if (id === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", id);
    window.history.replaceState(null, "", url);
  };

  const visible = category === "all" ? services : services.filter((s) => s.category === category);

  return (
    <>
      <div className="filter-bar" role="group" aria-label={labels.filterBy}>
        {[{ id: "all", label: labels.all }, ...categories].map((c) => (
          <button key={c.id} type="button" aria-pressed={category === c.id} onClick={() => choose(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">
        {visible.length} {labels.servicesWord}
      </p>
      <div className="grid grid--3">
        {visible.map((s) => (
          <ServiceCard key={s.slug} service={s} locale={locale} headingLevel={2} />
        ))}
      </div>
    </>
  );
};
