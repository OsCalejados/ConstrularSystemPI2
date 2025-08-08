import InputError from '../ui/input-error'

import { useFormContext, Controller, useWatch } from 'react-hook-form'
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
import { useCallback, useEffect, useRef } from 'react'
import { MeasureUnit } from '@/enums/measure-unit'
import { formatCurrency } from '@/utils/format/format-currency'
import { parseCurrency } from '@/utils/parse/currency'
import { percentageMask } from '@/utils/mask/percentage'
import { formatPercentage } from '@/utils/format/format-percentage'

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>
  readOnly?: boolean
}

type EditableField =
  | 'profitMargin'
  | 'salePrice'
  | 'profit'
  | 'costPrice'
  | null

export default function ProductForm({
  onSubmit,
  readOnly = false,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<ProductFormData>()

  const [costPrice, profitMargin, salePrice, profit] = useWatch({
    control,
    name: ['costPrice', 'profitMargin', 'salePrice', 'profit'],
  })

  const lastEditedRef = useRef<EditableField>(null)

  const markEdited = (field: EditableField) => {
    lastEditedRef.current = field
  }

  const updateIfDifferent = useCallback(
    (name: keyof ProductFormData, value: number) => {
      const current = Number(getValues(name))
      const diff =
        (current ?? 0) === 0
          ? Math.abs(value) > 1e-9
          : Math.abs(((current ?? 0) - value) / (current || 1)) > 1e-9
      if (diff) {
        setValue(name, value, {
          shouldDirty: true,
          shouldTouch: false,
          shouldValidate: false,
        })
      }
    },
    [getValues, setValue],
  )

  useEffect(() => {
    const last = lastEditedRef.current
    const c = costPrice ?? 0
    const margin = profitMargin ?? 0
    const s = salePrice ?? 0
    const p = profit ?? 0

    if (c < 0) return

    if (last === 'profitMargin' || last === 'costPrice') {
      const newProfit = c * (margin / 100)
      const newSale = c + newProfit
      updateIfDifferent('profit', newProfit)
      updateIfDifferent('salePrice', newSale)
    } else if (last === 'salePrice') {
      const newProfit = s - c
      const newMargin = c > 0 ? (newProfit / c) * 100 : 0
      updateIfDifferent('profit', newProfit)
      updateIfDifferent('profitMargin', newMargin)
    } else if (last === 'profit') {
      const newSale = c + p
      const newMargin = c > 0 ? (p / c) * 100 : 0
      updateIfDifferent('salePrice', newSale)
      updateIfDifferent('profitMargin', newMargin)
    }

    // Se last for null (primeiro render) não faz nada.
  }, [costPrice, profitMargin, salePrice, profit, updateIfDifferent])

  // Calcular preço de venda e lucro automaticamente
  // useEffect(() => {
  //   if (costPrice && profitMargin) {
  //     const profit = (costPrice * profitMargin) / 100
  //     const salePrice = costPrice + profit

  //     setValue('profit', profit)
  //     setValue('salePrice', salePrice)
  //   }
  // }, [costPrice, profitMargin, setValue])

  // useEffect(() => {
  //   if (costPrice && salePrice) {
  //     const newProfit = salePrice - costPrice
  //     const newMargin = costPrice > 0 ? (newProfit / costPrice) * 100 : 0

  //     setValue('profit', newProfit)
  //     setValue('profitMargin', newMargin)
  //   }
  // }, [salePrice, costPrice, setValue])

  // useEffect(() => {
  //   if (costPrice && profit) {
  //     const newSalePrice = costPrice + profit
  //     const newMargin = costPrice > 0 ? (profit / costPrice) * 100 : 0

  //     setValue('salePrice', newSalePrice)
  //     setValue('profitMargin', newMargin)
  //   }
  // }, [profit, costPrice, setValue])

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
            <Label htmlFor="brand">Marca *</Label>
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
                  <SelectTrigger className="mt-1 disabled:opacity-100 disabled:cursor-text">
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
            <Controller
              name="costPrice"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="mt-1"
                  readOnly={readOnly}
                  value={field.value ? formatCurrency(field.value) : 'R$ 0,00'}
                  onChange={(e) => {
                    const float = parseCurrency(e.target.value)
                    markEdited('costPrice')
                    field.onChange(float)
                  }}
                />
              )}
            />
            <InputError error={errors.costPrice?.message?.toString()} />
          </div>

          <div>
            <Label htmlFor="profitMargin">Margem (%)</Label>
            <Controller
              name="profitMargin"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="mt-1"
                  readOnly={readOnly}
                  value={field.value ? formatPercentage(field.value) : '% 0,00'}
                  onChange={(e) => {
                    percentageMask(e)
                    const float = parseCurrency(e.target.value)
                    markEdited('profitMargin')
                    field.onChange(float)
                  }}
                />
              )}
            />
            <InputError error={errors.profitMargin?.message?.toString()} />
          </div>

          <div>
            <Label htmlFor="salePrice">Preço de venda</Label>
            <Controller
              name="salePrice"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="mt-1"
                  readOnly={readOnly}
                  value={field.value ? formatCurrency(field.value) : 'R$ 0,00'}
                  onChange={(e) => {
                    const float = parseCurrency(e.target.value)
                    markEdited('salePrice')
                    field.onChange(float)
                  }}
                />
              )}
            />
            <InputError error={errors.salePrice?.message?.toString()} />
          </div>

          <div>
            <Label htmlFor="profit">Lucro</Label>
            <Controller
              name="profit"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="mt-1"
                  readOnly={readOnly}
                  value={field.value ? formatCurrency(field.value) : 'R$ 0,00'}
                  onChange={(e) => {
                    const float = parseCurrency(e.target.value)
                    markEdited('profit')
                    field.onChange(float)
                  }}
                />
              )}
            />
            <InputError error={errors.profit?.message?.toString()} />
          </div>
        </div>
      </div>
    </form>
  )
}
