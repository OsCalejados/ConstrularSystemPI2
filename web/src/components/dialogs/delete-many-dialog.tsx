import {
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/shadcnui/alert-dialog'

interface DeleteManyDialogProps {
  onConfirm: () => void
  quantity: number
  variant: 'customer' | 'order' | 'unknown'
}

export default function DeleteManyDialog({
  onConfirm,
  quantity,
  variant,
}: DeleteManyDialogProps) {
  if (variant === 'unknown') {
    return (
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Nenhuma seleção encontrada</AlertDialogTitle>
          <AlertDialogDescription>
            Para prosseguir com a exclusão, selecione ao menos uma linha na
            tabela. Selecione os itens desejados e tente novamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="bg-button-warning hover:bg-button-warning-hover"
            onClick={(event) => event.stopPropagation()}
          >
            Voltar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    )
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {variant === 'customer'
            ? `Confirmar exclusão de ${quantity} cliente(s)?`
            : `Confirmar exclusão de ${quantity} pedido(s)?`}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {variant === 'customer'
            ? 'Esta ação não pode ser desfeita. Isso vai excluir os clientes e todos seus pedidos permanentemente.'
            : 'Esta ação não pode ser desfeita. Isso vai excluir os pedidos permanentemente.'}
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
