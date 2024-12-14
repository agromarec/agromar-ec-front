import { Outlet } from "react-router";
import { AppFooter, AppHeader } from "../ui"
import { AuthModal } from "../auth/AuthModal";
import { AppAlertDialog } from "../ui/AppAlertDialog";

export const AppLayout = () => {

  return (
    <>
      <AppHeader />
      <div className="min-h-[calc(100dvh-3rem)]">
        <Outlet />
      </div>

      {
        !window.location.pathname.includes('/chat') &&
        !window.location.pathname.includes('/')
        && <AppFooter />
      }

      <AuthModal />
      <AppAlertDialog />
    </>
  )
};
