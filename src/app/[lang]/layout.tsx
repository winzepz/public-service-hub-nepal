import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getDictionary, isLocale } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export const generateMetadata = ({ params }: { params: { lang: string } }): Metadata => {
  if (!isLocale(params.lang)) return {};
  const dict = getDictionary(params.lang);
  return {
    title: { absolute: dict.siteName, template: `%s · ${dict.siteName}` },
    description: dict.heroBody,
    alternates: { languages: { en: "/en/", ne: "/ne/" } },
    openGraph: { siteName: dict.siteName, locale: params.lang === "ne" ? "ne_NP" : "en_US", type: "website" },
  };
};

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
  if (!isLocale(params.lang)) notFound();
  const locale = params.lang as Locale;
  const dict = getDictionary(locale);
  return (
    <div lang={locale}>
      <a href="#main" className="skip-link">
        {dict.skip}
      </a>
      <Header locale={locale} dict={dict} />
      <main id="main" tabIndex={-1} style={{ outline: "none" }}>
        {children}
      </main>
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
