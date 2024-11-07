import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { formatter } from "@/helpers"
import { PencilLine, Trash2 } from "lucide-react"
import { useFetch } from "@/hooks";
import { IProduct, IProductResponse } from "@/interfaces/products";
import { useState } from "react";
import { CreateProductModal } from "@/components/products/CreateProductModal";

const columns: ColumnDef<IProduct>[] = [
  {
    id: "Descripción",
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Descripción
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.original.description}</div>,
  },
  {
    id: "Producto Padre",
    accessorKey: "predefinedProduct.name",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Producto Padre
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.original.predefinedProduct.name}</div>
    ),
  },
  {
    id: "Categoría",
    accessorKey: "predefinedProduct.category.name",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Categoría
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.original.predefinedProduct.category.name}</div>
    ),
  },
  {
    id: "Imágen",
    accessorKey: "image",
    header: "Imágen",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.image}</div>
    ),
    enableColumnFilter: false,
  },
  {
    id: "Precio",
    accessorKey: "price",
    cell: ({ row }) => {
      return <div className="text-center font-medium">{formatter({ value: row.original.price })}</div>
    },
    filterFn: (row, _, filterValue) => {
      const fixedRowValue = row.original.price.toFixed(2);
      if(`${filterValue}`.startsWith('$')) return fixedRowValue.includes(filterValue.replace('$', ''));
      return fixedRowValue.includes(filterValue.toString());
    },
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Precio
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
  {
    id: "Stock",
    accessorKey: "stock",
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.original.stock}</div>
    },
    filterFn: (row, _, filterValue) => {
      return row.original.stock.toString().includes(filterValue.toString());
    },
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stock
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const rowData = row.original

      return (
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
];

export const AdminProductsPage = () => {
  const { data } = useFetch<IProductResponse>('/products?page=1&size=99999');
  const [isOpenCreateProductModal, setIsOpenCreateProductModal] = useState(false);

  return (
    <div className="container mx-auto mt-12">
      <h1 className="text-center text-4xl font-bold mt-20 mb-4">Productos</h1>

      <DataTable
        columns={columns}
        data={data?.products || []}
        createText="Nuevo producto"
        onCreate={() => setIsOpenCreateProductModal(true)}
      />

      <CreateProductModal 
        isOpen={isOpenCreateProductModal}
        onClose={() => setIsOpenCreateProductModal(false)}
      />
    </div>
  )
};
