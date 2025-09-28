import styles from './Home.module.css'
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
// hooks
import { useStateContext } from "../../context/ContextProvider";
// Components
import Icon from '../../components/Icon/Icon';
import Relogio from '../../components/Relogio/Relogio';
import Welcome from '../../components/Welcome/Welcome';

const Home = () => {
  const { user, welcome, setWelcome } = useStateContext();

  const apps = [
    { id: "/estatisticas", name: "Estatísticas", img: "/icons/estatisticas.png" },
    { id: "/arquivos", name: "Arquivos", img: "/icons/folder.png" },
    { id: "/musicas", name: "Músicas", img: "/icons/music.png" },
    // { id: "1", name: "Navegador", img: "/icons/browser.png" },
    // { id: "2", name: "Arquivos", img: "/icons/folder.png" },
    // { id: "3", name: "Músicas", img: "/icons/music.png" },
    // { id: "1", name: "Navegador", img: "/icons/browser.png" },
    // { id: "2", name: "Arquivos", img: "/icons/folder.png" },
    // { id: "3", name: "Músicas", img: "/icons/music.png" },
    // { id: "1", name: "Navegador", img: "/icons/browser.png" },
    // { id: "2", name: "Arquivos", img: "/icons/folder.png" },
    // { id: "3", name: "Músicas", img: "/icons/music.png" },
    // { id: "1", name: "Navegador", img: "/icons/browser.png" },
    // { id: "2", name: "Arquivos", img: "/icons/folder.png" },
    // { id: "3", name: "Músicas", img: "/icons/music.png" },
    // { id: "1", name: "Navegador", img: "/icons/browser.png" },
    // { id: "2", name: "Arquivos", img: "/icons/folder.png" },
    // { id: "3", name: "Músicas", img: "/icons/music.png" },
  ];
    const navigate = useNavigate();

  const handleOpen = (id) => {
    navigate(id);
  };

  return (
    <div className={styles["home-container"]}>
      <div className={styles["home-container-left"]}>
        {apps.map((app) => (
          <Icon key={app.id} {...app} onOpen={handleOpen} />
        ))}
      </div>

      <div className={styles["home-container-right"]}>
        <div className={styles["home-container-top"]}>
          <Relogio />
        </div>
        <div className={styles["home-container-bottom"]}>{/* bottom */}</div>
      </div>
    </div>
  );
}

export default Home
