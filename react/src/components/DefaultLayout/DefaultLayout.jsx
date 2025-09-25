import React, { useEffect } from "react";
import { Link, Navigate, Outlet } from "react-router-dom"; //renderiza o filho
import "./DefaultLayout.css"
// context
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios-client";

const DefaultLayout = () => {
  const { user, token, notification, setUser, setToken} = useStateContext();
  if (!token) {
    //se não tiver token(não logado) ir para login (todos com DefaultLayout)
    return <Navigate to="/login" />;
  }

  const onLogout = (e) => {
    e.preventDefault();

    axiosClient.post('/logout')
    .then(()=>{
      setUser({});
      setToken(null)
    })
  }
  // Obtem nome de usuario
  useEffect(() =>{
    axiosClient.get('/user')
    .then(({data}) => {
      setUser(data);
    })
  }, [])

  return (
    <div id="defaultLayout">
      <div className="content">
      </div>
      {notification && <div className="notification">{notification}</div>}
      <main>
        <Outlet />
      </main>
        <footer>
          <div>
            {user.name}
            <a href="#" onClick={onLogout} className="btn-logout">
              logout
            </a>
          </div>
        </footer>
    </div>
  );
};

export default DefaultLayout;
