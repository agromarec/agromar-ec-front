import { AppLayout } from "@/components";
import { AdminPage } from "@/pages/admin";
import { HomePage } from "@/pages/HomePage";
import { ProductsPage } from "@/pages/ProductsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { createBrowserRouter } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { AdminProductsPage } from "@/pages/admin/products/AdminProductsPage";
import { AdminCategoriesPage } from "@/pages/admin/categories";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";

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
        path: 'usuario/perfil',
        element: <ProfilePage />,
      },
      {
        path: 'productos',
        element: <ProductsPage />,
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
            path: '/admin/categories',
            element: <AdminCategoriesPage />
          },
        ]
      }
    ],
  },
]);