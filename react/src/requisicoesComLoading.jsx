import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import axiosClient from "../axios-client";
import useLoadingTask from "../hooks/useLoadingTask";
import { useStateContext } from "../../context/ContextProvider"; //NOTIFICAÇÃO GLOBAL

// traduz statusCode em mensagem
function getErrorMessage(error) {
  if (!error) return "Erro desconhecido.";
  if (error.message === "Network Error")
    return "Falha de rede. Verifique a conexão.";
  const status = error.response?.status;

  switch (status) {
    case 400:
      return "Requisição inválida (400).";
    case 401:
      return "Não autorizado (401).";
    case 403:
      return "Acesso negado (403).";
    case 404:
      return "Recurso não encontrado (404).";
    case 422:
      return "Dados inválidos (422).";
    case 500:
      return "Erro interno no servidor (500).";
    default:
      return `Erro inesperado${status ? ` (${status})` : ""}.`;
  }
}

export default function ItemPage() {
  const { id } = useParams();
  const { search, state: navState } = useLocation();
  const qs = useMemo(() => new URLSearchParams(search), [search]);

  //NOTIFICAÇÃO GLOBAL
  // import { useStateContext } from "../../context/ContextProvider";
  const { setNotification } = useStateContext();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const { wrap } = useLoadingTask("Carregando...");

  // GET
  const fetchItem = () =>
    wrap(
      async () => {
        try {
          setError(null);
          const { data: res } = await axiosClient.get(`/items/${id}`);
          setData(res);
        } catch (err) {
          setError(getErrorMessage(err));
        }
      },
      "Carregando item...",
      { delay: 120, minDuration: 350 }
    );

  // POST
  const createItem = (payload) =>
    wrap(
      async () => {
        try {
          setError(null);
          const { data: res } = await axiosClient.post(`/items`, payload);
          setData(res);
        } catch (err) {
          setError(getErrorMessage(err));
        }
      },
      "Criando item...",
      { delay: 0, minDuration: 400 }
    );

  // PUT
  const updateItem = (payload) =>
    wrap(
      async () => {
        try {
          setError(null);
          const { data: res } = await axiosClient.put(`/items/${id}`, payload);
          setData(res);
        } catch (err) {
          setError(getErrorMessage(err));
        }
      },
      "Atualizando item...",
      { delay: 0, minDuration: 400 }
    );

  // PATCH
  const patchItem = (partial) =>
    wrap(
      async () => {
        try {
          setError(null);
          const { data: res } = await axiosClient.patch(
            `/items/${id}`,
            partial
          );
          setData(res);
        } catch (err) {
          setError(getErrorMessage(err));
        }
      },
      "Aplicando alterações...",
      { delay: 0, minDuration: 400 }
    );

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div>
      <h1>Item {id}</h1>

      {error && (
        <div
          style={{
            margin: "12px 0",
            padding: "8px 10px",
            borderRadius: 6,
            background: "#ffebeb",
            color: "#a70000",
            border: "1px solid #a70000",
          }}
        >
          {error}
        </div>
      )}

      <pre>
        {JSON.stringify(
          { data, query: Object.fromEntries(qs), navState },
          null,
          2
        )}
      </pre>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => createItem({ name: "Novo" })}>POST</button>
        <button onClick={() => updateItem({ name: "Atualizado" })}>PUT</button>
        <button onClick={() => patchItem({ status: "ativo" })}>PATCH</button>
        <button onClick={fetchItem}>GET</button>
      </div>
    </div>
  );
}
