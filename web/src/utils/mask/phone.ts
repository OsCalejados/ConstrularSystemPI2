import { ChangeEvent } from 'react'

export function phoneMask(e: ChangeEvent<HTMLInputElement>) {
  let value = e.target.value

  value = value.replace(/\D/g, '')

  value = value.slice(0, 11)

  if (value.length > 7) {
    value = value.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3')
  } else if (value.length > 5) {
    value = value.replace(/(\d{2})(\d+)/, '($1) $2')
  } else if (value.length > 1) {
    value = value.replace(/(\d{2})/, '($1) ')
  }

  e.target.value = value

  return e
}
