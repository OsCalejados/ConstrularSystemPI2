'use client'

import { DiscountFormData } from '@/types/validations'
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

interface ApplyDiscountDialogProps {
  children?: React.ReactNode
  subtotal: number
  discount?: number
  onConfirm: (data: DiscountFormData) => void
}

export default function ApplyDiscountDialog({
  children,
  subtotal,
  discount,
  onConfirm,
}: ApplyDiscountDialogProps) {
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
          onSubmit={onConfirm}
          defaultValue={discount}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              type="submit"
              form="discount-form"
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
