export function ExtendPath(prefix: string, path?: string | string[]) {
  if (!path) return prefix;
  if (typeof path === 'string') {
    return `${prefix}/${path}`;
  }

  return path.map(x => `${prefix}/${x}`);
}