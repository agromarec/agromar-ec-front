import useAuthStore from "@/store/auht";
import { Outlet, useNavigate } from "react-router";
import { toast } from "sonner";

export const PrivateRoute = () => {
  const authStatus = useAuthStore(state => state.status);
  const navigate = useNavigate();

  if (authStatus === 'unauthenticated') {
    navigate('/');
    toast.error('No tienes permisos para acceder a esta página');
    return <></>;
  }

  return (
    <>
      {
        <Outlet />
      }
    </>
  )
};
