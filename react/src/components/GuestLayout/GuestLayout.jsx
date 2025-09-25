import React from "react";
import "./GuestLayout.css";
import { Navigate, Outlet } from "react-router-dom";
// context
import { useStateContext } from "../../context/ContextProvider";

const GuestLayout = () => {
  const { user, token } = useStateContext();
  if (token) {
    //se tiver token ir para o index (se o usuario estiver logado) todos com GuestLayout
    return <Navigate to="/" />;
  }

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <Outlet />
      </div>
    </div>
  );
};

export default GuestLayout;
