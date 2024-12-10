import useAuthStore from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import CustomInput from "../ui/CustomInput";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { CreateOrUpdateUserForm as RegisterForm } from "../users/CreateUserModal";

export const AuthModal = () => {
  const isOpenAuthModal = useAuthStore(state => state.isOpenModal);
  const onCloseAuthModal = useAuthStore(state => state.onClose);
  const isSigningUp = useAuthStore(state => state.isSigningUp);

  return (
    <Dialog open={isOpenAuthModal} onOpenChange={onCloseAuthModal}>
      <DialogContent className={isSigningUp ? "max-w-[800px]" : undefined}>
        <DialogHeader>
          <DialogTitle>Iniciar Sesión</DialogTitle>
          <DialogDescription>
            <AuthForm />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>

  )
};

export function AuthForm() {
  const isSigningUp = useAuthStore(state => state.isSigningUp);
  const signup = useAuthStore(state => state.signup);
  const navigate = useNavigate();

  return (
    <>
      {
        isSigningUp ? (
          <RegisterForm
            isRegister
            onSubmit={values => {
              signup(values, () => {
                navigate('/');
                toast.success('Sesión iniciada exitosamente');
              });
            }}
          />
        ) : (
          <LoginForm />
        )
      }
    </>
  )
}

const formLoginSchema = z.object({
  email: z.string().email({ message: "Dirección de correo inválida" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

const LoginForm = () => {
  const login = useAuthStore(state => state.login);
  const onToggleSignup = useAuthStore(state => state.onToggleSignup);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formLoginSchema>>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formLoginSchema>) {
    await login(values, () => {
      navigate('/');
      toast.success('Sesión iniciada exitosamente');
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
        <FormField
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
        />

        <FormField
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
        />
        <Button type="submit" className="mx-auto block" disabled={form.formState.isSubmitting}>
          <Loader className={`h-4 w-4 animate-spin ${form.formState.isSubmitting ? 'block' : 'hidden'}`} />
          <span className={`${form.formState.isSubmitting ? 'hidden' : 'block'}`}>Iniciar Sesión</span>
        </Button>
      </form>

      <div className="flex flex-col items-center justify-center mt-4 text-center mb-[-14px]">
        <p>¿No tienes cuenta?
          <Button variant={'link'} className="text-primary-500 hover:underline mx-0 p-0 ml-1 font-bold"
            onClick={() => onToggleSignup(true)}>Regístrate</Button>
        </p>
      </div>
    </Form>
  )
}
