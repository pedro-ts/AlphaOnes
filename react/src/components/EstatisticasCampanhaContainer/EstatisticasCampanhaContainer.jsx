import EstatisticasListaContainer from "../EstatisticasListaContainer/EstatisticasListaContainer";
import styles from "./EstatisticasCampanhaContainer.module.css";
import { useMemo } from "react";

export default function EstatisticasCampanhaContainer({ data, campanhaIds }) {
  // Tranforma id em nome
  function getCampanhaNomeById(campanhaIds, id) {
  const alvo = String(id);
  const hit = (campanhaIds || []).find(c => String(c.id) === alvo);
  return hit ? hit.name : null;
}
  // mantém ordem original do objeto; sem sorts
  const allowSet = useMemo(
    () =>
      Array.isArray(campanhaIds) && campanhaIds.length
        ? new Set(campanhaIds.map(String))
        : null,
    [campanhaIds]
  );

  const grupos = useMemo(() => {
    const raiz = data && typeof data === "object" ? data : {};

    // monta grupos na MESMA ordem de Object.entries
    const base = Object.entries(raiz).map(([parentId, listas]) => ({
      parentId,
      // listas também na ordem original (sem sort)
      children: Object.entries(listas || {}).map(([listaKey, lista]) => ({
        listaKey,
        lista,
      })),
    }));

    // filtra se houver ids permitidos, sem reordenar
    if (allowSet) {
      const filtrados = base.filter((g) => allowSet.has(String(g.parentId)));
      return filtrados.length ? filtrados : base;
    }
    return base;
  }, [data, allowSet]);

  if (!grupos.length) {
    return (
      <div className={styles.container}>
        <p>Nenhum dado para exibir.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {grupos.map(({ parentId, children }) => (
        <div className={styles["containerObj"]}>
          <div className={styles.title} key={parentId}>
            <h2>{getCampanhaNomeById(campanhaIds, parentId)}</h2>
            <div className={styles.content}>
              {children.map(({ listaKey, lista }) => (
                <EstatisticasListaContainer
                  key={`${parentId}-${listaKey}`}
                  parentId={parentId}
                  listaKey={listaKey}
                  lista={lista}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
