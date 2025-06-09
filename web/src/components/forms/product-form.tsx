import InputError from '../ui/input-error'

import { useFormContext, Controller } from 'react-hook-form'
import { Input } from '../shadcnui/input'
import { Label } from '../shadcnui/label'
import { ProductFormData } from '@/types/validations'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../shadcnui/select'
import { useEffect } from 'react'

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>
}

export default function ProductForm({ onSubmit }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormData>()

  const costPrice = watch('costPrice')
  const profitMargin = watch('profitMargin')

  // Calcular preço de venda e lucro automaticamente
  useEffect(() => {
    if (costPrice && profitMargin) {
      const profit = (costPrice * profitMargin) / 100
      const salePrice = costPrice + profit

      setValue('profit', profit)
      setValue('salePrice', salePrice)
    }
  }, [costPrice, profitMargin, setValue])

  return (
    <form
      className="flex flex-col lg:flex-row gap-4"
      id="product-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Dados do produto */}
      <div className="border-primary flex flex-col gap-4 flex-[2] border p-6 pt-4 rounded-xl text-primary">
        <h4 className="font-medium">Dados do produto</h4>
        <div className="mt-2 grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              placeholder="Ex: Chave de fenda"
              id="name"
              {...register('name')}
              className="mt-1"
            />
            <InputError error={errors.name?.message?.toString()} />
          </div>

          <div>
            <Label htmlFor="brand">Marca</Label>
            <Input
              placeholder="Insira a marca"
              id="brand"
              {...register('brand')}
              className="mt-1"
            />
            <InputError error={errors.brand?.message?.toString()} />
          </div>

          <div>
            <Label htmlFor="unit">Unidade de medida</Label>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UN">UN</SelectItem>
                    <SelectItem value="KG">KG</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="M²">M²</SelectItem>
                    <SelectItem value="M³">M³</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="GL">GL</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <InputError error={errors.unit?.message?.toString()} />
          </div>

          <div>
            <Label htmlFor="stockQuantity">Estoque</Label>
            <Input
              placeholder="Insira a quantidade em estoque"
              type="number"
              step="0.01"
              id="stockQuantity"
              {...register('stockQuantity', {
                valueAsNumber: true,
              })}
              className="mt-1"
            />
            <InputError error={errors.stockQuantity?.message?.toString()} />
          </div>
        </div>
      </div>

      {/* Gerenciar preço */}
      <div className="border-primary flex flex-col gap-4 flex-[1] border p-6 pt-4 rounded-xl text-primary">
        <h4 className="font-medium">Gerenciar preço</h4>
        <div className="mt-2 grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="costPrice">Preço de custo</Label>
            <Input
              placeholder="0,00"
              type="number"
              step="0.01"
              id="costPrice"
              {...register('costPrice', {
                valueAsNumber: true,
              })}
              className="mt-1"
            />
            <InputError error={errors.costPrice?.message?.toString()} />
          </div>

          <div>
            <Label htmlFor="profitMargin">Margem (%)</Label>
            <Input
              placeholder="0,00%"
              type="number"
              step="0.01"
              id="profitMargin"
              {...register('profitMargin', {
                valueAsNumber: true,
              })}
              className="mt-1"
            />
            <InputError error={errors.profitMargin?.message?.toString()} />
          </div>

          <div>
            <Label htmlFor="salePrice">Preço de venda</Label>
            <Input
              placeholder="0,00"
              type="number"
              step="0.01"
              id="salePrice"
              {...register('salePrice', {
                valueAsNumber: true,
              })}
              className="mt-1 bg-gray-50"
              readOnly
            />
            <InputError error={errors.salePrice?.message?.toString()} />
          </div>

          <div>
            <Label htmlFor="profit">Lucro</Label>
            <Input
              placeholder="0,00"
              type="number"
              step="0.01"
              id="profit"
              {...register('profit', {
                valueAsNumber: true,
              })}
              className="mt-1 bg-gray-50"
              readOnly
            />
            <InputError error={errors.profit?.message?.toString()} />
          </div>
        </div>
      </div>
    </form>
  )
}
