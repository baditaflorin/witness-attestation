# Privacy

Witness Attestation has no backend and no analytics.

## What Stays Local

- Ed25519 private key
- GPS observations
- attestation history
- imported evidence bundles

These records are stored in the browser's IndexedDB for this site. Clearing site data can delete them.

## What Leaves the Device

Only these public requests happen during normal use:

- GitHub Pages serves static app files from https://baditaflorin.github.io/witness-attestation/
- The app may fetch the public latest commit from https://api.github.com/repos/baditaflorin/witness-attestation/commits/main
- The user can open https://github.com/baditaflorin/witness-attestation
- The user can open https://www.paypal.com/paypalme/florinbadita

Evidence bundles are downloaded by the browser only when the user explicitly exports them.
