import { User } from './user'

export interface Session {
  user: User
  access_token: string
}
