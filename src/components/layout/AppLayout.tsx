import { Outlet } from "react-router";
import { AppFooter, AppHeader } from "../ui"
import { AuthModal } from "../auth/AuthModal";

export const AppLayout = () => {
  return (
    <>
      <AppHeader />
      <div className="min-h-[calc(100dvh-3rem)]">
        <Outlet />
      </div>

      <AuthModal />
      <AppFooter />
    </>
  )
};
