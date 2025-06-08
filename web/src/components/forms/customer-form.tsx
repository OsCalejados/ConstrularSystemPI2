import InputError from '../ui/input-error'

import { useFormContext } from 'react-hook-form'
import { phoneMask } from '@/utils/phone-mask'
import { Input } from '../shadcnui/input'
import { Label } from '../shadcnui/label'
import { CustomerFormData } from '@/types/validations'

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => Promise<void>
}

export default function CustomerForm({ onSubmit }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<CustomerFormData>()

  return (
    <form
      className="flex flex-col gap-4"
      id="customer-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Customer Info Fields */}
      <div className="border-primary flex flex-col gap-4 flex-1 border p-6 pt-4 rounded-xl text-primary">
        <h4 className="font-medium">Dados do cliente</h4>
        <div className="mt-2 grid grid-cols-3 gap-4">
          <div className="col-span-3 xl:col-span-1">
            <Label htmlFor="name">Nome *</Label>
            <Input
              placeholder="Insira o nome"
              id="name"
              {...register('name')}
              className="mt-1"
            />
            <InputError error={errors.name?.message?.toString()} />
          </div>
          <div className="col-span-3 xl:col-span-1">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              placeholder="(xx) xxxxx-xxxx"
              id="phone"
              {...register('phone', {
                onChange: phoneMask,
              })}
              className="mt-1"
            />
            <InputError error={errors.phone?.message?.toString()} />
          </div>
          <div className="col-span-3 xl:col-span-1">
            <Label htmlFor="email">E-mail</Label>
            <Input
              placeholder="Insira um e-mail..."
              id="email"
              {...register('email')}
              className="mt-1"
            />
            <InputError error={errors.email?.message?.toString()} />
          </div>
        </div>
      </div>

      {/* Address Fields */}
      <div className="border-primary flex flex-col gap-4 flex-1 border px-6 py-4 rounded-xl text-primary">
        <h4 className="font-medium">Endereço</h4>
        <div className="mt-2 grid grid-cols-3 gap-4">
          <div className="col-span-3 xl:col-span-1">
            <Label htmlFor="city">Cidade</Label>
            <Input
              placeholder="Insira o nome da cidade..."
              id="city"
              {...register('city')}
              className="mt-1"
            />
            <InputError error={errors.city?.message?.toString()} />
          </div>
          <div className="col-span-3 xl:col-span-1">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              placeholder="Insira o nome do bairro..."
              id="neighborhood"
              {...register('neighborhood')}
              className="mt-1"
            />
            <InputError error={errors.neighborhood?.message?.toString()} />
          </div>
          <div className="col-span-3 xl:col-span-1">
            <Label htmlFor="street">Rua</Label>
            <Input
              placeholder="Insira o nome da rua..."
              id="street"
              {...register('street')}
              className="mt-1"
            />
            <InputError error={errors.street?.message?.toString()} />
          </div>
          <div className="col-span-3 xl:col-span-1">
            <Label htmlFor="number">Número</Label>
            <Input
              placeholder="Ex: 103"
              type="text"
              id="number"
              {...register('number')}
              className="mt-1"
            />
            <InputError error={errors.number?.message?.toString()} />
          </div>
          <div className="col-span-3 xl:col-span-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input
              placeholder="Casa, apartamento, bloco"
              id="complement"
              {...register('complement')}
              className="mt-1"
            />
            <InputError error={errors.complement?.message?.toString()} />
          </div>
          <div className="col-span-3">
            <Label htmlFor="reference">Ponto de referência</Label>
            <Input
              placeholder="Insira um ponto de referência..."
              id="reference"
              {...register('reference')}
              className="mt-1"
            />
            <InputError error={errors.reference?.message?.toString()} />
          </div>
        </div>
      </div>
    </form>
  )
}
