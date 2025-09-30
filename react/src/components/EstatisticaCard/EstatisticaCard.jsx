import styles from "./EstatisticaCard.module.css";

const EstatisticaCard = ({ valor, titulo }) => {
  return (
    <div className={styles["card-container"]}>
      <h2>{titulo}</h2>
      <p>{valor}</p>
    </div>
  );
};

export default EstatisticaCard;
