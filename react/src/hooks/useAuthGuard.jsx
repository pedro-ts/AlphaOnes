// src/hooks/useAuthGuard.js
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

const DEFAULT_SKEW_MS = 30_000; // margem contra clock-skew

function isExpired(expiresAt, skewMs) {
  if (!expiresAt) return true;
  const t = new Date(expiresAt).getTime();
  if (Number.isNaN(t)) return true;
  return Date.now() + skewMs >= t;
}

export default function useAuthGuard(options = {}) {
  const { skewMs = DEFAULT_SKEW_MS, autoFetchUser = true } = options;
  const { token, expiresAt, setUser, setToken, setExpiresAt } =
    useStateContext();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const axiosInterceptorIdRef = useRef(null);

  const hardLogout = () => {
    // limpa estado e storage
    setUser({});
    setToken(null);
    setExpiresAt(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    // avisa outras abas
    try {
      localStorage.setItem("auth:logout_broadcast", String(Date.now()));
    } catch {}
    navigate("/login", { replace: true });
  };

  // 1) Se não há token ou já expirou, sai agora
  useEffect(() => {
    if (!token || isExpired(expiresAt, skewMs)) hardLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, expiresAt]); // intencional: usa hardLogout fechado

  // 2) Agenda logout no instante da expiração
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!token || isExpired(expiresAt, skewMs)) return;

    const expMs = new Date(expiresAt).getTime();
    const delay = Math.max(0, expMs - Date.now() - skewMs);
    timerRef.current = setTimeout(() => hardLogout(), delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, expiresAt, skewMs]);

  // 3) Intercepta 401 do backend e força logout
  useEffect(() => {
    const id = axiosClient.interceptors.response.use(
      (r) => r,
      (err) => {
        if (err?.response?.status === 401) hardLogout();
        return Promise.reject(err);
      }
    );
    axiosInterceptorIdRef.current = id;
    return () => {
      if (axiosInterceptorIdRef.current != null) {
        axiosClient.interceptors.response.eject(axiosInterceptorIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 4) Opcional: busca /user se válido
  useEffect(() => {
    if (!autoFetchUser) return;
    if (!token || isExpired(expiresAt, skewMs)) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, expiresAt, autoFetchUser, skewMs]);

  // 5) Logout cross-tab
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "auth:logout_broadcast") hardLogout();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
