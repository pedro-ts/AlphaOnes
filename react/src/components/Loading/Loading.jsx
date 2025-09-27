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
        <div className={styles.spinner} aria-hidden="true" />
        <span className={styles.label}>{text}</span>
      </div>
    </div>,
    document.body
  );
}
