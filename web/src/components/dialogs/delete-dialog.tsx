import {
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/shadcnui/alert-dialog'

interface DeleteDialogProps {
  onConfirm: () => void
  variant: 'customer' | 'order'
}

export default function DeleteDialog({
  onConfirm,
  variant,
}: DeleteDialogProps) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {variant === 'customer'
            ? 'Tem certeza que deseja excluir esse cliente?'
            : 'Tem certeza que deseja excluir esse pedido?'}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {variant === 'customer'
            ? 'Esta ação não pode ser desfeita. Isso vai excluir o cliente e todos seus pedidos permanentemente.'
            : 'Esta ação não pode ser desfeita. Isso vai excluir o pedido permanentemente.'}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={(event) => event.stopPropagation()}>
          Cancelar
        </AlertDialogCancel>
        <AlertDialogAction
          className="bg-button-danger hover:bg-button-danger-hover"
          onClick={(event) => {
            event.stopPropagation()
            onConfirm()
          }}
        >
          Sim, excluir
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
