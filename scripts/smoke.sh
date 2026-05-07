#!/usr/bin/env bash
set -euo pipefail

npm run build
npx playwright test tests/e2e/smoke.spec.ts
