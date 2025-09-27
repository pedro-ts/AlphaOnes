import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styles from "./DefaultLayout.module.css";
// context
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios-client";
// Ícones
import { IoLogOut } from "react-icons/io5";
import { TbHomeShare } from "react-icons/tb";

// Loading
import Loading from "../../components/Loading/Loading";
import { useLoading } from "../../context/LoadingContext";

const DefaultLayout = () => {
  const navigate = useNavigate();
  const { user, token, notification, setUser, setToken } = useStateContext();
  const { isLoading, label, setLabel, show, hideWithMin } = useLoading();

  // redireciona sem quebrar a ordem dos hooks
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  // carrega usuário somente se houver token
  useEffect(() => {
    if (!token) return;
    let alive = true;
    axiosClient
      .get("/user")
      .then(({ data }) => {
        if (alive) setUser(data);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [token, setUser]);

  const onLogout = async (e) => {
    e.preventDefault();
    // mostra imediatamente (sem delay) e garante duração mínima
    setLabel("Saindo...");
    show();
    try {
      await axiosClient.post("/logout");
    } finally {
      hideWithMin(400);
    }
    setUser({});
    setToken(null);
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles["defaultLayout-container"]}>
      <Loading active={isLoading} text={label} />

      {notification && <div className="notification">{notification}</div>}

      <main>
        <Outlet />
      </main>

      <footer>
        <div className={styles["taskbar-container"]}>
          <div className={styles["left-container"]}>
            <img src="logo.png" alt="Logo Alpha One's" />
          </div>

          <div className={styles["right-container"]}>
            <Link
              to="/home"
              className={styles["btn-dashboard"]}
              aria-label="Início"
            >
              <TbHomeShare className={styles["icone-home"]} />
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className={styles["btn-logout"]}
              disabled={isLoading}
              aria-busy={isLoading}
              aria-label="Sair"
            >
              <IoLogOut className={styles["icone-logout"]} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DefaultLayout;
