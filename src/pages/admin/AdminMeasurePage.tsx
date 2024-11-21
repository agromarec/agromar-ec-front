import { AgroMarApi } from "@/api/AgroMarApi";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderBtn } from "@/components/ui/LoaderBtn";
import { Textarea } from "@/components/ui/textarea";
import { to } from "@/helpers";
import { useFetch } from "@/hooks";
import { IUnitOfMeasure } from "@/interfaces/predifined-product";
import useUiStore from "@/store/uiStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import { PencilLine, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


export const AdminMeasurePage = () => {
  const { data, refetch } = useFetch<any>('/unit-of-mesures');
  const setDialogOpts = useUiStore(state => state.setDialogOptions);
  const [isOpenCreateCategoryModal, setIsOpenCreateCategoryModal] = useState(false);
  const UnitOfMeasureToUpdateRef = useRef<IUnitOfMeasure | null>(null);

  const columns: ColumnDef<IUnitOfMeasure>[] = useMemo(() => (
    [
      {
        id: "Nombre",
        accessorKey: "name",
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
        cell: ({ row }) => <div className="text-center">{row.original.name}</div>,
      },
      {
        id: "Abreviatura",
        accessorKey: "abreviature",
        header: ({ column }) => {
          return (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Abreviatura
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
        cell: ({ row }) => <div className="text-center">{row.original.abreviature}</div>,
      },
      {
        id: "Estado",
        accessorKey: "status",
        header: ({ column }) => {
          return (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Estado
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
        cell: ({ row }) => <div className="text-center">{row.original.status}</div>,
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
                  onClick={() => {
                    UnitOfMeasureToUpdateRef.current = rowData;
                    setIsOpenCreateCategoryModal(true)
                  }}
                >
                  <PencilLine className="h-4 w-4" />
                </Button>
              </li>

              <li>
                <Button variant="ghost" className="h-8 w-8 p-0"
                  onClick={() => setDialogOpts({
                    title: '¿Estás seguro?',
                    description: 'Estás seguro que deseas eliminar este registro? Esta acción no se puede deshacer',
                    open: true,
                    isLoading: false,
                    btnAcceptText: 'Eliminar',
                    btnCancelText: 'Cancelar',
                    onAccept: async () => {
                      setDialogOpts(state => ({ ...state, isLoading: true }));
                      const [, error] = await to(AgroMarApi.delete(`/unit-of-mesures/${rowData.id}`));
                      if (error) {
                        toast.error(error.message);
                        setDialogOpts(state => ({ ...state, isLoading: false, open: false }));
                        return;
                      }
                      refetch();
                      toast.success('Categoría eliminado exitosamente');
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

  return (
    <div className="container mx-auto my-12">
      <h1 className="text-center text-4xl font-bold mt-16 mb-4">Unidad de Medida</h1>

      <DataTable
        columns={columns}
        data={data || []}
        createText="Nueva unidad de medida"
        onCreate={() => setIsOpenCreateCategoryModal(true)}
      />

      <CreateUnitOfMeasureModal
        measure={UnitOfMeasureToUpdateRef.current}
        isOpen={isOpenCreateCategoryModal}
        onClose={() => {
          UnitOfMeasureToUpdateRef.current = null;
          setIsOpenCreateCategoryModal(false);
        }}
        onSuccess={() => {
          refetch();
          UnitOfMeasureToUpdateRef.current = null;
          setIsOpenCreateCategoryModal(false);
        }}
      />
    </div>
  )
};

interface Props {
  measure: IUnitOfMeasure | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateUnitOfMeasureModal = ({ isOpen, onClose, onSuccess, measure }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Nueva Unidad de Medida</DialogTitle>
        </DialogHeader>
        <CreateOrUpdateMeasureForm onSuccess={onSuccess} initialValues={measure} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
};

interface CreateOrUpdateMeasureFormProps {
  initialValues: IUnitOfMeasure | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(1),
  abreviature: z.string().min(1),
});

const CreateOrUpdateMeasureForm = (props: CreateOrUpdateMeasureFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: props.initialValues ? {
      name: props.initialValues.name,
      abreviature: props.initialValues.abreviature,
    } : {
      name: "",
      abreviature: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const [, error] = props.initialValues ? await to<AxiosResponse<IUnitOfMeasure>>(AgroMarApi.patch(`/unit-of-mesures/${props.initialValues.id}`, values)) : await to<AxiosResponse<IUnitOfMeasure>>(AgroMarApi.post('/unit-of-mesures', values));

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(`Producto ${props.initialValues ? 'actualizado' : 'creado'} exitosamente`);
    props.onSuccess?.();
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nombre" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="abreviature"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Abreviatura</FormLabel>
                <FormControl>
                  <Textarea  {...field} className="default-input resize-none" placeholder="Abreviatura" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between items-center">
          <Button disabled={form.formState.isSubmitting} variant={'secondary'} onClick={props.onCancel} type="button">
            Cancelar
          </Button>

          <LoaderBtn isLoading={form.formState.isSubmitting} type="submit" disabled={form.formState.isSubmitting}>
            {props.initialValues ? 'Actualizar Unidad de Medida' : 'Crear Unidad de Medida'}
          </LoaderBtn>
        </div>
      </form>
    </Form>
  )
}