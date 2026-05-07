import { Github, HeartHandshake, ShieldCheck } from 'lucide-react';

import { VersionBadge } from './shared/VersionBadge';

const repositoryUrl =
  import.meta.env.VITE_REPOSITORY_URL ??
  'https://github.com/baditaflorin/witness-attestation';
const paypalUrl =
  import.meta.env.VITE_PAYPAL_URL ?? 'https://www.paypal.com/paypalme/florinbadita';

export function App() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/witness-attestation/" aria-label="Witness home">
          <span className="brand-mark">W</span>
          <span>
            <strong>Witness</strong>
            <small>Cryptographic attestation of presence</small>
          </span>
        </a>
        <nav aria-label="Project links">
          <a href={repositoryUrl} rel="noreferrer" target="_blank">
            <Github size={18} aria-hidden="true" />
            Star on GitHub
          </a>
          <a href={paypalUrl} rel="noreferrer" target="_blank">
            <HeartHandshake size={18} aria-hidden="true" />
            Support
          </a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Local-first evidence tooling</p>
          <h1>Sign where you were, keep the proof with you.</h1>
          <p>
            Witness will generate local Ed25519 attestations for GPS/time events,
            hashchain them, and export evidence bundles that can be verified offline.
          </p>
          <VersionBadge />
        </div>
        <div className="proof-panel" aria-label="Implementation status">
          <ShieldCheck size={34} aria-hidden="true" />
          <h2>Mode A scaffold published</h2>
          <p>
            The first GitHub Pages shell is ready. Crypto capture, local storage, and
            bundle verification land after the ADR baseline.
          </p>
        </div>
      </section>
    </main>
  );
}
