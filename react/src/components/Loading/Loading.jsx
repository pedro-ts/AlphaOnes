import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Loading.module.css";

export default function Loading({ active = false, text = "Carregando..." }) {
  useEffect(() => {
    if (!active) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [active]);

  if (!active) return null;

  return createPortal(
    <div
      className={styles.overlay}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={styles.box}>
        <div className={styles.uiverseLoader} aria-hidden="true">
          {/* Loader Uiverse */}
          <div className="loader">
            <div className="box box0">
              <div></div>
            </div>
            <div className="box box1">
              <div></div>
            </div>
            <div className="box box2">
              <div></div>
            </div>
            <div className="box box3">
              <div></div>
            </div>
            <div className="box box4">
              <div></div>
            </div>
            <div className="box box5">
              <div></div>
            </div>
            <div className="box box6">
              <div></div>
            </div>
            <div className="box box7">
              <div></div>
            </div>
            <div className="ground">
              <div></div>
            </div>
          </div>
        </div>

        <span className={styles.label}>{text}</span>
      </div>
    </div>,
    document.body
  );
}
