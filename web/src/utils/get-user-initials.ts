export function getUserInitials(name: string): string {
  const nameParts = name.split(' ')

  const firstName = nameParts[0]
  const lastName = nameParts[nameParts.length - 1]

  if (lastName && firstName !== lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  return firstName.slice(0, 2).toUpperCase()
}
