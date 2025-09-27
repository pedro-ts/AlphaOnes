import { useCallback } from "react";
import { useLoading } from "../context/LoadingContext";

/**
 * useLoadingTask
 * - wrap(asyncFn, label?, opts?): executa a função com overlay.
 * - run(promise, label?, opts?): idem para uma Promise já criada.
 * opts = { delay?: number, minDuration?: number }
 */
export default function useLoadingTask(defaultLabel = "Carregando...") {
  const { withLoading, setLabel } = useLoading();

  const wrap = useCallback(
    async (asyncFn, label = defaultLabel, opts) => {
      if (label) setLabel(label);
      return withLoading(asyncFn, label, opts);
    },
    [defaultLabel, setLabel, withLoading]
  );

  const run = useCallback(
    (promise, label = defaultLabel, opts) => {
      if (label) setLabel(label);
      return withLoading(() => promise, label, opts);
    },
    [defaultLabel, setLabel, withLoading]
  );

  return { wrap, run };
}
