export function parseNumber(value: string): number {
  const normalized = value.replace(/^0+(?!$)/, '')

  if (normalized === '') return 0

  const parsed = Number(normalized)

  return isNaN(parsed) ? 0 : parsed
}
