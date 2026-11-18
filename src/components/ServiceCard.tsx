import Link from "next/link";
import { ServiceIcon } from "./ServiceIcon";

export type ServiceSummary = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  categoryLabel: string;
  icon: string;
};

export const ServiceCard = ({
  service,
  locale,
  headingLevel = 3,
}: {
  service: ServiceSummary;
  locale: string;
  headingLevel?: 2 | 3;
}) => {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="card">
      <div className="card-top">
        <span className="icon-tile">
          <ServiceIcon name={service.icon} />
        </span>
        <span className="tag">{service.categoryLabel}</span>
      </div>
      <Heading style={{ fontSize: "1.125rem" }}>
        <Link href={`/${locale}/services/${service.slug}/`}>{service.title}</Link>
      </Heading>
      <p>{service.summary}</p>
    </article>
  );
};
