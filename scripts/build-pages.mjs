import { copyFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import process from 'node:process';

const version = process.env.npm_package_version ?? '0.0.0';

let commit = 'local';
try {
  commit = execFileSync('git', ['rev-parse', '--short=12', 'HEAD'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
} catch {
  // The first local build can happen before the first commit.
}

process.env.VITE_APP_VERSION = version;
process.env.VITE_GIT_COMMIT = commit;
process.env.VITE_GITHUB_OWNER ??= 'baditaflorin';
process.env.VITE_GITHUB_REPO ??= 'witness-attestation';
process.env.VITE_REPOSITORY_URL ??=
  'https://github.com/baditaflorin/witness-attestation';
process.env.VITE_PAYPAL_URL ??= 'https://www.paypal.com/paypalme/florinbadita';

execFileSync('vite', ['build'], { stdio: 'inherit' });
await copyFile('docs/index.html', 'docs/404.html');
await writeFile('docs/.nojekyll', '');
