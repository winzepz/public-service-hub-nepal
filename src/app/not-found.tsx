import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="container nf">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p className="lead">The page you are looking for does not exist or has moved.</p>
      <h2 lang="ne" style={{ fontSize: "1.5rem" }}>पृष्ठ भेटिएन</h2>
      <p lang="ne" className="lead">तपाईंले खोज्नुभएको पृष्ठ छैन वा सारिएको छ।</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href="/en/" className="btn">Go to the home page</Link>
        <Link href="/ne/" className="btn btn--ghost" lang="ne">गृहपृष्ठमा जानुहोस्</Link>
      </div>
    </main>
  );
}
