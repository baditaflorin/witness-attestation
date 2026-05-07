import { useCallback, useEffect, useMemo, useState } from 'react';

import { createManualLocation, requestGpsFix } from '../geolocation/location';
import { createEvidenceBundle, downloadEvidenceBundle } from './bundle';
import { createSignedAttestation } from './signing';
import type { LocationReading, SignedAttestation } from './types';
import { generateKeyRecord, type KeyRecord } from '../crypto/keys';
import {
  clearAttestations,
  getKeyRecord,
  listAttestations,
  saveAttestation,
  saveKeyRecord,
} from '../storage/db';

type WitnessState = {
  key: KeyRecord | null;
  attestations: SignedAttestation[];
  location: LocationReading | null;
  status: string;
  error: string | null;
  isBusy: boolean;
};

export function useWitnessState() {
  const [state, setState] = useState<WitnessState>({
    key: null,
    attestations: [],
    location: null,
    status: 'Ready',
    error: null,
    isBusy: true,
  });

  const refresh = useCallback(async () => {
    const [key, attestations] = await Promise.all([getKeyRecord(), listAttestations()]);
    setState((current) => ({
      ...current,
      key: key ?? null,
      attestations,
      isBusy: false,
    }));
  }, []);

  useEffect(() => {
    refresh().catch((error: unknown) => {
      setState((current) => ({
        ...current,
        error: error instanceof Error ? error.message : 'Failed to load local state.',
        isBusy: false,
      }));
    });
  }, [refresh]);

  const latestAttestation = useMemo(
    () => state.attestations.at(-1) ?? null,
    [state.attestations],
  );

  const ensureKey = useCallback(async () => {
    setState((current) => ({
      ...current,
      isBusy: true,
      error: null,
      status: 'Generating key',
    }));
    try {
      const existing = await getKeyRecord();
      const key = existing ?? (await generateKeyRecord());
      if (!existing) {
        await saveKeyRecord(key);
      }
      await refresh();
      setState((current) => ({ ...current, key, status: 'Key ready', isBusy: false }));
      return key;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate key.';
      setState((current) => ({ ...current, error: message, isBusy: false }));
      throw error;
    }
  }, [refresh]);

  const captureGps = useCallback(async () => {
    setState((current) => ({
      ...current,
      isBusy: true,
      error: null,
      status: 'Requesting GPS',
    }));
    try {
      const location = await requestGpsFix();
      setState((current) => ({
        ...current,
        location,
        status: 'GPS fix captured',
        isBusy: false,
      }));
      return location;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'GPS capture failed.';
      setState((current) => ({ ...current, error: message, isBusy: false }));
      throw error;
    }
  }, []);

  const setManualLocation = useCallback(
    (latitude: number, longitude: number, accuracyMeters: number | null) => {
      try {
        const location = createManualLocation(
          latitude,
          longitude,
          accuracyMeters,
          'manual',
        );
        setState((current) => ({
          ...current,
          location,
          error: null,
          status: 'Manual location set',
        }));
      } catch (error) {
        setState((current) => ({
          ...current,
          error: error instanceof Error ? error.message : 'Manual location failed.',
        }));
      }
    },
    [],
  );

  const setDemoLocation = useCallback(() => {
    const location = createManualLocation(44.439663, 26.096306, 25, 'demo');
    setState((current) => ({ ...current, location, status: 'Demo location set' }));
  }, []);

  const signCurrentLocation = useCallback(
    async (statement: string) => {
      const key = state.key ?? (await ensureKey());
      const location = state.location;

      if (!location) {
        throw new Error('Capture or enter a location before signing.');
      }

      setState((current) => ({
        ...current,
        isBusy: true,
        error: null,
        status: 'Signing event',
      }));

      try {
        const attestations = await listAttestations();
        const previous = attestations.at(-1);
        const signed = await createSignedAttestation({
          statement,
          location,
          chainIndex: attestations.length,
          previousHash: previous?.eventHash ?? null,
          key,
        });

        await saveAttestation(signed);
        await refresh();
        setState((current) => ({
          ...current,
          status: 'Attestation signed',
          isBusy: false,
        }));
        return signed;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Signing failed.';
        setState((current) => ({ ...current, error: message, isBusy: false }));
        throw error;
      }
    },
    [ensureKey, refresh, state.key, state.location],
  );

  const exportBundle = useCallback(async (selectedEventId: string) => {
    const attestations = await listAttestations();
    const bundle = await createEvidenceBundle(attestations, selectedEventId);
    downloadEvidenceBundle(bundle);
    setState((current) => ({ ...current, status: 'Evidence bundle exported' }));
  }, []);

  const clearLocalAttestations = useCallback(async () => {
    await clearAttestations();
    await refresh();
    setState((current) => ({ ...current, status: 'Local attestation chain cleared' }));
  }, [refresh]);

  return {
    ...state,
    latestAttestation,
    ensureKey,
    captureGps,
    setManualLocation,
    setDemoLocation,
    signCurrentLocation,
    exportBundle,
    clearLocalAttestations,
  };
}

export type WitnessController = ReturnType<typeof useWitnessState>;
