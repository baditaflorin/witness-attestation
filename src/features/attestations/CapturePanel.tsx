import { Crosshair, KeyRound, MapPin, Navigation, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

import { formatCoordinate, formatDateTime } from '../../shared/format';
import type { WitnessController } from './useWitnessState';

export function CapturePanel({ witness }: { witness: WitnessController }) {
  const [statement, setStatement] = useState(
    'I attest that I was present at this location at the captured time.',
  );
  const [latitude, setLatitude] = useState('44.439663');
  const [longitude, setLongitude] = useState('26.096306');
  const [accuracy, setAccuracy] = useState('25');

  function setManual() {
    witness.setManualLocation(
      Number.parseFloat(latitude),
      Number.parseFloat(longitude),
      accuracy.trim() === '' ? null : Number.parseFloat(accuracy),
    );
  }

  return (
    <section className="tool-section" aria-labelledby="capture-title">
      <div className="section-heading">
        <Crosshair size={24} aria-hidden="true" />
        <div>
          <p className="eyebrow">Capture</p>
          <h2 id="capture-title">Sign a spatiotemporal event</h2>
        </div>
      </div>

      <div className="action-row">
        <button
          type="button"
          className="secondary-action"
          disabled={witness.isBusy}
          onClick={() => {
            void witness.ensureKey();
          }}
        >
          <KeyRound size={18} aria-hidden="true" />
          {witness.key ? 'Key ready' : 'Generate key'}
        </button>
        <button
          type="button"
          className="secondary-action"
          disabled={witness.isBusy}
          onClick={() => {
            void witness.captureGps();
          }}
        >
          <Navigation size={18} aria-hidden="true" />
          GPS fix
        </button>
        <button
          type="button"
          className="secondary-action"
          disabled={witness.isBusy}
          onClick={witness.setDemoLocation}
        >
          <MapPin size={18} aria-hidden="true" />
          Demo fix
        </button>
      </div>

      <label className="field">
        <span>Statement</span>
        <textarea
          value={statement}
          rows={4}
          onChange={(event) => {
            setStatement(event.target.value);
          }}
        />
      </label>

      <div className="coordinate-grid">
        <label className="field">
          <span>Latitude</span>
          <input
            inputMode="decimal"
            value={latitude}
            onChange={(event) => setLatitude(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Longitude</span>
          <input
            inputMode="decimal"
            value={longitude}
            onChange={(event) => setLongitude(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Accuracy meters</span>
          <input
            inputMode="decimal"
            value={accuracy}
            onChange={(event) => setAccuracy(event.target.value)}
          />
        </label>
      </div>

      <div className="action-row">
        <button type="button" className="secondary-action" onClick={setManual}>
          <MapPin size={18} aria-hidden="true" />
          Use entered point
        </button>
        <button
          type="button"
          className="primary-action"
          disabled={witness.isBusy || !statement.trim()}
          onClick={() => {
            void witness.signCurrentLocation(statement);
          }}
        >
          <ShieldCheck size={18} aria-hidden="true" />
          Sign event
        </button>
      </div>

      {witness.location ? (
        <p className="location-readout">
          {witness.location.source.toUpperCase()} ·{' '}
          {formatCoordinate(witness.location.latitude)},{' '}
          {formatCoordinate(witness.location.longitude)} ·{' '}
          {formatDateTime(witness.location.capturedAt)}
        </p>
      ) : null}
    </section>
  );
}
