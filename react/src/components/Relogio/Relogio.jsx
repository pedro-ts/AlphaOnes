import styles from "./Relogio.module.css";
import { useEffect, useMemo, useState } from "react";

const Relogio = () => {
  const [now, setNow] = useState(new Date());

  // Hora Brasília
  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/Sao_Paulo",
      }),
    []
  );

  // Data no modelo Brasil: domingo, 28 de setembro de 2025
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "America/Sao_Paulo",
      }),
    []
  );

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles["relogio-wrap"]}>
      <div className={styles.data}>{dateFormatter.format(now)}</div>
      <div className={styles.relogio}>{timeFormatter.format(now)}</div>
    </div>
  );
};

export default Relogio;
