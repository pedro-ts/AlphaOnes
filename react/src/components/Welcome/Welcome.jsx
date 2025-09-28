import { useEffect, useRef, useState } from "react";
import styles from "./Welcome.module.css";
import { useStateContext } from "../../context/ContextProvider";

// novas durações
const D = {
  START_DELAY: 1000,
  OLA_FADE_IN: 1000,
  OLA_HOLD: 1500,
  OLA_FADE_OUT: 1000,
  BEM_FADE_IN: 800,
  BEM_HOLD: 1500,
  BEM_FADE_OUT: 800,     // novo
  LOGO_FADE_IN: 900,     // novo
  LOGO_HOLD: 1200,       // novo
  LOGO_FADE_OUT: 900,    // novo
  OVERLAY_FADE_OUT: 1000,
};

export const WELCOME_TOTAL_MS =
  D.START_DELAY +
  D.OLA_FADE_IN + D.OLA_HOLD + D.OLA_FADE_OUT +
  D.BEM_FADE_IN + D.BEM_HOLD + D.BEM_FADE_OUT +
  D.LOGO_FADE_IN + D.LOGO_HOLD + D.LOGO_FADE_OUT +
  D.OVERLAY_FADE_OUT; // = 9700 ms

const Welcome = ({ name, logoSrc, logoAlt = "Logo", onFinish }) => {
  const { setWelcome } = useStateContext();

  const [showOla, setShowOla] = useState(false);
  const [olaHidden, setOlaHidden] = useState(false);

  const [showBem, setShowBem] = useState(false);
  const [bemHidden, setBemHidden] = useState(false);     // novo

  const [showLogo, setShowLogo] = useState(false);       // novo
  const [logoHidden, setLogoHidden] = useState(false);   // agora controla fade da logo no final

  const [overlayGone, setOverlayGone] = useState(false);
  const timeoutsRef = useRef([]);

  const fastExit = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setLogoHidden(true);
    setOverlayGone(true);
    const t = setTimeout(() => {
      setWelcome?.(false);
      onFinish?.();
    }, D.OVERLAY_FADE_OUT);
    timeoutsRef.current.push(t);
  };

  useEffect(() => {
    // 1) Olá
    const t1 = setTimeout(() => setShowOla(true), D.START_DELAY);
    const t2 = setTimeout(() => setOlaHidden(true), D.START_DELAY + D.OLA_FADE_IN + D.OLA_HOLD);

    // 2) Seja bem-vindo(a) ao
    const t3 = setTimeout(
      () => setShowBem(true),
      D.START_DELAY + D.OLA_FADE_IN + D.OLA_HOLD + D.OLA_FADE_OUT
    );
    const t4 = setTimeout(
      () => setBemHidden(true),
      D.START_DELAY + D.OLA_FADE_IN + D.OLA_HOLD + D.OLA_FADE_OUT + D.BEM_FADE_IN + D.BEM_HOLD
    );

    // 3) Logo sozinha
    const t5 = setTimeout(
      () => setShowLogo(true),
      D.START_DELAY + D.OLA_FADE_IN + D.OLA_HOLD + D.OLA_FADE_OUT + D.BEM_FADE_IN + D.BEM_HOLD + D.BEM_FADE_OUT
    );
    const t6 = setTimeout(
      () => setLogoHidden(true),
      D.START_DELAY + D.OLA_FADE_IN + D.OLA_HOLD + D.OLA_FADE_OUT + D.BEM_FADE_IN + D.BEM_HOLD + D.BEM_FADE_OUT + D.LOGO_FADE_IN + D.LOGO_HOLD
    );

    // 4) Overlay some e finaliza
    const t7 = setTimeout(() => setOverlayGone(true), WELCOME_TOTAL_MS - D.OVERLAY_FADE_OUT);
    const t8 = setTimeout(() => { setWelcome?.(false); onFinish?.(); }, WELCOME_TOTAL_MS);

    timeoutsRef.current.push(t1,t2,t3,t4,t5,t6,t7,t8);
    return () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = []; };
  }, []);

  const styleVars = {
    "--d-ola-in": `${D.OLA_FADE_IN}ms`,
    "--d-ola-out": `${D.OLA_FADE_OUT}ms`,
    "--d-bem-in": `${D.BEM_FADE_IN}ms`,
    "--d-bem-out": `${D.BEM_FADE_OUT}ms`,
    "--d-logo-in": `${D.LOGO_FADE_IN}ms`,
    "--d-logo-out": `${D.LOGO_FADE_OUT}ms`,
    "--d-overlay-out": `${D.OVERLAY_FADE_OUT}ms`,
  };

  return (
    <div
      className={`${styles["welcome-container"]} ${overlayGone ? styles.transparent : ""}`}
      style={styleVars}
      onClick={fastExit}
      onKeyDown={fastExit}
      role="dialog"
      tabIndex={0}
      aria-label="Boas-vindas"
    >
      {/* 1) Olá, {nome} */}
      <div className={`${styles.layer} ${styles.ola} ${showOla ? styles.visible : ""} ${olaHidden ? styles.hidden : ""}`}>
        <p className={styles.hi}>Olá, <span className={styles.name}>{name}</span></p>
      </div>

      {/* 2) Texto "Seja bem-vindo(a) ao" */}
      <div className={`${styles.layer} ${styles.bem} ${showBem ? styles.visible : ""} ${bemHidden ? styles.hidden : ""}`}>
        <p className={styles.subtitle}>Seja bem-vindo(a) ao</p>
      </div>

      {/* 3) Logo sozinha, centralizada */}
      {logoSrc && (
        <div className={`${styles.layer} ${styles.logoLayer} ${showLogo ? styles.visible : ""}`}>
          <img
            src={logoSrc}
            alt={logoAlt}
            className={`${styles.logoFinal} ${logoHidden ? styles.hidden : ""}`}
            draggable="false"
          />
        </div>
      )}

      <div className={styles.hint}>Pressione qualquer tecla ou clique para pular</div>
    </div>
  );
};

export default Welcome;
