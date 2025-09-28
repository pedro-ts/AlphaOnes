import FiltroEstatisticas from '../../components/FiltroEstatisticas/FiltroEstatisticas'
import { useState } from 'react'
// components
import styles from './Estatisticas.module.css'

const Estatisticas = () => {
  const [bases, setBases] = useState([
    "governo",
    "numeros-privados",
    "aposentados",
    "sao-paulo",
  ]);

  
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
