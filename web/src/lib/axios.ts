import { getSession } from '@/app/_actions/auth'
import axios from 'axios'

export const api = axios.create({
  baseURL: `http://localhost:${process.env.NEXT_PUBLIC_API_PORT ?? 3001}/`,
})

api.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    if (session && session.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
