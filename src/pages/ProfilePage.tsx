import { AgroMarApi } from "@/api/AgroMarApi";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/CustomInput";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderBtn } from "@/components/ui/LoaderBtn";
import { to } from "@/helpers";
import { useDisclousure } from "@/hooks";
import useAuthStore from "@/store/auht";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


export const ProfilePage = () => {
  const user = useAuthStore(state => state.user);
  const { isOpen, toggleDisclosure } = useDisclousure();


  return (
    <div className="container mx-auto my-12 px-12">
      <h1 className="text-center text-2xl font-bold mt-20 mb-4">Bienvenido a tu perfil, {user?.name} {user?.lastName}</h1>

      <div className="flex justify-start gap-10 w-full">

        <div className="flex flex-col w-full max-w-sm">
          <img
            src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" alt="perfil"
            className="w-full h-full rounded-lg max-w-72 mx-auto"
          />

          <div className="text-center">
            <p className="text-sm font-bold">{user?.name} {user?.lastName}</p>
            <p className="text-sm font-bold mt-2">Correo</p>
            <p className="text-sm">{user?.email}</p>
          </div>
        </div>



        <div className="flex flex-col gap-4">
          <div className="flex justify-between mt-8 mx-auto gap-12">
            <label className="flex flex-col gap-2 w-full">
              <span className="text-sm font-bold">Nombre</span>
              <Input
                placeholder="Nombre"
                className="max-w-sm mx-auto cursor-default flex-1"
                readOnly
                value={user?.name}
                size={32}
              />
            </label>

            <label className="flex flex-col gap-2 w-full">
              <span className="text-sm font-bold">Apellido</span>
              <Input
                placeholder="Apellido"
                className="max-w-sm mx-auto cursor-default flex-1"
                readOnly
                value={user?.lastName}
                size={32}
              />
            </label>
          </div>

          <div className="flex justify-between mx-auto gap-12 w-full">
            <label className="flex flex-col gap-2 w-full">
              <span className="text-sm font-bold">Correo</span>
              <Input
                placeholder="Correo"
                className="mx-auto cursor-default flex-1"
                readOnly
                value={user?.email}
              />
            </label>
          </div>

          <div className="flex justify-between mx-auto gap-12 w-full">
            <label className="flex flex-col gap-2 w-full">
              <span className="text-sm font-bold">Teléfono</span>
              <Input
                placeholder="Teléfono"
                className="mx-auto cursor-default flex-1"
                readOnly
                value={user?.phone}
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              />
            </label>
          </div>

          <div className="flex justify-between mx-auto gap-12 w-full">
            <label className="flex flex-col gap-2 w-full">
              <span className="text-sm font-bold">Dirección</span>
              <Input
                placeholder="Dirección"
                className="mx-auto cursor-default flex-1"
                readOnly
                value={user?.address}
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              />
            </label>
          </div>

          <div className="flex justify-between mx-auto gap-12 w-full">
            <label className="flex flex-col gap-2 w-full">
              <span className="text-sm font-bold">País</span>
              <Input
                placeholder="País"
                className="mx-auto cursor-default flex-1"
                readOnly
                value={user?.pais_ce?.name}
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              />
            </label>
          </div>

          <Button className="mt-4 max-w-sm mx-auto" onClick={toggleDisclosure}>Cambiar contraseña</Button>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isOpen}
        onClose={toggleDisclosure}
      />
    </div>
  )
};

const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  confirmPassword: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

const ChangePasswordModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onChangePassword = async (values: z.infer<typeof ChangePasswordSchema>) => {
    const [, error] = await to(AgroMarApi.post('/auth/update-password', {
      oldPassword: values.oldPassword,
      password: values.password,
    }));

    if (error) return toast.error(error.message);

    toast.success('Contraseña cambiada exitosamente');
    form.reset();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      form.reset();
      onClose();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar contraseña</DialogTitle>
          <DialogDescription>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onChangePassword)} className="space-y-8 mt-4">
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem className="max-w-sm mx-auto">
                      <FormLabel>Contraseña actual</FormLabel>
                      <FormControl>
                        <CustomInput inputType='password' placeholder="Contraseña" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="max-w-sm mx-auto">
                      <FormLabel>Nueva Contraseña</FormLabel>
                      <FormControl>
                        <CustomInput inputType='password' placeholder="Contraseña" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="max-w-sm mx-auto">
                      <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                      <FormControl>
                        <CustomInput inputType='password' placeholder="Contraseña" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <LoaderBtn isLoading={form.formState.isSubmitting} className="mx-auto block" disabled={form.formState.isSubmitting}>
                  <span className={`${form.formState.isSubmitting ? 'hidden' : 'block'}`}>Cambiar contraseña</span>
                </LoaderBtn>
              </form>
            </Form>

          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
};