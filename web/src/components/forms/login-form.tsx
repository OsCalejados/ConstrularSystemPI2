'use client'

import { loginFormSchema } from '@/validations/login-form-schema'
import { LoginFormData } from '@/types/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { saveSession } from '@/app/_actions/auth'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../shadcnui/button'
import { Input } from '../shadcnui/input'
import { Label } from '../shadcnui/label'
import { login } from '@/services/auth-service'

export default function LoginForm() {
  const router = useRouter()
  const [loginError, setLoginError] = useState<string | null>(null)
  const { handleSubmit, register } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  })

  const { mutate } = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      await saveSession(data)
      router.replace('/customers')
    },
    onError: (e: AxiosError) => {
      if (e.response && e.response.status === 401) {
        setLoginError(
          'Credenciais incorretas. Por favor, verifique o usuário e a senha que digitou.',
        )
      } else {
        setLoginError('Ocorreu um erro. Por favor, tente mais tarde.')
      }
    },
  })

  return (
    <form
      id="change-password-form"
      onSubmit={handleSubmit((data) => mutate(data))}
      className="flex flex-col gap-4"
    >
      <div>
        <div className="mt-4">
          <Label htmlFor="oldPassword" className="text-right">
            Usuário
          </Label>
          <Input id="username" className="mt-1" {...register('username')} />
        </div>

        <div className="mt-4">
          <Label htmlFor="password" className="text-right">
            Senha
          </Label>
          <Input
            id="password"
            className="mt-1"
            type="password"
            {...register('password')}
          />
        </div>
      </div>

      {loginError && (
        <div className="rounded-xl bg-red-500 bg-opacity-25 p-6">
          <p className="text-sm">{loginError}</p>
        </div>
      )}

      <Button className="bg-primary hover:bg-primary-hover w-full lg:w-fit self-end px-16">
        Entrar
      </Button>
    </form>
  )
}
