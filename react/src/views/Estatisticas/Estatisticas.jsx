import FiltroEstatisticas from "../../components/FiltroEstatisticas/FiltroEstatisticas";
import { useState } from "react";
// components
import styles from "./Estatisticas.module.css";
import GraficoColunasEstatisticas from "../../components/GraficoColunasEstatisticas/GraficoColunasEstatisticas";
import EstatisticaMainInfoConatiner from "../../components/EstatisticaMainInfoConatiner/EstatisticaMainInfoConatiner";

const Estatisticas = () => {
  const [bases, setBases] = useState([
    "governo",
    "numeros-privados",
    "aposentados",
    "sao-paulo",
  ]);

  const [mainInfos] = useState([
    {
      titulo: "Taxa de completamento geral",
      valor: "39%",
      dias: [
        "01/10",
        "02/10",
        "03/10",
        "04/10",
        "05/10",
        "06/10",
        "07/10",
        "08/10",
        "09/10",
        "10/10",
      ],
      valores: [120, 80, 150, 200, 90, 300, 250, 170, 220, 140],
    },
    {
      titulo: "Ligações feitas no dia",
      valor: "200.004",
      dias: [
        "01/10",
        "02/10",
        "03/10",
        "04/10",
        "05/10",
        "06/10",
        "07/10",
        "08/10",
        "09/10",
        "10/10",
      ],
      valores: [120, 80, 150, 200, 90, 300, 250, 170, 220, 140],
    },
    {
      titulo: "Falhas no dia",
      valor: "130.012",
      dias: [
        "01/10",
        "02/10",
        "03/10",
        "04/10",
        "05/10",
        "06/10",
        "07/10",
        "08/10",
        "09/10",
        "10/10",
      ],
      valores: [120, 80, 150, 200, 90, 300, 250, 170, 220, 140],
    },
    {
      titulo: "Caixas postais",
      valor: "212",
      dias: [
        "01/10",
        "02/10",
        "03/10",
        "04/10",
        "05/10",
        "06/10",
        "07/10",
        "08/10",
        "09/10",
        "10/10",
      ],
      valores: [120, 80, 150, 200, 90, 300, 250, 170, 220, 140],
    },
    {
      titulo: "Custo telefonia diário",
      valor: "R$ 2.300",
      dias: [
        "01/10",
        "02/10",
        "03/10",
        "04/10",
        "05/10",
        "06/10",
        "07/10",
        "08/10",
        "09/10",
        "10/10",
      ],
      valores: [120, 80, 150, 200, 90, 300, 250, 170, 220, 140],
    },
  ]);
  // const [mainInfos] = useState([
  //   {
  //     titulo: "Taxa de completamento geral",
  //     valor: "39%",
  //     dias: ["01/10","02/10","03/10","04/10","05/10","06/10","07/10","08/10","09/10","10/10"],
  //     valores: [120,80,150,200,90,300,250,170,220,140],
  //   }
  // ]);

  return (
    <div className={styles["estatisticas-container"]}>
      <FiltroEstatisticas bases={bases} />
      {/* duas divs, sendo uma par ao principal quando não se tem nenhum filtro aplicada e outra para quando temos o filtro ativado, para isso é necessario criar 2 componentes para cada uma das situações */}
      <div className={styles["main-container"]}>
        {mainInfos.map((info, i) => (
          <EstatisticaMainInfoConatiner
            key={i}
            titulo={info.titulo}
            valor={info.valor}
            dias={info.dias}
            valores={info.valores}
          />
        ))}
        ;
      </div>
    </div>
  );
};

export default Estatisticas;
