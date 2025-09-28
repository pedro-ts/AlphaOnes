import { useState } from "react";
import styles from "./FiltroEstatisticas.module.css";
import SelectCheckbox from "../SelectCheckbox/SelectCheckbox";

export default function FiltroEstatisticas({ bases = []}) {
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [ordem, setOrdem] = useState("desc"); // desc = Data mais recente
  const [basesSelecionadas, setBasesSelecionadas] = useState([]);
  const [openCampanhas, setOpenCampanhas] = useState(false);

  const toggleBase = (nome) => {
    setBasesSelecionadas((prev) =>
      prev.includes(nome) ? prev.filter((x) => x !== nome) : [...prev, nome]
    );
  };

  const handleBuscar = () => {
    const payload = { inicio, fim, basesSelecionadas, ordem };
    console.log(payload);
  };

  return (
    <div className={styles["filtro-estatisticas-container"]}>
      {/* Linha 1: Campanhas + período */}
      <div className={styles.row}>
        {/* Campanhas (dropdown com checkboxes) */}
        <div className={styles["div-campanhas"]}>
              <SelectCheckbox
                label="Campanhas"
                items={bases}
                value={basesSelecionadas}
                onChange={setBasesSelecionadas}
              />
        </div>

        {/* Período: início e fim */}
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

      {/* Linha 2: Ordenar + Buscar */}
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
