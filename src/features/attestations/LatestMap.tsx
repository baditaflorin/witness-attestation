import { formatCoordinate } from '../../shared/format';
import type { SignedAttestation } from './types';

export function LatestMap({ attestation }: { attestation: SignedAttestation | null }) {
  if (!attestation) {
    return null;
  }

  const { location, context } = attestation.payload;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=16/${location.latitude}/${location.longitude}`;

  return (
    <aside className="map-panel" aria-label="Latest attestation map">
      <div className="map-grid">
        <span className="map-pin" />
      </div>
      <div className="map-meta">
        <strong>{context.label}</strong>
        <span>
          {formatCoordinate(location.latitude)}, {formatCoordinate(location.longitude)}
        </span>
        <a href={osmUrl} rel="noreferrer" target="_blank">
          OpenStreetMap
        </a>
      </div>
    </aside>
  );
}
