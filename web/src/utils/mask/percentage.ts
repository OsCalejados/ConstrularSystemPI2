import { ChangeEvent } from 'react'

export function percentageMask(e: ChangeEvent<HTMLInputElement>) {
  let value = e.target.value

  value = value.replace(/\D/g, '')

  if (value.length > 5) {
    value = value.slice(0, 4)
  }

  while (value.length < 3) {
    value = '0' + value
  }

  value = value.replace(/^0+(\d{3,})$/, '$1')
  value = value.replace(/(\d)(\d{2})$/, '$1,$2')

  value = '% ' + value
  e.target.value = value

  return e
}
