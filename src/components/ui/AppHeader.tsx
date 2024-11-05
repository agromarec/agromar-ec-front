import { Link, NavLink } from "react-router-dom"
import { DollarSign, LogOut, MessageSquare, Settings, ShoppingCart, User } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from "./dropdown-menu";
import useAuthStore from "@/store/auht";

export const AppHeader = () => {
  const authStatus = useAuthStore(state => state);

  console.log(authStatus.user);
  

  return (
    <div className="flex items-center justify-between px-4 py-3 min-w-full bg-primary h-12 max-h-12 shadow-md shadow-black/50">
      <div className="flex items-center text-white gap-4">
        <Link to="/">
          <h1 className="text-xl font-bold">AgroMarEC</h1>
        </Link>
        <Link to="/" className="hover:text-gray-200">Inicio</Link>
        <Link to="/productos" className="hover:text-gray-200">Productos</Link>
      </div>

      <div className="flex items-center gap-4 text-white pr-4">
        <NavLink to={'/'}>
          <ShoppingCart size={20} fill="white" />
        </NavLink>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <User size={20} fill="white" />
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" align="end">
            <NavLink to={'/'}>
              <DropdownMenuItem className="flex items-center gap-2 hover:cursor-pointer">
                <User />
                <p>Perfil</p>
              </DropdownMenuItem>
            </NavLink>

            <NavLink to={'/'}>
              <DropdownMenuItem className="flex items-center gap-2 hover:cursor-pointer">
                <MessageSquare />
                <p>Conversaciones</p>
              </DropdownMenuItem>
            </NavLink>

            <DropdownMenuSeparator />

            <NavLink to={'/'}>
              <DropdownMenuItem className="flex items-center gap-2 hover:cursor-pointer">
                <Settings />
                <p>Administración</p>
              </DropdownMenuItem>
            </NavLink>

            <NavLink to={'/'}>
              <DropdownMenuItem className="flex items-center gap-2 hover:cursor-pointer">
                <ShoppingCart />
                <p>Mis Compras</p>
              </DropdownMenuItem>
            </NavLink>

            <NavLink to={'/'}>
              <DropdownMenuItem className="flex items-center gap-2 hover:cursor-pointer">
                <DollarSign />
                <p>Mis Ventas</p>
              </DropdownMenuItem>
            </NavLink>

            <DropdownMenuSeparator />

            <NavLink to={'/'}>
              <DropdownMenuItem className="flex items-center gap-2 hover:cursor-pointer text-rose-500 hover:!text-rose-500">
                <LogOut />
                <p>Cerrar Sesión</p>
              </DropdownMenuItem>
            </NavLink>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>

    </div>
  )
};
