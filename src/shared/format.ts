export function shortHash(hash: string, length = 12): string {
  return hash.length <= length ? hash : `${hash.slice(0, length)}...`;
}

export function formatCoordinate(value: number): string {
  return value.toFixed(6);
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(value));
}
