import React, { useEffect, useRef } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import styles from "./DefaultLayout.module.css";
import Welcome from "../../components/Welcome/Welcome";
// context
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios-client";

// Ícones
import { IoLogOut } from "react-icons/io5";
import { TbHomeShare } from "react-icons/tb";

// Loading
import Loading from "../../components/Loading/Loading";
import { useLoading } from "../../context/LoadingContext";

// hooks
import useAuthGuard from "../../hooks/useAuthGuard";

const DefaultLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nodeRef = useRef(null);

  const { user, token, notification, setUser, setToken, welcome, setWelcome } = useStateContext();
  const { isLoading, label, setLabel, show, hideWithMin } = useLoading();

  useAuthGuard({ skewMs: 30_000, autoFetchUser: true });

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

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


  useEffect(() => {
    if (welcome) {
      if (!welcome) return;

      console.log(user?.name); // log imediato ao abrir a tela

      const t = setTimeout(() => {
        setWelcome(false); // remove a div da tela
      }, 8800); // 8600 ms
    }
    return () => clearTimeout(); // limpeza se desmontar/alternar rápido
  }, [welcome, user, setWelcome]);


  return (
    <div className={styles["defaultLayout-container"]}>
      <Loading active={isLoading} text={label} />
      {welcome && (
        <Welcome
          name={user.name || "visitante"}
          logoSrc="/logo.png"
          onFinish={() => console.log("Boas-vindas finalizada")}
        />
      )}

      {notification && <div className="notification">{notification}</div>}

      <main className={styles.stage}>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={location.pathname}
            nodeRef={nodeRef}
            timeout={{ enter: 320, exit: 260 }}
            classNames={{
              enter: styles["view-enter"],
              enterActive: styles["view-enter-active"],
              exit: styles["view-exit"],
              exitActive: styles["view-exit-active"],
            }}
          >
            <div ref={nodeRef} className={styles.viewPane}>
              <Outlet />
            </div>
          </CSSTransition>
        </SwitchTransition>
      </main>
      {!welcome && (
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
      )}
    </div>
  );
};

export default DefaultLayout;
