import { Download, ShieldCheck, Trash2 } from 'lucide-react';

import { formatDateTime, shortHash } from '../../shared/format';
import type { SignedAttestation } from './types';
import type { WitnessController } from './useWitnessState';

export function ChainPanel({
  witness,
  latest,
}: {
  witness: WitnessController;
  latest: SignedAttestation | null;
}) {
  return (
    <section className="tool-section" aria-labelledby="chain-title">
      <div className="section-heading">
        <ShieldCheck size={24} aria-hidden="true" />
        <div>
          <p className="eyebrow">Chain</p>
          <h2 id="chain-title">Local attestations</h2>
        </div>
      </div>

      <div className="chain-list">
        {witness.attestations.length === 0 ? (
          <p className="empty-state">No signed events yet.</p>
        ) : (
          witness.attestations.map((attestation) => (
            <article className="attestation-card" key={attestation.payload.id}>
              <div>
                <strong>#{attestation.payload.chain.index}</strong>
                <span>{formatDateTime(attestation.payload.createdAt)}</span>
              </div>
              <p>{attestation.payload.statement}</p>
              <code>{shortHash(attestation.eventHash, 18)}</code>
              <button
                type="button"
                className="icon-action"
                aria-label={`Export event ${attestation.payload.chain.index}`}
                onClick={() => {
                  void witness.exportBundle(attestation.payload.id);
                }}
              >
                <Download size={18} aria-hidden="true" />
              </button>
            </article>
          ))
        )}
      </div>

      <div className="action-row">
        <button
          type="button"
          className="secondary-action"
          disabled={!latest}
          onClick={() => {
            if (latest) {
              void witness.exportBundle(latest.payload.id);
            }
          }}
        >
          <Download size={18} aria-hidden="true" />
          Export latest bundle
        </button>
        <button
          type="button"
          className="secondary-action danger-action"
          disabled={witness.attestations.length === 0}
          onClick={() => {
            void witness.clearLocalAttestations();
          }}
        >
          <Trash2 size={18} aria-hidden="true" />
          Clear local chain
        </button>
      </div>
    </section>
  );
}
