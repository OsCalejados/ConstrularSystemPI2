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
import { PlusCircle } from '@phosphor-icons/react/dist/ssr'
import InputError from '../ui/input-error'
import { MeasureUnit } from '@/enums/measure-unit'
import { MovementFormData } from '@/types/validations'

interface MovementFormProps {
  onSubmit: (data: MovementFormData) => Promise<void>
  readOnly?: boolean
}

export default function MovementForm({
  onSubmit,
  readOnly = false,
}: MovementFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useFormContext<MovementFormData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  })

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
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="ENTRADA/SAÍDA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Saída">Saída</SelectItem>
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
        {fields.map((field, idx) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-2"
          >
            <div className="md:col-span-5">
              <Label>Nome *</Label>
              <Input
                placeholder="Nome do produto"
                {...register(`products.${idx}.name` as const)}
                readOnly={readOnly}
              />
              <InputError error={errors.products?.[idx]?.name?.toString()} />
            </div>
            <div className="md:col-span-2">
              <Label>Unidade</Label>
              <Controller
                name={`products.${idx}.unit` as const}
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={readOnly}
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="UN" />
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
              <InputError error={errors.products?.[idx]?.unit?.toString()} />
            </div>
            <div className="md:col-span-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                min={1}
                {...register(`products.${idx}.quantity` as const, {
                  valueAsNumber: true,
                })}
                readOnly={readOnly}
              />
              <InputError
                error={errors.products?.[idx]?.quantity?.toString()}
              />
            </div>
            <div className="md:col-span-1 flex items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(idx)}
                disabled={readOnly}
              >
                <span className="sr-only">Remover</span>
                🗑️
              </Button>
            </div>
          </div>
        ))}
        <div className="flex items-center mt-2">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center gap-2"
            onClick={() => append({ name: '', unit: 'UN', quantity: 1 })}
            disabled={readOnly}
          >
            <PlusCircle size={20} />
            Inserir produto
          </Button>
        </div>
      </div>
    </form>
  )
}
