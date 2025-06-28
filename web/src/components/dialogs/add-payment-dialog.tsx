'use client'

import { useDialog } from '@/hooks/use-dialogs'
import AddPaymentForm from '../forms/add-payment-form'

import { Button } from '../shadcnui/button'
import {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  Dialog,
} from '@/components/shadcnui/dialog'

interface AddPaymentDialogProps {
  children?: React.ReactNode
  orderId: number
  remainingAmount: number
}

export default function AddPaymentDialog({
  children,
  orderId,
  remainingAmount,
}: AddPaymentDialogProps) {
  const dialog = useDialog()

  return (
    <Dialog {...dialog.props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar pagamento</DialogTitle>
        </DialogHeader>

        {/* Form */}
        <AddPaymentForm
          orderId={orderId}
          remainingAmount={remainingAmount}
          onSuccess={dialog.dismiss}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>

          {/* <DialogClose asChild> */}
          <Button
            type="submit"
            form="payment-form"
            className="bg-primary hover:bg-primary-hover"
          >
            Adicionar
          </Button>
          {/* </DialogClose> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
