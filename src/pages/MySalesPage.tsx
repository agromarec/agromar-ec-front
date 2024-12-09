import { useDisclousure, useFetch } from "@/hooks";
import { IOrderDetailsResponse, ISalesResponse } from "@/interfaces/order";
import { DetailsModal } from "./MyOrdersPage";
import { useMemo, useRef, useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { formatter } from "@/helpers";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";


export const MySalesPage = () => {
  const { data } = useFetch<ISalesResponse[]>('orders/sales');
  const { isOpen, toggleDisclosure } = useDisclousure();
  
  const [orderDetails, setOrderDetails] = useState<IOrderDetailsResponse[]>([]);
  const aditionalInfoRef = useRef<any>(null);

  const columns: ColumnDef<ISalesResponse>[] = useMemo(() => [
    {
      id: "Id",
      accessorKey: "id_order",
      header: () => <div className="text-center">Id</div>,
      cell: ({ row }) => <div className="text-center">{row.original.id_order}</div>,
      filterFn: (row, _, filterValue) => {
        return row.original.id_order.toString().includes(filterValue.toString());
      },
    },
    {
      id: "Comprador",
      accessorKey: "user_ce.name",
      header: () => <div className="text-center">Comprador</div>,
      cell: ({ row }) => <div className="text-center">{row.original.user_ce.name} {row.original.user_ce.lastName}</div>,
      filterFn: (row, _, filterValue) => {
        const concatName = row.original.user_ce.name + row.original.user_ce.lastName;
        return concatName.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      id: "Total",
      accessorKey: "total",
      header: () => <div className="text-center">Total</div>,
      cell: ({ row }) => <div className="text-center">{formatter({ value: row.original.total })}</div>,
      filterFn: (row, _, filterValue) => {
        return row.original.total.toString().includes(filterValue.toString());
      },
    },
    {
      id: "Fecha",
      accessorKey: "order_date",
      header: () => <div className="text-center">Fecha</div>,
      cell: ({ row }) => <div className="text-center">{formatter({ date: new Date(row.original.order_date), as: 'date', dateStyle: 'medium', language: 'es-ES', timeStyle: 'short' })}</div>,
      enableColumnFilter: false,
    },
    {
      id: "see-more",
      enableHiding: false,
      header: () => <div className="text-center">Acciones</div>,
      cell: ({ row }) => {
        return (
          <Button variant="link" className="h-8 w-8 p-0 m-auto flex text-indigo-500" size="sm" color="primary"
            onClick={async () => {
              const orderDetails = row.original.order_detail;
              aditionalInfoRef.current = {
                comprador: `${row.original.user_ce.name} ${row.original.user_ce.lastName}`,
                total: formatter({ value: row.original.total }),
                fecha: formatter({ date: new Date(row.original.order_date), as: 'date', dateStyle: 'medium', language: 'es-ES', timeStyle: 'short' }),
              }
              setOrderDetails(orderDetails);
              toggleDisclosure();
            }}
          >
            Ver detalles
          </Button>
        )
      },
    }
  ], [toggleDisclosure]);

  return (
    <div className="container mx-auto my-12">
      <h1 className="text-center text-4xl font-bold mt-20 mb-4">Mis ventas</h1>

      <DataTable
        columns={columns}
        data={data || []}
      />

      <DetailsModal
        orderDetails={orderDetails}
        aditionalInfo={aditionalInfoRef.current}
        isOpen={isOpen}
        onClose={toggleDisclosure}
      />
    </div>
  )
};

