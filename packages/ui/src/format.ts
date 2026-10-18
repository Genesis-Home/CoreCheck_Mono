/**
 * Dates and times are shown in the organisation's time zone (NFR-005); the
 * admin portal passes undefined to use the viewer's own.
 */

export const formatDate = (
  iso: string | null | undefined,
  timeZone?: string,
): string => {
  if (!iso) return '—';
  // Plain dates ("2026-10-15") are calendar days, not instants: never shift them.
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [year, month, day] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year!, month! - 1, day!)));
  }
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeZone,
  }).format(new Date(iso));
};

export const formatDateTime = (
  iso: string | null | undefined,
  timeZone?: string,
): string => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(new Date(iso));
};

export const fullName = (person: {
  firstName: string;
  lastName: string;
}): string => `${person.firstName} ${person.lastName}`;

export const plural = (count: number, one: string, many = `${one}s`): string =>
  `${count} ${count === 1 ? one : many}`;
