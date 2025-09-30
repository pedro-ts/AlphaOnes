import FiltroEstatisticas from '../../components/FiltroEstatisticas/FiltroEstatisticas'
import { useState } from 'react'
// components
import styles from './Estatisticas.module.css'

const Estatisticas = () => {
  const [bases, setBases] = useState([]);
  setBases(["governo", "numeros-privados", "aposentados", "sao-paulo"]);

  const [mainInfos, setMainInfos] = useState([]);
  setBases(
    [
      ["Taxa de completamento geral", "39%"],
      [
        { dia: "01/10", valor: 120 },
        { dia: "02/10", valor: 80 },
        { dia: "03/10", valor: 150 },
        { dia: "04/10", valor: 200 },
        { dia: "05/10", valor: 90 },
        { dia: "06/10", valor: 300 },
        { dia: "07/10", valor: 250 },
        { dia: "08/10", valor: 170 },
        { dia: "09/10", valor: 220 },
        { dia: "10/10", valor: 140 },
      ],
    ], //fim da taxa de completamento
    [
      ["Ligações feitas no dia", "200.004"],
      [
        { dia: "01/10", valor: 120 },
        { dia: "02/10", valor: 80 },
        { dia: "03/10", valor: 150 },
        { dia: "04/10", valor: 200 },
        { dia: "05/10", valor: 90 },
        { dia: "06/10", valor: 300 },
        { dia: "07/10", valor: 250 },
        { dia: "08/10", valor: 170 },
        { dia: "09/10", valor: 220 },
        { dia: "10/10", valor: 140 },
      ],
    ], //fim das ligações feitas no dia
    [
      ["Falhas no dia", "130.012"],
      [
        { dia: "01/10", valor: 120 },
        { dia: "02/10", valor: 80 },
        { dia: "03/10", valor: 150 },
        { dia: "04/10", valor: 200 },
        { dia: "05/10", valor: 90 },
        { dia: "06/10", valor: 300 },
        { dia: "07/10", valor: 250 },
        { dia: "08/10", valor: 170 },
        { dia: "09/10", valor: 220 },
        { dia: "10/10", valor: 140 },
      ],
    ], //fim das falhas no dia
    [
      ["Caixas postais", "212"],
      [
        { dia: "01/10", valor: 120 },
        { dia: "02/10", valor: 80 },
        { dia: "03/10", valor: 150 },
        { dia: "04/10", valor: 200 },
        { dia: "05/10", valor: 90 },
        { dia: "06/10", valor: 300 },
        { dia: "07/10", valor: 250 },
        { dia: "08/10", valor: 170 },
        { dia: "09/10", valor: 220 },
        { dia: "10/10", valor: 140 },
      ],
    ], //fim das caixas postais
    [
      ["Custo telefonia diário", "R$2.300"],
      [
        { dia: "01/10", valor: 120 },
        { dia: "02/10", valor: 80 },
        { dia: "03/10", valor: 150 },
        { dia: "04/10", valor: 200 },
        { dia: "05/10", valor: 90 },
        { dia: "06/10", valor: 300 },
        { dia: "07/10", valor: 250 },
        { dia: "08/10", valor: 170 },
        { dia: "09/10", valor: 220 },
        { dia: "10/10", valor: 140 },
      ], //fim do custo telefonia diário
    ]
    // [["Custo telefonia diário", "R$2.300"], []]
  );

  
  return (
    <div className={styles["estatisticas-container"]}>
      <FiltroEstatisticas bases={bases}/>
      {/* duas divs, sendo uma par ao principal quando não se tem nenhum filtro aplicada e outra para quando temos o filtro ativado, para isso é necessario criar 2 componentes para cada uma das situações */}
      <div className={styles["main-container"]}>

      </div>
    </div>
  )
}

export default Estatisticas
