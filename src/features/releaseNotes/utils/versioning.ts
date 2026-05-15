/**
 * Utility to generate enterprise version numbers.
 * Format: YYYY.MM.DD or YYYY.MM.DD.X
 */
export const generateNextVersion = (existingVersions: string[]): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const baseVersion = `${year}.${month}.${day}`;

  const sameDayVersions = existingVersions
    .filter(v => v.startsWith(baseVersion))
    .map(v => {
      const parts = v.split('.');
      return parts.length > 3 ? parseInt(parts[3], 10) : 0;
    })
    .sort((a, b) => b - a);

  if (sameDayVersions.length === 0) {
    return baseVersion;
  }

  const nextSuffix = sameDayVersions[0] + 1;
  return `${baseVersion}.${nextSuffix}`;
};
