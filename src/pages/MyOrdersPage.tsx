import { AgroMarApi } from "@/api/AgroMarApi";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatter, to } from "@/helpers";
import { useDisclousure, useFetch } from "@/hooks";
import { IOrderDetailsResponse, IOrderResponse } from "@/interfaces/order";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useRef, useState } from 'react';
import { toast } from "sonner";

export const MyOrdersPage = () => {
  const { data } = useFetch<IOrderResponse[]>('/orders');
  const { isOpen, toggleDisclosure } = useDisclousure();
  
  const [orderDetails, setOrderDetails] = useState<IOrderDetailsResponse[]>([]);
  const aditionalInfoRef = useRef<any>(null);

  const columns: ColumnDef<IOrderResponse>[] = useMemo(() => [
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
              const [response, error] = await to(AgroMarApi.get<IOrderDetailsResponse[]>(`/orders/details/${row.original.id_order}`));
              if(error) return toast.error(error.message);
              aditionalInfoRef.current = {
                comprador: `${row.original.user_ce.name} ${row.original.user_ce.lastName}`,
                total: formatter({ value: row.original.total }),
                fecha: formatter({ date: new Date(row.original.order_date), as: 'date', dateStyle: 'medium', language: 'es-ES', timeStyle: 'short' }),
              }
              setOrderDetails(response.data);
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
      <h1 className="text-center text-4xl font-bold mt-20 mb-4">Mis órdenes</h1>

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

interface DetailsModalProps {
  orderDetails: IOrderDetailsResponse[];
  isOpen: boolean;
  aditionalInfo: {
    comprador: string;
    total: string;
    fecha: string;
  }
  onClose: () => void;
}

const OrderDetailsColumns: ColumnDef<IOrderDetailsResponse>[] = [
  {
    id: "Producto",
    accessorKey: "product.description",
    header: () => <div className="text-center">Producto</div>,
    cell: ({ row }) => <div className="text-center">{row.original.product.description}</div>,
    filterFn: (row, _, filterValue) => {
      return row.original.product.description.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    id: 'Categoría',
    accessorKey: 'product.predefinedProduct.category.name',
    header: () => <div className="text-center">Categoría</div>,
    cell: ({ row }) => <div className="text-center">{row.original.product.predefinedProduct.category.name}</div>,
    filterFn: (row, _, filterValue) => {
      return row.original.product.predefinedProduct.category.name.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    id: 'Precio',
    accessorKey: 'product.price',
    header: () => <div className="text-center">Precio</div>,
    cell: ({ row }) => <div className="text-center">{formatter({ value: row.original.product.price })}</div>,
    filterFn: (row, _, filterValue) => {
      return row.original.product.price.toString().includes(filterValue.toString());
    },
  },
  {
    id: "Cantidad",
    accessorKey: "quantity",
    header: () => <div className="text-center">Cantidad</div>,
    cell: ({ row }) => <div className="text-center">{row.original.quantity}</div>,
    filterFn: (row, _, filterValue) => {
      return row.original.quantity.toString().includes(filterValue.toString());
    },
  },
  {
    id: "Subtotal",
    accessorKey: "subtotal",
    header: () => <div className="text-center">Precio</div>,
    cell: ({ row }) => <div className="text-center">{formatter({ value: row.original.subtotal })}</div>,
    filterFn: (row, _, filterValue) => {
      return row.original.subtotal.toString().includes(filterValue.toString());
    },
  },
  {
    id: "Vendedor",
    accessorKey: "product.user_ce.name",
    header: () => <div className="text-center">Vendedor</div>,
    cell: ({ row }) => <div className="text-center">{row.original.product.user_ce.name} {row.original.product.user_ce.lastName}</div>,
    filterFn: (row, _, filterValue) => {
      return row.original.product.user_ce.name.toLowerCase().includes(filterValue.toLowerCase());
    },
  }
];

export const DetailsModal = ({ orderDetails, aditionalInfo, isOpen, onClose }: DetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Detalles de la órden</DialogTitle>
          <DialogDescription>
            
            <p className="mt-3">Información del comprador</p>
            <div className="flex justify-between mt-4">
              <p>Nombre: {aditionalInfo?.comprador}</p>
              <p>Fecha: {aditionalInfo?.fecha}</p>
              <p>Total: {aditionalInfo?.total}</p>
            </div>

            <p className="mt-4">Productos Comprados</p>

            <DataTable
              columns={OrderDetailsColumns}
              data={orderDetails}
              allowedPageSizes={[5]}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
};