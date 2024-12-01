import { Roles } from "@/config/globalVariables";
import useAuthStore from "@/store/auht";
import { Outlet, useNavigate } from "react-router";
import { toast } from "sonner";

export const PrivateRoute = () => {
  const user = useAuthStore(state => state.user);
  const authStatus = useAuthStore(state => state.status);
  const navigate = useNavigate();

  if (authStatus === 'unauthenticated') {
    navigate('/');
    toast.error('No tienes permisos para acceder a esta página');
    return <></>;
  }

  if (!user?.user_role.find(role => role.roleId === Roles.ADMIN) && window.location.pathname.includes('/admin')) {
    const path = window.location.pathname;
    if (!path.includes('/products')) {
      navigate('/');
      toast.error('No tienes permisos para acceder a esta página');
      return <></>;
    }
  }

  return (
    <>
      {
        <Outlet />
      }
    </>
  )
};
