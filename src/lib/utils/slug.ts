export async function generateUniqueSlug(
  baseSlug: string,
  exists: (candidate: string) => Promise<boolean>
): Promise<string> {
  const normalized = baseSlug.trim() || `item-${Date.now()}`;
  let candidate = normalized;
  let suffix = 1;

  while (await exists(candidate)) {
    candidate = `${normalized}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}
