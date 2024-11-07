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

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProductModal = ({ isOpen, onClose }: CreateProductModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Producto</DialogTitle>
          <DialogDescription>
            <CreateOrUpdateProductForm initialValues={{} as any} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>

  )
};

const formSchema = z.object({
  predefinedProductId: z.string().min(1, { message: "Producto padre es requerido" }),
  image: z.instanceof(File).nullable(),
});

export function CreateOrUpdateProductForm({ initialValues }: { initialValues: z.infer<typeof formSchema> }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      predefinedProductId: "",
      image: null,
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);    
    toast.success('Sesión iniciada exitosamente');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
        <FormField
          control={form.control}
          name="predefinedProductId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Producto Padre</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">m@example.com</SelectItem>
                  <SelectItem value="2">m@google.com</SelectItem>
                  <SelectItem value="3">m@support.com</SelectItem>
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
            <FormItem className="max-w-sm mx-auto">
              <FormLabel>Imagen</FormLabel>
              <FormControl>
                <Input placeholder="Imagen" type="file" onChange={(e) => form.setValue("image", e.target.files ? e.target.files[0] : null)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="max-w-sm mx-auto">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="max-w-sm mx-auto">
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <CustomInput inputType='password' placeholder="Contraseña" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button type="submit" className="mx-auto block" disabled={form.formState.isSubmitting}>
          <Loader className={`h-4 w-4 animate-spin ${form.formState.isSubmitting ? 'block' : 'hidden'}`} />
          <span className={`${form.formState.isSubmitting ? 'hidden' : 'block'}`}>Crear Producto</span>
        </Button>
      </form>

      <div className="flex flex-col items-center justify-center mt-4 text-center mb-[-14px]">
        <p>¿No tienes cuenta?
          <Button variant={'link'} className="text-primary-500 hover:underline mx-0 p-0 ml-1 font-bold">Registrate</Button>
        </p>
      </div>
    </Form>
  )
}

