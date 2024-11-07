import { AppLayout } from "@/components";
import { AdminPage } from "@/pages/admin";
import { HomePage } from "@/pages/HomePage";
import { ProductsPage } from "@/pages/ProductsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { createBrowserRouter } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { AdminProductsPage } from "@/pages/admin/products/AdminProductsPage";
import { CreateProductPage } from "@/pages/admin/products/CreateProductPage";
import { AdminCategoriesPage } from "@/pages/admin/categories";
import { CreateCategoryPage } from "@/pages/admin/categories/CreateCategoryPage";

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
            path: '/admin/products',
            element: <AdminProductsPage />
          },
          {
            path: '/admin/products/create',
            element: <CreateProductPage />
          },
          {
            path: '/admin/categories',
            element: <AdminCategoriesPage />
          },
          {
            path: '/admin/categories/create',
            element: <CreateCategoryPage />
          }
        ]
      }
    ],
  },
]);