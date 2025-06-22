import { useFormContext, Controller, useFieldArray } from 'react-hook-form'
import { Input } from '../shadcnui/input'
import { Label } from '../shadcnui/label'
import { Button } from '../shadcnui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../shadcnui/select'
import { PlusCircleIcon, TrashIcon } from '@phosphor-icons/react/dist/ssr'
import InputError from '../ui/input-error'
import { MovementFormData } from '@/types/validations'
import { getProducts } from '@/services/product-service'
import { Product } from '@/types/product'
import { useQuery } from '@tanstack/react-query'
import { parseNumber } from '@/utils/parse/number'
import { MovementType } from '@/enums/movement-type'

interface MovementFormProps {
  onSubmit: (data: MovementFormData) => Promise<void>
  readOnly?: boolean
}

export default function MovementForm({
  onSubmit,
  readOnly = false,
}: MovementFormProps) {
  const {
    watch,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useFormContext<MovementFormData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const watchedItems = watch('items')

  if (!products) return null

  return (
    <form
      id="movement-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      {/* Detalhes */}
      <div className="border p-6 pt-4 rounded-xl">
        <h4 className="font-medium mb-4">Detalhes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              placeholder="Ex: Nota Tramontina"
              id="description"
              {...register('description')}
              className="mt-1"
              readOnly={readOnly}
            />
            <InputError error={errors.description?.message?.toString()} />
          </div>
          <div>
            <Label htmlFor="type">Tipo</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={readOnly}
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="mt-1 disabled:opacity-100 disabled:cursor-text">
                    <SelectValue placeholder="ENTRADA/SAÍDA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MovementType.IN}>Entrada</SelectItem>
                    <SelectItem value={MovementType.OUT}>Saída</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <InputError error={errors.type?.message?.toString()} />
          </div>
        </div>
      </div>

      {/* Produtos */}
      <div className="border p-6 pt-4 rounded-xl">
        <h4 className="font-medium mb-4">Produtos</h4>
        <div className="px-1 mt-2 pb-1 flex flex-1 flex-col gap-4 overflow-y-auto">
          {fields.map((field, idx) => {
            const productId = watchedItems?.[idx]?.productId
            const selectedProduct = products.find(
              (p) => p.id === Number(productId),
            )

            return (
              <div key={field.id} className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor={`productId.${idx}`}>Produto *</Label>
                  <Controller
                    name={`items.${idx}.productId`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        name={field.name}
                        value={field.value?.toString()}
                        disabled={readOnly}
                        onValueChange={(value) => {
                          field.onChange(Number(value))
                        }}
                      >
                        <SelectTrigger className="mt-1 disabled:opacity-100 disabled:cursor-text">
                          <SelectValue placeholder="Selecione o produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem
                              key={product.id}
                              value={product.id.toString()}
                            >
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <InputError
                    error={errors.items?.[idx]?.productId?.message?.toString()}
                  />
                </div>

                <div className="w-32">
                  <Label htmlFor={`unit.${idx}`}>Unidade</Label>
                  <Input
                    disabled
                    id={`unit.${idx}`}
                    value={selectedProduct?.unit ?? ''}
                    className="mt-1 bg-gray-100 disabled:opacity-100 disabled:cursor-text"
                    placeholder="Unidade"
                  />
                </div>

                <div className="w-32">
                  <Label>Quantidade</Label>
                  <Controller
                    name={`items.${idx}.quantity`}
                    control={control}
                    disabled={readOnly}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="mt-1 disabled:opacity-100 disabled:cursor-text"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const parsed = parseNumber(e.target.value)
                          field.onChange(parsed)
                        }}
                      />
                    )}
                  />
                  <InputError
                    error={errors.items?.[idx]?.quantity?.message?.toString()}
                  />
                </div>

                {fields.length > 1 && (
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      className="h-10 w-10 p-0 mt-7"
                      onClick={() => remove(idx)}
                    >
                      <TrashIcon size={24} className="text-terciary" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex items-center mt-2">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center gap-2"
            onClick={() =>
              append({ productId: '' as unknown as number, quantity: 1 })
            }
            disabled={readOnly}
          >
            <PlusCircleIcon size={20} />
            Inserir produto
          </Button>
        </div>
      </div>
    </form>
  )
}
