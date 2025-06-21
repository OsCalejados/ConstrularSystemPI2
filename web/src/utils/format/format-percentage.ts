export function formatPercentage(
  value: number,
  position: 'prefix' | 'suffix' = 'prefix',
): string {
  const formatted = value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return position === 'prefix' ? `% ${formatted}` : `${formatted} %`
}
