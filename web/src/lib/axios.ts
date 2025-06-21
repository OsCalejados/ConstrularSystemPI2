import { getSession } from '@/app/_actions/auth'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/',
  withCredentials: true,
})

api.interceptors.request.use(
  async (config) => {
    console.log('req interceptada')

    const session = await getSession()
    if (session && session.access_token) {
      console.log('Colocando token no header', session.access_token)
      config.headers.Authorization = `Bearer ${session.access_token}`
    }

    console.log(config)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
