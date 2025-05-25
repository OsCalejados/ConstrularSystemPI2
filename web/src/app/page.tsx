import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/orders/1')
}
