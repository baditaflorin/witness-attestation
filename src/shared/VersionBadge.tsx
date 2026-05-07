import { useQuery } from '@tanstack/react-query';

import { formatVersionLabel } from './formatVersion';

type CommitResponse = {
  sha: string;
};

const owner = import.meta.env.VITE_GITHUB_OWNER ?? 'baditaflorin';
const repo = import.meta.env.VITE_GITHUB_REPO ?? 'witness-attestation';
const version = import.meta.env.VITE_APP_VERSION ?? '0.0.0';
const buildCommit = import.meta.env.VITE_GIT_COMMIT ?? 'local';

async function fetchLiveCommit(): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits/main`,
    {
      headers: { Accept: 'application/vnd.github+json' },
    },
  );

  if (!response.ok) {
    throw new Error('Unable to load live commit.');
  }

  const data = (await response.json()) as CommitResponse;
  return data.sha.slice(0, 12);
}

export function VersionBadge() {
  const { data: liveCommit } = useQuery({
    queryKey: ['live-commit', owner, repo],
    queryFn: fetchLiveCommit,
    staleTime: 300_000,
    retry: false,
  });

  return (
    <p className="version-badge" aria-label="Application version and commit">
      {formatVersionLabel(version, liveCommit ?? buildCommit)}
    </p>
  );
}
