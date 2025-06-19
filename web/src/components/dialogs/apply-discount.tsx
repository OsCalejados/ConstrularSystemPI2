'use client'

import ApplyDiscountForm from '../forms/apply-discount-form'
import { Button } from '../shadcnui/button'
import {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  Dialog,
  DialogDescription,
} from '@/components/shadcnui/dialog'
import { useState } from 'react'

interface ApplyDiscountDialogProps {
  children?: React.ReactNode
  discount?: number
  subtotal: number
  onConfirm: (discount: number) => void
}

export default function ApplyDiscountDialog({
  children,
  subtotal,
  onConfirm,
  discount = 0,
}: ApplyDiscountDialogProps) {
  const [localDiscount, setLocalDiscount] = useState<number>(discount)

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Aplicar desconto</DialogTitle>
        </DialogHeader>

        <DialogDescription>teste</DialogDescription>
        <ApplyDiscountForm
          subtotal={subtotal}
          defaultValue={discount}
          onChange={setLocalDiscount}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              onClick={() => onConfirm(localDiscount)}
              className="bg-primary hover:bg-primary-hover"
            >
              Aplicar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
