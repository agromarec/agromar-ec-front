import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useFetch } from "@/hooks";
import { ICantonResponse, ICountryResponse, IProvinceResponse } from "@/interfaces/pais";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { IUserResponse } from "@/interfaces/users";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { LoaderBtn } from "../ui/LoaderBtn";
import CustomInput from "../ui/CustomInput";
import useAuthStore from "@/store/authStore";

interface CreateUserModalProps {
  isOpen: boolean;
  user?: IUserResponse | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CreateUserModal = ({ isOpen, onClose, onSubmit, user }: CreateUserModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Nuevo Usuario</DialogTitle>
        </DialogHeader>
        <CreateOrUpdateUserForm onSubmit={onSubmit} initialValues={user} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
};

const userSchema = (isUpdating: boolean) => z.object({
  name: z.string().min(2, "El nombre es requerido"),
  lastName: z.string().min(2, "El apellido es requerido"),
  email: z.string().email("El email es invalido"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 caracteres"),
  // password: z.string({ required_error: "La contraseña es requerida" }).min(8, "La debe tener al menos 8 caracteres"),
  // confirmPassword: z.string({ required_error: "La contraseña es requerida" }).min(8, "La debe tener al menos 8 caracteres"),
  address: z.string().min(2, "La direccion es requerida"),
  paypalEmail: z.string().email("El email de paypales invalido"),
  paisId: z.string().min(1, "El pais es requerido"),
  provinceId: z.string().min(1, "La provincia es requerida"),
  cantonId: z.string().min(1, "El cantón es requerido"),
  password: isUpdating
    ? z.string().optional()
    : z.string({ required_error: "La contraseña es requerida" }).min(8, "Debe tener al menos 8 caracteres"),
  confirmPassword: isUpdating
    ? z.string().optional()
    : z.string({ required_error: "La contraseña es requerida" }).min(8, "Debe tener al menos 8 caracteres"),
}).refine(data => data.password === data.confirmPassword, { message: "Las contraseñas no coinciden", path: ["confirmPassword"] })

export const CreateOrUpdateUserForm = ({ onSubmit, initialValues, onCancel, isRegister = false }: { onSubmit: (data: any) => void; initialValues?: IUserResponse | null; onCancel?: () => void; isRegister?: boolean }) => {
  const { data: countries } = useFetch<ICountryResponse[]>('/country');
  const { data: provinces } = useFetch<IProvinceResponse[]>('/province');
  const { data: cantones } = useFetch<ICantonResponse[]>('/cantones');
  const onToggleSignup = useAuthStore(state => state.onToggleSignup);

  console.log({initialValues});
  

  const form = useForm({
    defaultValues: initialValues ? ({
      name: initialValues.name,
      lastName: initialValues.lastName,
      email: initialValues.email,
      phone: initialValues.phone,
      address: initialValues.address,
      paypalEmail: initialValues.paypalEmail || '',
      paisId: initialValues?.paisId.toString(),
      cantonId: (initialValues?.canton_ce?.id || '')?.toString(),
      provinceId: initialValues.canton_ce?.province_ce?.id_province?.toString(),
      // password: '',
      // confirmPassword: '',
    }) : {
      name: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      paypalEmail: '',
      paisId: '',
      provinceId: '',
      cantonId: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(userSchema(!!initialValues)),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4 w-full">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
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
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Apellido" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celular</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Celular" type="tel"
                    onKeyDown={(e) => {
                      const allowdKeys = [
                        'Backspace',
                        'Delete',
                        'Enter',
                        'ArrowLeft',
                        'ArrowRight',
                        'Tab',
                        'Escape',
                        'Home',
                        'End',
                        'PageUp',
                        'PageDown',
                        'ArrowUp',
                        'ArrowDown',
                      ];

                      const isAllowedKey = allowdKeys.includes(e.key);

                      const isNumberKey = e.key.match(/^[0-9]$/);

                      if (!isAllowedKey && !isNumberKey) e.preventDefault();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {
            !initialValues && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Email" type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          }

          <FormField
            control={form.control}
            name="paypalEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email de PayPal</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Email de PayPal" type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Dirección" type="address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {
            !initialValues && (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
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
                    <FormItem>
                      <FormLabel>Confirmar contraseña</FormLabel>
                      <FormControl>
                        <CustomInput inputType='password' placeholder="Confirmar contraseña" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )
          }


          <FormField
            control={form.control}
            name="paisId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>País</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={countries?.length ? 'Seleccione un país' : 'No se han encontrado paises'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {
                      countries?.map((country) => (
                        <SelectItem key={country.id_pais} value={country.id_pais.toString()}>
                          {country.name}
                        </SelectItem>
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
            name="provinceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provincia</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.getValues('paisId')}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={countries?.length ? 'Seleccione una provincia' : 'No se han encontrado provincias'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {
                      provinces?.map((province) => (
                        <SelectItem key={province.id_province} value={province.id_province.toString()}>
                          {province.name}
                        </SelectItem>
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
            name="cantonId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantón</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.getValues('provinceId')}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={countries?.length ? 'Seleccione un cantón' : 'No se han encontrado cantones'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {
                      cantones?.filter(canton => canton.provinceId === Number(form.watch('provinceId'))).map((canton) => (
                        <SelectItem key={canton.id} value={canton.id.toString()}>
                          {canton.nombre}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between items-center">
          {
            isRegister ? (
              <div className="flex justify-center flex-col mx-auto w-1/2"> 
                <LoaderBtn isLoading={form.formState.isSubmitting} type="submit" disabled={form.formState.isSubmitting}>
                  Registrarse
                </LoaderBtn>

                <div className="flex justify-center w-full items-center gap-2">
                  <p className="text-center text-xs">Ya tienes una cuenta?</p>
                  <Button variant={'link'} className="p-0 ml-1 font-bold text-xs" onClick={() => onToggleSignup(false)}>Inicia sesión</Button>
                </div>
              </div>
            ) : (
              <>
                <Button disabled={form.formState.isSubmitting} variant={'secondary'} onClick={onCancel} type="button">
                  Cancelar
                </Button>

                <LoaderBtn isLoading={form.formState.isSubmitting} type="submit" disabled={form.formState.isSubmitting}>
                  {
                    initialValues ? "Actualizar" : "Crear"
                  } Usuario
                </LoaderBtn>
              </>
            )
          }
        </div>
      </form>
    </Form>
  )
}

