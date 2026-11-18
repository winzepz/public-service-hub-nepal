import Link from "next/link";
import { LogoMark } from "@/components/Icons";

// Static entry point: sends visitors to their saved language (English by default).
const redirect = `(function(){var l='en';try{if(localStorage.getItem('psh-lang')==='ne')l='ne';}catch(e){}location.replace('/'+l+'/');})();`;

export default function RootPage() {
  return (
    <main id="main" className="container nf">
      <script dangerouslySetInnerHTML={{ __html: redirect }} />
      <LogoMark style={{ width: 40, height: 40 }} />
      <h1>Public Service Hub Nepal</h1>
      <p className="lead" lang="ne">सार्वजनिक सेवा हब नेपाल</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href="/en/" className="btn" hrefLang="en">English</Link>
        <Link href="/ne/" className="btn btn--ghost" hrefLang="ne" lang="ne">नेपाली</Link>
      </div>
    </main>
  );
}
