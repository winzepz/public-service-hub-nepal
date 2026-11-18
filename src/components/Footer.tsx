import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { REPO_URL } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { GithubIcon, LogoMark } from "./Icons";

export const Footer = ({ locale, dict }: { locale: Locale; dict: Dictionary }) => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-grid">
        <div>
          <p style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>
            <LogoMark style={{ width: 26, height: 26 }} />
            {dict.siteName}
          </p>
          <p style={{ maxWidth: "46ch" }}>{dict.disclaimerShort}</p>
          <p style={{ marginTop: 10, maxWidth: "46ch" }}>{dict.footerOpenSource}</p>
        </div>
        <div>
          <h2>{dict.nav.services}</h2>
          <ul>
            <li><Link href={`/${locale}/services/`}>{dict.allServices}</Link></li>
            <li><Link href={`/${locale}/checklist/`}>{dict.nav.checklist}</Link></li>
            <li><Link href={`/${locale}/portals/`}>{dict.nav.portals}</Link></li>
            <li><Link href={`/${locale}/map/`}>{dict.nav.map}</Link></li>
          </ul>
        </div>
        <div>
          <h2>{dict.nav.about}</h2>
          <ul>
            <li><Link href={`/${locale}/about/`}>{dict.aboutTitle}</Link></li>
            <li>
              <a href={REPO_URL} rel="noopener noreferrer" target="_blank" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                <GithubIcon style={{ width: 16, height: 16 }} />
                {dict.contribute}
                <span className="visually-hidden"> {dict.opensNewTab}</span>
              </a>
            </li>
            <li>
              <a href={`${REPO_URL}/issues/new`} rel="noopener noreferrer" target="_blank">
                {dict.reportIssue}
                <span className="visually-hidden"> {dict.opensNewTab}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="emergency">{dict.emergency}</p>
        <p>{dict.sourceAndData}</p>
      </div>
    </div>
  </footer>
);
