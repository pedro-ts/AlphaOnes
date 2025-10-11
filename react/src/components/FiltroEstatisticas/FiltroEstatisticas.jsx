import { useState, useMemo } from "react";
import styles from "./FiltroEstatisticas.module.css";
import SelectCheckbox from "../SelectCheckbox/SelectCheckbox";

export default function FiltroEstatisticas({ bases = [], onBuscar }) {
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [ordem, setOrdem] = useState("desc");
  const [selectedNames, setSelectedNames] = useState([]);

  const idByName = useMemo(
    () => Object.fromEntries((bases || []).map((b) => [b.name, b.id])),
    [bases]
  );

  const handleBuscar = () => {
    const basesSelecionadas = selectedNames
      .map((n) => idByName[n])
      .filter((id) => id != null);

    const payload = { inicio, fim, ids:basesSelecionadas, ordem };
    onBuscar?.(payload);
  };

  return (
    <div className={styles["filtro-estatisticas-container"]}>
      <div className={styles.row}>
        <div className={styles["div-campanhas"]}>
          <SelectCheckbox
            label="Campanhas"
            items={(bases || []).map((b) => b.name)} // exibe nome
            value={selectedNames} // controla nomes
            onChange={setSelectedNames}
          />
        </div>

        <div className={styles.group}>
          <label className={styles.label} htmlFor="inicio">
            início
          </label>
          <input
            id="inicio"
            type="date"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.group}>
          <label className={styles.label} htmlFor="fim">
            fim
          </label>
          <input
            id="fim"
            type="date"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={`${styles.row2} ${styles["ordenar-container"]}`}>
        <div className={styles.groupWide}>
          <span className={styles.legend}>ordenar</span>
          <select
            value={ordem}
            onChange={(e) => setOrdem(e.target.value)}
            className={styles.select}
          >
            <option value="desc">Data mais recente</option>
            <option value="asc">Data menos recente</option>
          </select>
        </div>

        <button type="button" className={styles.buscar} onClick={handleBuscar}>
          Buscar
        </button>
      </div>
    </div>
  );
}
