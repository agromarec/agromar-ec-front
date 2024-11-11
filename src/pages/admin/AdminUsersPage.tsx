import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks";
import { IUserResponse } from "@/interfaces/users";
import useUiStore from "@/store/uiStore";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { PencilLine, Trash2 } from "lucide-react";
import { useMemo } from "react";

export const AdminUsersPage = () => {
  const { data } = useFetch<IUserResponse[]>('/users');
  const setDialogOpts = useUiStore(state => state.setDialogOptions);

  const columns: ColumnDef<IUserResponse>[] = useMemo(() => (
    [
      {
        id: "Nombre",
        accessorKey: "name",
        cell: ({ row }) => {
          return <div className="text-center font-medium">{row.original.name}</div>
        },
        header: ({ column }) => {
          return (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Nombre
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
      },
      {
        id: "Apellido",
        accessorKey: "lastName",
        cell: ({ row }) => {
          return <div className="text-center font-medium">{row.original.lastName}</div>
        },
        header: ({ column }) => {
          return (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Apellido
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
      },
      {
        id: "Email",
        accessorKey: "email",
        cell: ({ row }) => {
          return <div className="text-center font-medium">{row.original.email}</div>
        },
        header: ({ column }) => {
          return (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Email
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
                  // onClick={() => {
                  //   productToUpdateRef.current = rowData;
                  //   setIsOpenCreateProductModal(true)
                  // }}
                >
                  <PencilLine className="h-4 w-4" />
                </Button>
              </li>

              <li>
                <Button variant="ghost" className="h-8 w-8 p-0"
                  onClick={() => setDialogOpts({
                    title: '¿Estás seguro?',
                    description: 'Estás seguro que deseas eliminar este producto? Esta acción no se puede deshacer',
                    open: true,
                    isLoading: false,
                    btnAcceptText: 'Eliminar',
                    btnCancelText: 'Cancelar',
                    // onClose: () => setDialogOpts({ open: false }),
                    onAccept: () => {
                      console.log(rowData.id);
                      setDialogOpts(state => ({ ...state, isLoading: true }));
                    },
                  })}
                >
                  <Trash2 className="h-4 w-4 text-rose-400" />
                </Button>
              </li>
            </ol>
          )
        },
      },
    ]
  ), []);

  return (
    <div className="container mx-auto my-12">
      <h1 className="text-center text-4xl font-bold mt-20 mb-4">Usuarios</h1>

      <DataTable
        columns={columns}
        data={data || []}
        createText="Nuevo usuario"
        // onCreate={() => setIsOpenCreateProductModal(true)}
      />
    </div>
  )
};
