type SodiumRuntime = {
  ready: Promise<void>;
  base64_variants: {
    ORIGINAL_NO_PADDING: number;
  };
  crypto_generichash: (hashLength: number, message: string | Uint8Array) => Uint8Array;
  crypto_sign_keypair: () => {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
  };
  crypto_sign_detached: (message: Uint8Array, privateKey: Uint8Array) => Uint8Array;
  crypto_sign_verify_detached: (
    signature: Uint8Array,
    message: Uint8Array,
    publicKey: Uint8Array,
  ) => boolean;
  from_base64: (value: string, variant: number) => Uint8Array;
  from_hex: (value: string) => Uint8Array;
  to_base64: (value: Uint8Array, variant: number) => string;
  to_hex: (value: Uint8Array) => string;
};

let sodiumPromise: Promise<SodiumRuntime> | undefined;

export async function getSodium(): Promise<SodiumRuntime> {
  sodiumPromise ??= import('libsodium-wrappers-sumo').then(async (module) => {
    const sodium = (module.default ?? module) as unknown as SodiumRuntime;
    await sodium.ready;
    return sodium;
  });

  return sodiumPromise;
}
