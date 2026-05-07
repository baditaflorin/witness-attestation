import { BadgeCheck, Github, HeartHandshake, KeyRound, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import { VersionBadge } from '../../shared/VersionBadge';
import { shortHash } from '../../shared/format';
import { buildMerkleTree } from '../crypto/merkle';
import { VerifierPanel } from '../verification/VerifierPanel';
import { CapturePanel } from './CapturePanel';
import { ChainPanel } from './ChainPanel';
import { LatestMap } from './LatestMap';
import { Metric } from './Metric';
import { useWitnessState } from './useWitnessState';

const repositoryUrl =
  import.meta.env.VITE_REPOSITORY_URL ??
  'https://github.com/baditaflorin/witness-attestation';
const paypalUrl =
  import.meta.env.VITE_PAYPAL_URL ?? 'https://www.paypal.com/paypalme/florinbadita';

export function WitnessApp() {
  const witness = useWitnessState();
  const [merkleRoot, setMerkleRoot] = useState<string | null>(null);
  const latest = witness.latestAttestation;

  useEffect(() => {
    let isCurrent = true;

    async function refreshMerkleRoot() {
      if (witness.attestations.length === 0) {
        setMerkleRoot(null);
        return;
      }

      try {
        const tree = await buildMerkleTree(
          witness.attestations.map((attestation) => attestation.eventHash),
        );
        if (isCurrent) {
          setMerkleRoot(tree.root);
        }
      } catch {
        if (isCurrent) {
          setMerkleRoot(null);
        }
      }
    }

    void refreshMerkleRoot();

    return () => {
      isCurrent = false;
    };
  }, [witness.attestations]);

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

      <section className="workspace">
        <div className="status-rail">
          <div className="signal-card">
            <div>
              <p className="eyebrow">Witness</p>
              <h1>Presence attestation</h1>
            </div>
            <VersionBadge />
            <p className="status-line" role="status">
              {witness.error ?? witness.status}
            </p>
          </div>

          <div className="metric-grid">
            <Metric
              icon={<KeyRound size={20} />}
              label="Key"
              value={witness.key ? shortHash(witness.key.fingerprint) : 'none'}
            />
            <Metric
              icon={<BadgeCheck size={20} />}
              label="Events"
              value={String(witness.attestations.length)}
            />
            <Metric
              icon={<ShieldCheck size={20} />}
              label="Root"
              value={merkleRoot ? shortHash(merkleRoot) : 'empty'}
            />
          </div>

          <LatestMap attestation={latest} />
        </div>

        <CapturePanel witness={witness} />
        <ChainPanel witness={witness} latest={latest} />
        <VerifierPanel />
      </section>
    </main>
  );
}
