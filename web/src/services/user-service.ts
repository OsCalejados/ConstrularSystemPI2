import { getSession } from '@/app/_actions/auth'
import { User } from '@/types/user'
import { api } from '@/lib/axios'

export async function getUserBySession(): Promise<User | null> {
  const session = await getSession()

  if (!session) return null

  const response = await api.get(`users/${session.user.id}`)
  return response.data
}

export async function getUser(userId: number): Promise<User> {
  const response = await api.get(`users/${userId}`)

  return response.data
}

// export async function changeName(data: ChangeNameFormData) {
//   const session = await getSession()

//   if (!session) return null

//   await api.patch(`users/${session.user.id}/update-name`, data)
// }

// export async function changeUsername(data: ChangeUsernameFormData) {
//   const session = await getSession()

//   if (!session) return null

//   await api.patch(`users/${session.user.id}/update-username`, data)
// }

// export async function changePassword(data: ChangePasswordFormData) {
//   const session = await getSession()

//   if (!session) return null

//   await api.patch(`users/${session.user.id}/update-password`, data)
// }
