import { AgroMarApi } from "@/api/AgroMarApi";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { CreateUserModal } from "@/components/users/CreateUserModal";
import { Roles } from "@/config/globalVariables";
import { to } from "@/helpers";
import { useFetch } from "@/hooks";
import { IUserResponse } from "@/interfaces/users";
import useUiStore from "@/store/uiStore";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import { PencilLine, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from 'react';
import { toast } from "sonner";

export const AdminUsersPage = () => {
  const { data, refetch } = useFetch<IUserResponse[]>('/users');
  const setDialogOpts = useUiStore(state => state.setDialogOptions);
  const [isOpenCreateUserModal, setIsOpenCreateUserModal] = useState(false);
  const userToUpdateRef = useRef<IUserResponse | null>(null);

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
        id: "Celular",
        accessorKey: "phone",
        cell: ({ row }) => {
          return <div className="text-center font-medium">{row.original.phone}</div>
        },
        header: ({ column }) => {
          return (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Celular
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
      },
      {
        id: "Dirección",
        accessorKey: "address",
        cell: ({ row }) => {
          return <div className="text-center font-medium">{row.original.address}</div>
        },
        header: ({ column }) => {
          return (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Dirección
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
          const rowData = row.original;
          return (
            <ol className="flex items-center space-x-2 text-center justify-center">
              <li>
                <Button variant="ghost" className="h-8 w-8 p-0"
                  onClick={() => {
                    userToUpdateRef.current = rowData;
                    setIsOpenCreateUserModal(true);
                  }}
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
                    onAccept: async () => {
                      setDialogOpts(state => ({ ...state, isLoading: true }));
                      const [, error] = await to(AgroMarApi.delete(`/users/${rowData.id}`));
                      if (error) return toast.error(error.message);
                      refetch();
                      toast.success('Usuario eliminado exitosamente');
                      setDialogOpts(state => ({ ...state, isLoading: false, open: false }));
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

  const onSubmit = async (data: any) => {
    const newUser = {
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      paypalEmail: data.paypalEmail,
      paisId: Number(data.paisId),
      cantonId: Number(data.cantonId) || null,
      password: data.password,
      roles: [
        Roles.COMPRADOR,
        Roles.VENDEDOR,
      ]
    };

    const [, error] = userToUpdateRef.current ? await to<AxiosResponse<any>>(AgroMarApi.patch(`/users/${userToUpdateRef.current.id}`, newUser)) : await to<AxiosResponse<any>>(AgroMarApi.post('/users/create', newUser));

    if (error) return toast.error(error.message);

    toast.success('Usuario creado exitosamente');

    refetch();
    userToUpdateRef.current = null;
    setIsOpenCreateUserModal(false);
  }

  return (
    <div className="container mx-auto my-12">
      <h1 className="text-center text-4xl font-bold mt-20 mb-4">Usuarios</h1>

      <DataTable
        columns={columns}
        data={data || []}
        createText="Nuevo usuario"
        onCreate={() => setIsOpenCreateUserModal(true)}
      />

      <CreateUserModal
        isOpen={isOpenCreateUserModal}
        user={userToUpdateRef.current}
        onClose={() => {
          userToUpdateRef.current = null;
          setIsOpenCreateUserModal(false)
        }}
        onSubmit={onSubmit}
      />
    </div>
  )
};
