import styles from "./NotFound.module.css";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className={styles["notFound-container"]}>
      <div id="clouds">
        <div className={`${styles["cloud"]} ${styles["x1"]}`}></div>
        <div className={`${styles["cloud"]} ${styles["x1_5"]}`}></div>
        <div className={`${styles["cloud"]} ${styles["x2"]}`}></div>
        <div className={`${styles["cloud"]} ${styles["x3"]}`}></div>
        <div className={`${styles["cloud"]} ${styles["x4"]}`}></div>
        <div className={`${styles["cloud"]} ${styles["x5"]}`}></div>
      </div>
      <div className={styles["c"]}>
        <div className={styles["_404"]}>404</div>
        <hr />
        <div className={styles["_1"]}>A PÁGINA</div>
        <div className={styles["_2"]}>NÃO FOI ENCONTRADA</div>
        <Link className={styles["btn"]} to={"/"}>
          VOLTAR PARA O SITE
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
