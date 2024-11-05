import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { formatter } from "@/helpers"
import { PencilLine, Trash2 } from "lucide-react"

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
]

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

const columns: ColumnDef<Payment>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      return <div className="text-center font-medium">{formatter({ value: amount })}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const rowData = row.original

      return (
        // <DropdownMenu>
        //   <DropdownMenuTrigger asChild>
        //     <Button variant="ghost" className="h-8 w-8 p-0">
        //       <span className="sr-only">Abrir Menú</span>
        //       <DotsHorizontalIcon className="h-4 w-4" />
        //     </Button>
        //   </DropdownMenuTrigger>
        //   <DropdownMenuContent align="end">
        //     <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        //     <DropdownMenuItem
        //       onClick={() => navigator.clipboard.writeText(payment.id)}
        //     >
        //       Copy payment ID
        //     </DropdownMenuItem>
        //     <DropdownMenuSeparator />
        //     <DropdownMenuItem>View customer</DropdownMenuItem>
        //     <DropdownMenuItem>View payment details</DropdownMenuItem>
        //   </DropdownMenuContent>
        // </DropdownMenu>
        <ol className="flex items-center space-x-2 text-center justify-center">
          <li>
            <Button variant="ghost" className="h-8 w-8 p-0"
              onClick={() => console.log(rowData.id)}
            >
              <PencilLine className="h-4 w-4" />
            </Button>
          </li>

          <li>
            <Button variant="ghost" className="h-8 w-8 p-0"
              onClick={() => console.log(rowData.id)}
            >
              <Trash2 className="h-4 w-4 text-rose-400" />
            </Button>
          </li>
        </ol>
      )
    },
  },
]

export function AdminPage() {

  return (
    <div className="container mx-auto mt-12">

      <DataTable
        columns={columns}
        data={data}
        createText="Nuevo producto"
        onCreate={console.log}
      />
    </div>
  )
}


// interface PaginationProps<TData> {
//   table: ITable<TData>;
// }

// const Pagination = <TData,>({ table }: PaginationProps<TData>) => {
//   return (
//     <div className="flex items-center justify-end space-x-2 py-4">
//       <div className="flex-1 text-sm text-muted-foreground">
//         {table.getFilteredSelectedRowModel().rows.length} of{" "}
//         {table.getFilteredRowModel().rows.length} row(s) selected.
//       </div>
//       <div className="space-x-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           Previous
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   )
// }