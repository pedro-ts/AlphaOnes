import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [label, setLabel] = useState("Carregando...");
  const counter = useRef(0); // concorrência segura
  const showTimer = useRef(null); // delay antes de exibir
  const hideTimer = useRef(null); // duração mínima visível
  const firstShownAt = useRef(null); // timestamp de quando apareceu

  // limpa timers ao desmontar
  useEffect(() => {
    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  // ---------- APIs básicas (compatível com seu código atual) ----------
  const show = (text) => {
    if (text) setLabel(text);
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    counter.current += 1;
    if (!isLoading) {
      firstShownAt.current = Date.now();
      setIsLoading(true);
    }
  };
  const reset = () => {
    counter.current = 0;
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    firstShownAt.current = null;
    setIsLoading(false);
    setLabel("Carregando...");
  };

  const hide = () => {
    counter.current = Math.max(0, counter.current - 1);
    if (counter.current === 0) {
      if (showTimer.current) {
        clearTimeout(showTimer.current);
        showTimer.current = null;
      }
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
      setIsLoading(false);
      firstShownAt.current = null;
    }
  };

  // ---------- Versões com anti-flicker ----------
  const showDelayed = (delay = 150, text) => {
    if (text) setLabel(text);
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    counter.current += 1;

    // já visível: não agenda delay novamente
    if (isLoading) return;

    if (showTimer.current) clearTimeout(showTimer.current);
    showTimer.current = setTimeout(() => {
      showTimer.current = null;
      firstShownAt.current = Date.now();
      setIsLoading(true);
    }, Math.max(0, delay));
  };

  const hideWithMin = (minDuration = 350) => {
    counter.current = Math.max(0, counter.current - 1);
    if (counter.current > 0) return;

    // se ainda nem exibiu (estava no delay), cancela e não mostra nada
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
      setIsLoading(false);
      firstShownAt.current = null;
      return;
    }

    if (!isLoading) return;

    const elapsed = firstShownAt.current
      ? Date.now() - firstShownAt.current
      : 0;
    const wait = Math.max(0, minDuration - elapsed);

    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      hideTimer.current = null;
      setIsLoading(false);
      firstShownAt.current = null;
    }, wait);
  };

  // helper para envolver Promises com delay + duração mínima
  const withLoading = async (fn, text, opts = {}) => {
    const { delay = 150, minDuration = 350 } = opts;
    showDelayed(delay, text);
    try {
      return await fn();
    } finally {
      hideWithMin(minDuration);
    }
  };

  const value = useMemo(
    () => ({
      isLoading,
      label,
      setLabel,
      show,
      hide,
      withLoading, // preferido
      showDelayed, // opcional
      hideWithMin,
      reset, // opcional
    }),
    [isLoading, label]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx)
    throw new Error("useLoading deve ser usado dentro de <LoadingProvider>");
  return ctx;
}
