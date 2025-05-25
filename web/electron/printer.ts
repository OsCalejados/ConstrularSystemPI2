import { Order } from '@/types/order'
import {
  PosPrintData,
  PosPrinter,
  PosPrintOptions,
} from '@plick/electron-pos-printer'
import { ipcMain } from 'electron'

export const setupPrinter = () => {
  const options: PosPrintOptions = {
    preview: true,
    margin: '0px',
    copies: 1,
    printerName: 'POS-80C',
    pageSize: '80mm',
    boolean: true,
    // silent: true,
  }

  ipcMain.on('print-order', async (event, data: Order) => {
    const printData: PosPrintData[] = []

    const date = new Date(data.createdAt)
    const formattedDate = date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

    const formattedTime = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    // Título do recibo
    printData.push({
      type: 'text',
      value: `Recibo do Pedido ${data.id}`,
      style: {
        fontWeight: '700',
        textAlign: 'center',
        fontSize: '14px',
      },
    })

    // Data e hora do pedido
    printData.push({
      type: 'text',
      value: `Data: ${formattedDate} ${formattedTime}`,
      style: {
        fontWeight: '500',
        textAlign: 'center',
        fontSize: '12px',
      },
    })

    printData.push({
      type: 'divider',
      style: {
        margin: '8px 0',
      },
    })

    // Informações do Cliente
    printData.push({
      type: 'text',
      value: `Cliente: ${data.customer.name}`,
      style: {
        fontWeight: '500',
        textAlign: 'left',
        fontSize: '12px',
      },
    })

    if (data.customer.phone) {
      printData.push({
        type: 'text',
        value: `Telefone: ${data.customer.phone}`,
        style: {
          fontWeight: '500',
          textAlign: 'left',
          fontSize: '12px',
        },
      })
    }

    if (data.customer.email) {
      printData.push({
        type: 'text',
        value: `Email: ${data.customer.email}`,
        style: {
          fontWeight: '500',
          textAlign: 'left',
          fontSize: '12px',
        },
      })
    }

    printData.push({
      type: 'divider',
      style: {
        margin: '8px 0',
      },
    })

    // Itens do Pedido
    printData.push({
      type: 'text',
      value: `Itens do Pedido:`,
      style: {
        fontWeight: '700',
        textAlign: 'left',
        fontSize: '12px',
      },
    })

    const itemsTable = {
      type: 'table',
      // style the table
      style: {
        border: '1px solid #ddd',
        fontFamily: 'sans-serif',
        marginTop: '8px',
      },
      // list of the columns to be rendered in the table header
      tableHeader: [
        { type: 'text', value: 'Qtd' },
        { type: 'text', value: 'Un' },
        { type: 'text', value: 'Produto' },
      ],
      // multi dimensional array depicting the rows and columns of the table body
      tableBody: data.items.map((item) => [
        { type: 'text', value: item.quantity.toString() },
        { type: 'text', value: item.unit },
        { type: 'text', value: item.name },
      ]),
      // list of rows to be rendered in the table footer
      tableFooter: [],
      // custom style for the table header
      tableHeaderStyle: {
        border: '0.5px solid #ddd',
      },
      // custom style for the table body
      tableBodyStyle: { border: '0.5px solid #ddd' },
      // custom style for the table footer
      tableFooterStyle: {},
      // custom style for the header cells
      tableHeaderCellStyle: {
        textAlign: 'left',
        padding: '4px 6px',
      },
      // custom style for the body cells
      tableBodyCellStyle: {
        textAlign: 'left',
        padding: '10px 6px',
      },
      // custom style for the footer cells
      tableFooterCellStyle: {},
    } as PosPrintData

    printData.push(itemsTable)

    printData.push({
      type: 'divider',
      style: {
        margin: '8px 0',
      },
    })

    // Nota adicional, se houver
    if (data.notes) {
      printData.push({
        type: 'text',
        value: `Notas: ${data.notes}`,
        style: {
          fontWeight: '400',
          textAlign: 'left',
          fontSize: '12px',
        },
      })
    }

    PosPrinter.print(printData, options)
      .then(console.log)
      .catch((error) => {
        console.error(error)
      })
  })
}
