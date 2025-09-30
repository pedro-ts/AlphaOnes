import styles from "./EstatisticaMainInfoConatiner.module.css";
// components
import GraficoColunasEstatisticas from "../GraficoColunasEstatisticas/GraficoColunasEstatisticas";
import EstatisticasCard from "../EstatisticaCard/EstatisticaCard";

const EstatisticaMainInfoConatiner = ({titulo, valor, dias, valores}) => {
  return (
    <div className={styles["main-container"]}>
        <GraficoColunasEstatisticas dias={dias} valores={valores} titulo={titulo}/>
        <EstatisticasCard titulo={titulo} valor={valor}/>
    </div>
  );
};

export default EstatisticaMainInfoConatiner;
