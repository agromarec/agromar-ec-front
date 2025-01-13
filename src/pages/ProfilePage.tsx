import { AgroMarApi } from "@/api/AgroMarApi";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/ui/CustomDialog";
import CustomInput from "@/components/ui/CustomInput";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input";
import { LoaderBtn } from "@/components/ui/LoaderBtn";
import { Textarea } from "@/components/ui/textarea";
import { to } from "@/helpers";
import { useDisclousure } from "@/hooks";
import useAuthStore from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Pencil } from "lucide-react";
import { globalVariables } from "@/config/globalVariables";


export const ProfilePage = () => {
  const user = useAuthStore(state => state.user);
  const checkAuth = useAuthStore(state => state.checkAuth);
  const { isOpen, toggleDisclosure: tooglePasswordModal } = useDisclousure();
  const { isOpen: isOpenPayment, toggleDisclosure: tooglePaymentModal } = useDisclousure();
  const filePicRef = useRef<HTMLInputElement>(null);

  const handleChangProfilePic = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    await AgroMarApi.patch(`/users/profile-pic/${user?.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  return (
    <div className="container mx-auto my-12 px-12">
      <h1 className="text-center text-2xl font-bold mt-20 mb-4">Bienvenido a tu perfil, {user?.name} {user?.lastName}</h1>

      <input type="file" ref={filePicRef} className="hidden"
        onChange={handleChangProfilePic}
      />

      <div className="flex justify-start gap-10 w-full">

        <div className="flex flex-col w-full max-w-sm relative">
          <img
            src={
              user?.profilePicture ? `${globalVariables.fileUrl}profile-pictures/${user.profilePicture}` : 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg'
            }
            alt="perfil"
            className="rounded-lg mx-auto aspect-square h-[20rem] object-cover" 
          />

          <p
            className="text-center text-sm mt-4 mb-4 flex justify-center font-semibold cursor-pointer hover:bg-gray-200 rounded-lg max-w-fit mx-auto items-center px-2 py-2"
            onClick={() => filePicRef.current?.click()}
          >Editar foto de perfil
            <Pencil height={20} width={20} className="ml-2" />
          </p>

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

          <div className="flex gap-4 justify-center mx-auto">
            <Button className="mt-4 max-w-sm mx-auto" onClick={tooglePasswordModal}>Cambiar contraseña</Button>
            <Button variant="secondary" className="mt-4 max-w-sm mx-auto" onClick={tooglePaymentModal}>Ver métodos de pago</Button>
          </div>


          <SellerDescriptionFrom initialDescription={user?.businessDescription} />
        </div>
      </div>


      <ChangePasswordModal
        isOpen={isOpen}
        onClose={tooglePasswordModal}
      />

      <CustomDialog
        isOpen={isOpenPayment}
        onOpenChange={tooglePaymentModal}
        title="Métodos de pago"
        content={() =>
          <PaymentMethodsForm
            initialValues={{ allowBankTransfers: !!user?.allowBankTransfers, allowPaypalPayments: !!user?.allowPaypalPayments, bankTransfersInfo: user?.bankTransfersInfo || '' }}
            onSuccess={() => {
              tooglePaymentModal()
              checkAuth();
            }}
          />
        }
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

export const SellerDescriptionFrom = ({ initialDescription }: { initialDescription?: string | null }) => {
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setDescription(initialDescription ?? '');
  }, [initialDescription]);

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mt-10 mb-4">Descripción del vendedor</h2>

      <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción del vendedor"
        className="resize-none w-full h-20 rounded-lg border-2 border-gray-300"
      />

      <LoaderBtn
        className="mt-4 max-w-sm mx-auto"
        isLoading={isLoading}
        onClick={async () => {
          setIsLoading(true);
          const [, error] = await to(AgroMarApi.post('/users/seller/update-description', {
            description,
          }));
          setIsLoading(false);

          if (error) return toast.error(error.message);
          toast.success('Descripción actualizada exitosamente');
        }}
      >Cambiar descripción</LoaderBtn>
    </div>
  )
};



const FormSchema = z.object({
  allowPaypalPayments: z.boolean().default(false),
  allowBankTransfers: z.boolean().default(false),
  bankTransfersInfo: z.string().optional(),
}).refine(data => !!data.bankTransfersInfo, {
  message: "La información de transferencia es obligatoria",
  path: ["bankTransfersInfo"],
});

export function PaymentMethodsForm({ initialValues, onSuccess }: { initialValues?: z.infer<typeof FormSchema>; onSuccess?: () => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialValues ? initialValues : {
      allowPaypalPayments: false,
      allowBankTransfers: false,
      bankTransfersInfo: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const [, error] = await to(AgroMarApi.post('auth/update-payment-methods', {
      ...data
    }));

    if (error) return toast.error(error.message);

    toast.success('Contraseña cambiada exitosamente');
    form.reset();
    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="allowPaypalPayments"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Paypal</FormLabel>
                    <FormDescription>
                      Recive los pagos de tus productos por Paypal o por tarjeta de crédito/débito.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allowBankTransfers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Transferencias</FormLabel>
                    <FormDescription>
                      Recibe el pago de tus productos por transferencia bancaria.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {
              form.watch('allowBankTransfers') &&
              <FormField
                control={form.control}
                name="bankTransfersInfo"
                render={({ field }) => (
                  <FormItem className="mx-auto">
                    <FormLabel>Información de transferencia</FormLabel>
                    <FormControl>
                      <Textarea value={field.value} onChange={e => field.onChange(e.target.value)} placeholder="Información de transferencia"
                        className="resize-none h-32 rounded-lg border-2 border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            }
          </div>
        </div>

        <Button type="submit" className="mx-auto block">Cambiar métodos de pago</Button>
      </form>
    </Form>
  )
}
