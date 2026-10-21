// UTC keeps the server render and the client hydration identical.
const formatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' })

// Formats a YYYY-MM-DD string, for example "21 October 2026".
export function formatDate(iso: string): string {
  return formatter.format(new Date(`${iso}T00:00:00Z`))
}
