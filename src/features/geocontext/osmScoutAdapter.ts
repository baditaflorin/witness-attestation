import type { GeoContext, LocationReading } from '../attestations/types';

const tileZoom = 15;

export function createOsmScoutContext(location: LocationReading): GeoContext {
  const tile = coordinateToTile(location.latitude, location.longitude, tileZoom);
  const roundedLatitude = Number(location.latitude.toFixed(5));
  const roundedLongitude = Number(location.longitude.toFixed(5));

  return {
    provider: 'libosmscout-adapter',
    providerVersion: 'static-v1',
    status: 'static-grid',
    datum: 'WGS84',
    label: `z${tileZoom}/${tile.x}/${tile.y}`,
    tile,
    roundedLatitude,
    roundedLongitude,
    osmScout: {
      dataset: null,
      datasetHash: null,
      note: 'Adapter boundary for future libosmscout WASM/static dataset integration.',
    },
  };
}

function coordinateToTile(latitude: number, longitude: number, zoom: number) {
  const latRad = (latitude * Math.PI) / 180;
  const scale = 2 ** zoom;
  const x = Math.floor(((longitude + 180) / 360) * scale);
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale,
  );

  return { zoom, x, y };
}
