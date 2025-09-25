import { createBrowserRouter, Navigate } from "react-router-dom";
// Pages
import Login from "./views/Login/Login";
import Signup from "./views/Signup/Signup";
import Users from "./views/Users/Users";
import Dashboard from "./views/Dashboard/Dashboard";
import NotFound from "./views/NotFound/NotFound";
import Home from "./views/Home/Home";
// Components
import GuestLayout from "./components/GuestLayout/GuestLayout";
import DefaultLayout from "./components/DefaultLayout/DefaultLayout";
import UserForm from "./components/UserForm/UserForm";

const router = createBrowserRouter([
  // Layout padrão
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/home" />
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/users",
        element: <Users/>
      },
      {
        path: "/users/new",
        element: <UserForm key="userCreate"/>
      },
      {
        path: "/users/:id",
        element: <UserForm key="userUpdate"/>
      }
    ],
  },
  // Layout de login ou registro
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  // NotFound
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
