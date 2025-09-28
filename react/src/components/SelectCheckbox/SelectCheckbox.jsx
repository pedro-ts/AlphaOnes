import { useEffect, useRef, useState } from "react";
import styles from "./SelectCheckbox.module.css";

/**
 * USO:
 * <SelectCheckbox
 *   label="Campanhas"
 *   items={bases}                 // ex.: ["governo","numeros-privados","aposentados","sao-paulo"]
 *   value={basesSelecionadas}     // array selecionado
 *   onChange={setBasesSelecionadas}
 * />
 *
 * Retorna em onChange um array com os nomes marcados.
 */
export default function SelectCheckbox({
  label = "Opções",
  items = [],
  value = [],
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggle = (name) => {
    const next = value.includes(name)
      ? value.filter((x) => x !== name)
      : [...value, name];
    onChange?.(next);
  };

  // fechar ao clicar fora
  useEffect(() => {
    const h = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {label}
        <span className={styles.badge}>{value.length}</span>
        <span className={styles.caret} />
      </button>

      {open && (
        <div className={styles.panel} role="listbox">
          {items.map((name) => (
            <label key={name} className={styles.option}>
              <input
                type="checkbox"
                checked={value.includes(name)}
                onChange={() => toggle(name)}
              />
              <span>{name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
