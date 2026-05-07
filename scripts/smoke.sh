#!/usr/bin/env bash
set -euo pipefail

npm run build

port="${PORT:-4187}"
mkdir -p tmp
npm run pages-preview -- --port "$port" --strictPort >tmp/pages-preview.log 2>&1 &
server_pid="$!"

cleanup() {
  kill "$server_pid" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in $(seq 1 60); do
  if curl -fs "http://127.0.0.1:${port}/witness-attestation/" >/dev/null; then
    PLAYWRIGHT_SKIP_WEBSERVER=1 npx playwright test tests/e2e/smoke.spec.ts
    exit 0
  fi
  sleep 1
done

cat tmp/pages-preview.log
echo "Timed out waiting for Pages preview." >&2
exit 1
