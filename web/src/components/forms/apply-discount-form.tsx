import { useState, useMemo } from 'react'
import { formatPercentage } from '@/utils/format/format-percentage'
import { formatCurrency } from '@/utils/format/format-currency'
import { percentageMask } from '@/utils/mask/percentage'
import { parseCurrency } from '@/utils/parse/currency'
import { Label } from '../shadcnui/label'
import { Input } from '../shadcnui/input'
import InputError from '../ui/input-error'

interface ApplyDiscountFormProps {
  subtotal: number
  onChange: (discount: number) => void
  defaultValue?: number
}
export default function ApplyDiscountForm({
  subtotal,
  onChange,
  defaultValue = 0,
}: ApplyDiscountFormProps) {
  const [percentageError, setPercentageError] = useState<string | null>(null)
  const [amountError, setAmountError] = useState<string | null>(null)
  const [percentage, setPercentage] = useState<number>(defaultValue)
  const [amount, setAmount] = useState<number>(
    Number(((defaultValue / 100) * subtotal).toFixed(2)),
  )

  const total = useMemo(() => subtotal - amount, [subtotal, amount])

  const handleUpdatePercentage = (percentage: number) => {
    if (percentage > 100) {
      setPercentageError('O desconto não pode ser maior que 100%.')
    } else {
      setPercentageError(null)
    }

    const newAmount = Number(((percentage / 100) * subtotal).toFixed(2))

    setAmount(newAmount)
    setPercentage(percentage)
    onChange(percentage)
  }

  const hadleUpdateAmount = (amount: number) => {
    const newPercentage =
      subtotal === 0 ? 0 : Number(((amount / subtotal) * 100).toFixed(2))

    if (newPercentage > 100) {
      setAmountError('O desconto não pode ser maior que o valor da compra.')
    } else {
      setAmountError(null)
    }

    setAmount(amount)
    setPercentage(newPercentage)
    onChange(newPercentage)
  }

  return (
    <form className="py-4">
      <div className="flex justify-between text-sm">
        <h4>Subtotal</h4>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <h4>Total</h4>
        <span>{formatCurrency(total)}</span>
      </div>

      <div>
        <div className="mt-4 grid grid-cols-2 items-center gap-4">
          <Label htmlFor="percentage">Desconto em %:</Label>
          <div className="col-span-1">
            <Input
              id="percentage"
              className="mt-1"
              value={percentage ? formatPercentage(percentage) : '% 0,00'}
              onChange={(e) => {
                percentageMask(e)
                const float = parseCurrency(e.target.value)
                handleUpdatePercentage(float)
              }}
            />
            <InputError error={percentageError ?? undefined} />
          </div>
        </div>

        <div className="grid grid-cols-2 items-center gap-4">
          <Label htmlFor="amount">Desconto em R$:</Label>
          <div className="col-span-1">
            <Input
              id="amount"
              className="mt-1"
              value={amount ? formatCurrency(amount) : 'R$ 0,00'}
              onChange={(e) => {
                const float = parseCurrency(e.target.value)
                hadleUpdateAmount(float)
              }}
            />
            <InputError error={amountError ?? undefined} />
          </div>
        </div>
      </div>
    </form>
  )
}
