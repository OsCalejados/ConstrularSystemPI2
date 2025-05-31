import { Role } from "@/enums/role"

export interface User {
  id: number
  name: string
  role: Role
  username: string
}
