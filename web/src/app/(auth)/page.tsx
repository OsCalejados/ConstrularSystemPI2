import LoginForm from '@/components/forms/login-form'
import { HardHat } from '@phosphor-icons/react/dist/ssr'

export default function Login() {
  return (
    <div className="h-full flex flex-col gap-4 justify-center px-16">
      <div className="flex justify-center">
        <div className="w-32 h-32 rounded-full bg-background-secondary border text-contrast flex items-center justify-center">
          <HardHat size={72} weight="fill" />
        </div>
      </div>

      <div className="text-primary font-medium">
        <h1 className="text-3xl lg:text-5xl">Entrar</h1>
        <span>Bem vindo de volta!</span>
      </div>

      <LoginForm />
    </div>
  )
}
