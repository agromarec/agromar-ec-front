import { AppLayout } from "@/components";
import { AdminPage } from "@/pages/admin";
import { HomePage } from "@/pages/HomePage";
import { ProductsPage } from "@/pages/ProductsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { AdminProductsPage } from "@/pages/admin/products/AdminProductsPage";
import { AdminCategoriesPage } from "@/pages/admin/categories";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminMeasurePage } from "@/pages/admin/AdminMeasurePage";
import { AdminParentProductPage } from "@/pages/admin/AdminParentProductPage";
import { CartPage } from "@/pages/CartPage";
import { ChatPage } from "@/pages/ChatPage";
import { MyOrdersPage } from "@/pages/MyOrdersPage";
import { MySalesPage } from "@/pages/MySalesPage";
import { AdminRequestsPage } from "@/pages/admin/AdminRequestsPage";

export enum ValidRoutes {
  HOME = '/',
  PRODUCTS = '/productos',
  PROFILE = '/usuario/perfil',
  CART = '/cart',
  CHAT = '/chat',
  ADMIN = '/admin',
  ADMIN_USERS = '/admin/users',
  ADMIN_CATEGORIES = '/admin/categories',
  ADMIN_UNITS = '/admin/units',
  ADMIN_PREDEFINED_PRODUCTS = '/admin/predefined-products',
  ADMIN_PRODUCTS = '/admin/products',
  REQUESTS = '/admin/solicitudes',
  MY_ORDERS = '/usuario/mis-compras',
  MY_SALES = '/usuario/mis-ventas',
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: 'productos',
        element: <ProductsPage />,
      },
      {
        path: 'cart',
        element: <PrivateRoute />,
        children: [
          {
            path: '/cart',
            element: <CartPage />,
          },
        ]
      },
      {
        path: 'usuario',
        element: <PrivateRoute />,
        children: [
          {
            path: 'perfil',
            element: <ProfilePage />,
          },
          {
            path: 'mis-ventas',
            element: <MySalesPage />,
          },
          {
            path: 'mis-compras',
            element: <MyOrdersPage />,
          },
        ]
      },
      {
        path: 'chat',
        element: <PrivateRoute />,
        children: [
          {
            path: '/chat',
            element: <ChatPage />,
          },
        ]
      },
      {
        path: 'admin',
        element: <PrivateRoute />,
        children: [
          {
            path: '/admin',
            element: <AdminPage />,
          },
          {
            path: '/admin/users',
            element: <AdminUsersPage />
          },
          {
            path: '/admin/products',
            element: <AdminProductsPage />
          },
          {
            path: '/admin/solicitudes',
            element: <AdminRequestsPage />
          },
          {
            path: '/admin/categories',
            element: <AdminCategoriesPage />
          },
          {
            path: '/admin/units',
            element: <AdminMeasurePage />
          },
          {
            path: '/admin/predefined-products',
            element: <AdminParentProductPage />
          },
        ]
      }
    ],
  },
  {
    path: '*',
    element: <Navigate to={ValidRoutes.HOME} />,
  }
]);