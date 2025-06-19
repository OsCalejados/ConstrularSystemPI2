export function parseCurrency(value: string | number) {
  if (typeof value === 'string') {
    const onlyDigits = value.replace(/\D/g, '')
    const floatValue = Number(onlyDigits) / 100

    return isNaN(floatValue) ? 0 : floatValue
  }

  return value
}
