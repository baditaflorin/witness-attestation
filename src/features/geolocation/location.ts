import type { LocationReading, LocationSource } from '../attestations/types';

export async function requestGpsFix(): Promise<LocationReading> {
  if (!('geolocation' in navigator)) {
    throw new Error('Geolocation is not available in this browser.');
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15_000,
      maximumAge: 0,
    });
  });

  return fromCoordinates(position.coords, 'gps', new Date(position.timestamp));
}

export function createManualLocation(
  latitude: number,
  longitude: number,
  accuracyMeters: number | null,
  source: LocationSource,
): LocationReading {
  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90.');
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180.');
  }

  return {
    source,
    latitude,
    longitude,
    accuracyMeters,
    altitudeMeters: null,
    headingDegrees: null,
    speedMetersPerSecond: null,
    capturedAt: new Date().toISOString(),
  };
}

function fromCoordinates(
  coordinates: GeolocationCoordinates,
  source: LocationSource,
  capturedAt: Date,
): LocationReading {
  return {
    source,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    accuracyMeters: coordinates.accuracy,
    altitudeMeters: coordinates.altitude,
    headingDegrees: coordinates.heading,
    speedMetersPerSecond: coordinates.speed,
    capturedAt: capturedAt.toISOString(),
  };
}
