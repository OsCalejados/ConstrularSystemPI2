export function currencyToFloat(value: string | number) {
  if (typeof value === 'string') {
    const cleanedValue = value.replace(/[R$\s.]/g, '').replace(',', '.')
    const floatValue = parseFloat(cleanedValue)

    return floatValue
  }

  return value
}
