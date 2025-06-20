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
  variant: 'customer' | 'order' | 'movement'
}

export default function DeleteDialog({
  onConfirm,
  variant,
}: DeleteDialogProps) {
  const getTitle = () => {
    switch (variant) {
      case 'customer':
        return 'Tem certeza que deseja excluir esse cliente?'
      case 'order':
        return 'Tem certeza que deseja excluir esse pedido?'
      case 'movement':
        return 'Tem certeza que deseja excluir essa movimentação?'
      default:
        return 'Tem certeza que deseja excluir este item?'
    }
  }

  const getDescription = () => {
    switch (variant) {
      case 'customer':
        return 'Esta ação não pode ser desfeita. Isso vai excluir o cliente e todos seus pedidos permanentemente.'
      case 'order':
        return 'Esta ação não pode ser desfeita. Isso vai excluir o pedido permanentemente.'
      case 'movement':
        return 'Esta ação não pode ser desfeita. Isso vai excluir a movimentação permanentemente.'
      default:
        return 'Esta ação não pode ser desfeita.'
    }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{getTitle()}</AlertDialogTitle>
        <AlertDialogDescription>{getDescription()}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={(event) => event.stopPropagation()}>
          Cancelar
        </AlertDialogCancel>
        <AlertDialogAction
          className="bg-danger hover:bg-danger-hover"
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
