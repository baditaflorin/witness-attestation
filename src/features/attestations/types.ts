import { z } from 'zod';

export const schemaVersion = 'witness.bundle.v1';
export const payloadSchemaVersion = 'witness.payload.v1';

export type LocationSource = 'gps' | 'manual' | 'demo';

export type LocationReading = {
  source: LocationSource;
  latitude: number;
  longitude: number;
  accuracyMeters: number | null;
  altitudeMeters: number | null;
  headingDegrees: number | null;
  speedMetersPerSecond: number | null;
  capturedAt: string;
};

export type GeoContext = {
  provider: 'libosmscout-adapter';
  providerVersion: string;
  status: 'static-grid';
  datum: 'WGS84';
  label: string;
  tile: {
    zoom: number;
    x: number;
    y: number;
  };
  roundedLatitude: number;
  roundedLongitude: number;
  osmScout: {
    dataset: string | null;
    datasetHash: string | null;
    note: string;
  };
};

export type AttestationPayload = {
  schemaVersion: typeof payloadSchemaVersion;
  id: string;
  statement: string;
  capturedAt: string;
  createdAt: string;
  location: LocationReading;
  context: GeoContext;
  chain: {
    index: number;
    previousHash: string | null;
  };
  client: {
    timezone: string;
    userAgentHash: string;
  };
};

export type SignedAttestation = {
  payload: AttestationPayload;
  eventHash: string;
  signature: string;
  publicKey: string;
  signedAt: string;
};

export type EvidenceBundle = {
  schemaVersion: typeof schemaVersion;
  exportedAt: string;
  publicKey: string;
  selectedEventId: string;
  merkleRoot: string;
  attestations: SignedAttestation[];
};

const nullableNumberSchema = z.number().finite().nullable();

export const locationReadingSchema = z.object({
  source: z.enum(['gps', 'manual', 'demo']),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracyMeters: nullableNumberSchema,
  altitudeMeters: nullableNumberSchema,
  headingDegrees: nullableNumberSchema,
  speedMetersPerSecond: nullableNumberSchema,
  capturedAt: z.string().datetime(),
});

export const geoContextSchema = z.object({
  provider: z.literal('libosmscout-adapter'),
  providerVersion: z.string(),
  status: z.literal('static-grid'),
  datum: z.literal('WGS84'),
  label: z.string(),
  tile: z.object({
    zoom: z.number().int().nonnegative(),
    x: z.number().int().nonnegative(),
    y: z.number().int().nonnegative(),
  }),
  roundedLatitude: z.number(),
  roundedLongitude: z.number(),
  osmScout: z.object({
    dataset: z.string().nullable(),
    datasetHash: z.string().nullable(),
    note: z.string(),
  }),
});

export const attestationPayloadSchema = z.object({
  schemaVersion: z.literal(payloadSchemaVersion),
  id: z.string().uuid(),
  statement: z.string().min(1),
  capturedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  location: locationReadingSchema,
  context: geoContextSchema,
  chain: z.object({
    index: z.number().int().nonnegative(),
    previousHash: z.string().length(64).nullable(),
  }),
  client: z.object({
    timezone: z.string(),
    userAgentHash: z.string().length(64),
  }),
});

export const signedAttestationSchema = z.object({
  payload: attestationPayloadSchema,
  eventHash: z.string().length(64),
  signature: z.string().min(40),
  publicKey: z.string().min(40),
  signedAt: z.string().datetime(),
});

export const evidenceBundleSchema = z.object({
  schemaVersion: z.literal(schemaVersion),
  exportedAt: z.string().datetime(),
  publicKey: z.string().min(40),
  selectedEventId: z.string().uuid(),
  merkleRoot: z.string().length(64),
  attestations: z.array(signedAttestationSchema).min(1),
});
