export function formatVersionLabel(version: string, commit: string): string {
  return `v${version} · commit ${commit}`;
}
