import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import AddCategory from "../pages/AddCategory/AddCategory";
import UpdateProduct from "../pages/UpdateProduct/UpdateProduct";
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "/dashboard/add-startup",
        element: <ProtectedRoute><AddCategory /></ProtectedRoute>,
      },
      {
        path: "/dashboard/update-startup/:id",
        element: <ProtectedRoute><UpdateProduct /></ProtectedRoute>,
      },
    ],
  }
]);
