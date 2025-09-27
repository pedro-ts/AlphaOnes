import styles from './Relogio.module.css'
import { useEffect, useMemo, useState } from "react";


const Relogio = () => {
    const [now, setNow] = useState(new Date());

    // formatador fixo para Brasília
    const formatter = useMemo(
      () =>
        new Intl.DateTimeFormat("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "America/Sao_Paulo",
        }),
      []
    );

    useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

  return (
    <div>
      <div className={styles.relogio}>
        {formatter.format(now)}
      </div>
    </div>
  );
}

export default Relogio
