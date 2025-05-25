'use client'

import UpdateBalanceForm from '../forms/update-balance-form'

import { Button } from '../shadcnui/button'
import {
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
} from '@/components/shadcnui/dialog'

interface UpdateBalanceDialogProps {
  balance: number
  customerId: number
}

export default function UpdateBalanceDialog({
  balance,
  customerId,
}: UpdateBalanceDialogProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Editar saldo</DialogTitle>
      </DialogHeader>

      <UpdateBalanceForm balance={balance} customerId={customerId} />

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>

        <DialogClose asChild>
          <Button
            type="submit"
            form="balance-form"
            className="bg-button-warning hover:bg-button-warning-hover"
          >
            Salvar
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
