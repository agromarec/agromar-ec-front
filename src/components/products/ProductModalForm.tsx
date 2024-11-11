import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useFetch } from "@/hooks";
import { IPredifinedProductResponse } from "@/interfaces/predifined-product";
import { formatter, to } from "@/helpers";
import { Textarea } from "../ui/textarea";
import { IUnitOfMesureResponse } from "@/interfaces/unit-of-mesure";
import { IProduct, IProductResponse } from "@/interfaces/products";
import { AgroMarApi } from "@/api/AgroMarApi";
import { AxiosResponse } from "axios";

interface ProductModalFormProps {
  isOpen: boolean;
  productToUpdate?: IProduct | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ProductModalForm = ({ isOpen, onClose, onSuccess, productToUpdate }: ProductModalFormProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Crear Producto</DialogTitle>
          <DialogDescription>
            <CreateOrUpdateProductForm onSuccess={onSuccess} initialValues={productToUpdate} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>

  )
};

const formSchema = z.object({
  predefinedProduct: z.string().min(1, { message: "Producto padre es requerido" }),
  image: z.instanceof(File).optional().nullable(),
  price: z.string({ message: "Precio es requerido" }).trim().min(1, { message: "Precio es requerido" }),
  stock: z.string({ message: "Stock es requerido" }).trim().min(1, { message: "Stock es requerido" }),
  description: z.string({ message: "Descripción es requerida" }).trim().min(1, { message: "Descripción es requerida" }),
  unitOfMeasure: z.string().min(1, { message: "Unidad de medida es requerido" }),
})
  .refine(data => Number(data.stock.replaceAll(',', '')) > 0, { message: "Stock no puede ser 0", path: ["stock"] })
  .refine(data => Number(data.price.replace(',', '')) > 0, { message: "Precio no puede ser 0", path: ["price"] })
  .refine(data => (data.image?.size || 0) < 10 * 1024 * 1024, { message: "El archivo es muy pesado, por favor, suba un archivo menor de 10MB", path: ["image"] })

export function CreateOrUpdateProductForm(props: { initialValues?: IProduct | null, onSuccess?: () => void }) {
  const { data: predefinedProduct } = useFetch<IPredifinedProductResponse[]>('/predefined-product');
  const { data: unitOfMesure } = useFetch<IUnitOfMesureResponse[]>('/unit-of-mesures');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: props.initialValues ? (
      {
        description: props.initialValues.description,
        image: null,
        price: props.initialValues.price.toString(),
        stock: props.initialValues.stock.toString(),
        predefinedProduct: props.initialValues.predefinedProduct.id.toString(),
        unitOfMeasure: props.initialValues.unitOfMeasure.id.toString(),
      }
    ) : {
      predefinedProduct: "",
      image: null,
      stock: "0",
      price: "0.00",
      description: "",
      unitOfMeasure: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append('predefinedProduct', values.predefinedProduct);
    if (values.image) formData.append('file', values.image);
    formData.append('price', Number(values.price.replaceAll(',', '')).toString());
    formData.append('stock', Number(values.stock.replaceAll(',', '')).toString());
    formData.append('description', values.description);
    formData.append('unitOfMeasure', values.unitOfMeasure);

    const [, error] = props.initialValues ? await to<AxiosResponse<IProductResponse>>(AgroMarApi.patch(`/products/${props.initialValues.id}`, formData)) : await to<AxiosResponse<IProductResponse>>(AgroMarApi.post('/products', formData));

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
            name="predefinedProduct"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Producto Padre</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={predefinedProduct?.length ? 'Seleccione un producto padre' : 'Producto padre no encontrado'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {
                      predefinedProduct?.map(item => (
                        <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* for input type file */}
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Imagen</FormLabel>
                <FormControl>
                  <Input placeholder="Imagen" type="file" onChange={(e) => form.setValue("image", e.target.files ? e.target.files[0] : null)} accept="image/*" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <>
                    <div className="flex items-center">
                      <span
                        className="text-gray-500 font-bold bg-gray-100 px-4 py-3 rounded-md hover:cursor-default rounded-r-none h-10"
                      >$</span>
                      <Input
                        step={1}
                        className="rounded-l-none h-10 w-full default-input"
                        {...field}
                        onFocus={() => {
                          if (field.value) form.setValue('price', Number(field.value.replace(',', '')).toString());
                        }}
                        onKeyDown={e => {
                          const currentValue = Number(field.value);
                          const allowedKeys = ['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
                          const onlyNumbersAndDot = /^[0-9.]+$/;
                          const alreadyHasDot = currentValue.toString().includes('.');

                          if (!onlyNumbersAndDot.test(e.key) && !allowedKeys.includes(e.key)) e.preventDefault();
                          if (alreadyHasDot && e.key === '.') e.preventDefault();
                        }}
                        onBlur={() => {
                          form.setValue('price', formatter({ value: Number(field.value) }).replace('$', ''));
                        }}
                      />
                    </div>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input
                    step={1}
                    className="h-10 w-full default-input"
                    {...field}
                    onFocus={() => {
                      if (field.value) form.setValue('stock', Number(field.value.replaceAll(',', '')).toString());
                    }}
                    onKeyDown={e => {
                      const allowedKeys = ['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
                      const onlyNumbersAndDot = /^[0-9]+$/;

                      if (!onlyNumbersAndDot.test(e.key) && !allowedKeys.includes(e.key)) e.preventDefault();
                    }}
                    onBlur={() => {
                      form.setValue('stock', formatter({ value: Number(field.value), as: 'number' }));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitOfMeasure"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Unidad de Medida</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="default-input">
                      <SelectValue placeholder={unitOfMesure?.length ? 'Seleccione una unidad de medida' : 'No se encontraron unidades de medida'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {
                      unitOfMesure?.map(item => (
                        <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea  {...field} className="default-input resize-none" placeholder="Descripción" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between items-center">
          <Button disabled={form.formState.isSubmitting} variant={'secondary'}>
            <Loader className={`h-4 w-4 animate-spin ${form.formState.isSubmitting ? 'block' : 'hidden'}`} />
            <span className={`${form.formState.isSubmitting ? 'hidden' : 'block'}`}>Cancelar</span>
          </Button>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            <Loader className={`h-4 w-4 animate-spin ${form.formState.isSubmitting ? 'block' : 'hidden'}`} />
            <span className={`${form.formState.isSubmitting ? 'hidden' : 'block'}`}>{props.initialValues ? 'Actualizar Producto' : 'Crear Producto'}</span>
          </Button>
        </div>
      </form>
    </Form>
  )
}

