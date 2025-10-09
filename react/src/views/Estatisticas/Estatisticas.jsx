import FiltroEstatisticas from "../../components/FiltroEstatisticas/FiltroEstatisticas";
import { useState, useEffect, useRef } from "react";
// components
import styles from "./Estatisticas.module.css";
// Loading
import Loading from "../../components/Loading/Loading";
import { useLoading } from "../../context/LoadingContext";
// Axios
import axiosClient from '../../axios-client'

const Estatisticas = () => {
  const {setLabel, show, hideWithMin } = useLoading();

  const [dados, setDados] = useState({});

  const [ dataTeste , setDataTeste] = useState({});

  const [bases, setBases] = useState([]);

  const [basesObtidas, setBasesObtidas] = useState(false);
  
// Obtem as bases

useEffect(() => {
  const data = [];
  (async () => {
    setLabel("Carregando Campanhas...");
    show();
    try {
      if(basesObtidas == false){
      const { data } = await axiosClient.get("/estatisticas/bases");
      setBases(data)
      setBasesObtidas(true);
      console.log("resposta:", data); // loga a resposta já recebida
      }
      setDataTeste(data); // use data, não a Promise
    } catch (e) {
      console.error(e);
    } finally {
      await hideWithMin(400); // se for Promise; se não, remova o await
    }
  })();

  return () => {};
}, []);

  const [searched, setSearched] = useState(false); //deixar por padão false

  const handleBuscar = async (filtro) => {
    setLabel("Fazendo busca...");
    show();

    // setErro(null);
    try {
      const { data } = await axiosClient.post("/estatisticas/campanha", filtro);
      setDados(data);
      console.log(data);
      setSearched(true);

    } catch (e) {
      setErro(e?.response?.data?.message || "Falha ao buscar estatísticas");
      setSearched(false);
    } finally {
      hideWithMin(400); //finaliza loading
    }
  };

  return (
    <div className={styles["estatisticas-container"]}>
      <FiltroEstatisticas bases={bases} onBuscar={handleBuscar} />
      {/* duas divs, sendo uma par ao principal quando não se tem nenhum filtro aplicada e outra para quando temos o filtro ativado, para isso é necessario criar 2 componentes para cada uma das situações */}
      {searched === true && (
        <div className={styles["main-container-searched"]}></div>
      )}

      {searched == false && (
        <div className={styles["main-container"]}>
          <div className={styles["box-of-star1"]}>
            <div className={`${styles.star} ${styles["star-position1"]}`}></div>
            <div className={`${styles.star} ${styles["star-position2"]}`}></div>
            <div className={`${styles.star} ${styles["star-position3"]}`}></div>
            <div className={`${styles.star} ${styles["star-position4"]}`}></div>
            <div className={`${styles.star} ${styles["star-position5"]}`}></div>
            <div className={`${styles.star} ${styles["star-position6"]}`}></div>
            <div className={`${styles.star} ${styles["star-position7"]}`}></div>
          </div>

          <div className={styles["box-of-star2"]}>
            <div className={`${styles.star} ${styles["star-position1"]}`}></div>
            <div className={`${styles.star} ${styles["star-position2"]}`}></div>
            <div className={`${styles.star} ${styles["star-position3"]}`}></div>
            <div className={`${styles.star} ${styles["star-position4"]}`}></div>
            <div className={`${styles.star} ${styles["star-position5"]}`}></div>
            <div className={`${styles.star} ${styles["star-position6"]}`}></div>
            <div className={`${styles.star} ${styles["star-position7"]}`}></div>
          </div>

          <div className={styles["box-of-star3"]}>
            <div className={`${styles.star} ${styles["star-position1"]}`}></div>
            <div className={`${styles.star} ${styles["star-position2"]}`}></div>
            <div className={`${styles.star} ${styles["star-position3"]}`}></div>
            <div className={`${styles.star} ${styles["star-position4"]}`}></div>
            <div className={`${styles.star} ${styles["star-position5"]}`}></div>
            <div className={`${styles.star} ${styles["star-position6"]}`}></div>
            <div className={`${styles.star} ${styles["star-position7"]}`}></div>
          </div>

          <div className={styles["box-of-star4"]}>
            <div className={`${styles.star} ${styles["star-position1"]}`}></div>
            <div className={`${styles.star} ${styles["star-position2"]}`}></div>
            <div className={`${styles.star} ${styles["star-position3"]}`}></div>
            <div className={`${styles.star} ${styles["star-position4"]}`}></div>
            <div className={`${styles.star} ${styles["star-position5"]}`}></div>
            <div className={`${styles.star} ${styles["star-position6"]}`}></div>
            <div className={`${styles.star} ${styles["star-position7"]}`}></div>
          </div>

          <div data-js="astro" className={styles.astronaut}>
            <div className={styles.head}></div>
            <div className={`${styles.arm} ${styles["arm-left"]}`}></div>
            <div className={`${styles.arm} ${styles["arm-right"]}`}></div>
            <div className={styles.body}>
              <div className={styles.panel}></div>
            </div>
            <div className={`${styles.leg} ${styles["leg-left"]}`}></div>
            <div className={`${styles.leg} ${styles["leg-right"]}`}></div>
            <div className={styles.schoolbag}></div>
          </div>
          <div className={styles["text-container"]}>
            <h2 className={styles["title-main"]}>Aguardando pesquisa...</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Estatisticas;
