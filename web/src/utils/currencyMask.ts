import { ChangeEvent } from 'react'

export function currencyMask(e: ChangeEvent<HTMLInputElement>) {
  let value = e.target.value

  value = value.replace(/\D/g, '')

  while (value.length < 3) {
    value = '0' + value
  }

  value = value.replace(/^0+(\d{3,})$/, '$1')

  value = value.replace(/(\d)(\d{2})$/, '$1,$2')
  value = value.replace(/(?=(\d{3})+(\D))\B/g, '.')
  value = 'R$ ' + value
  e.target.value = value

  return e
}
