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
import { MeasureUnit } from '@/enums/measure-unit'

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>
  readOnly?: boolean
}

export default function ProductForm({
  onSubmit,
  readOnly = false,
}: ProductFormProps) {
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
              readOnly={readOnly}
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
              readOnly={readOnly}
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
                  disabled={readOnly}
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(MeasureUnit).map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
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
              readOnly={readOnly}
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
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                R$
              </span>
              <Input
                placeholder="0,00"
                type="number"
                step="0.01"
                id="costPrice"
                readOnly={readOnly}
                {...register('costPrice', {
                  valueAsNumber: true,
                })}
                className="pl-8"
              />
            </div>
            <InputError error={errors.costPrice?.message?.toString()} />
          </div>

          <div>
            <Label htmlFor="profitMargin">Margem (%)</Label>
            <div className="relative mt-1">
              <Input
                placeholder="0,00"
                type="number"
                step="0.01"
                id="profitMargin"
                readOnly={readOnly}
                {...register('profitMargin', {
                  valueAsNumber: true,
                })}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                %
              </span>
            </div>
            <InputError error={errors.profitMargin?.message?.toString()} />
          </div>

          <div>
            <Label htmlFor="salePrice">Preço de venda</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                R$
              </span>
              <Input
                placeholder="0,00"
                type="number"
                step="0.01"
                id="salePrice"
                readOnly={readOnly}
                {...register('salePrice', {
                  valueAsNumber: true,
                })}
                className="pl-8 bg-gray-50"
              />
            </div>
            <InputError error={errors.salePrice?.message?.toString()} />
          </div>

          <div>
            <Label htmlFor="profit">Lucro</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                R$
              </span>
              <Input
                placeholder="0,00"
                type="number"
                step="0.01"
                id="profit"
                {...register('profit', {
                  valueAsNumber: true,
                })}
                className="pl-8 bg-gray-50"
                readOnly={readOnly}
              />
            </div>
            <InputError error={errors.profit?.message?.toString()} />
          </div>
        </div>
      </div>
    </form>
  )
}
