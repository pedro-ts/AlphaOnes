import { useState } from "react";
import axiosClient from "./axios-client";
import Loading from "./components/Loading/Loading";
import { useLoading } from "./context/LoadingContext";

// Este componente serve como documentação viva de como acoplar o Loading
// às requisições feitas com axiosClient. Sinta-se livre para copiar/colar
// partes deste fluxo em outras telas.
export default function RequisicoesComLoading() {
  // 1) Pegue as ferramentas do LoadingContext.
  const { isLoading, label, setLabel, show, hideWithMin } = useLoading();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // 2) Crie uma função que envolva a requisição.
  const fetchProtectedResource = async () => {
    setResult(null);
    setError(null);

    // 2.1) Defina o texto que aparecerá dentro do overlay.
    setLabel("Carregando dados...");
    // 2.2) Ative o overlay. A partir daqui o Loading ficará visível.
    show();

    try {
      // 2.3) Faça a chamada usando o axiosClient. Aqui mantemos o padrão
      // de uma chamada simples GET. Substitua o endpoint pelos seus.
      const { data } = await axiosClient.get("/exemplo/protegido");
      setResult(data);
    } catch (err) {
      // 2.4) Trate erros normalmente. Mantenha a estrutura parecida para
      // aproveitar mensagens retornadas pelo backend.
      const response = err?.response;
      if (response?.data?.message) {
        setError(response.data.message);
      } else {
        setError("Não foi possível completar a requisição.");
      }
    } finally {
      // 2.5) Sempre esconda o overlay no finally. hideWithMin mantém o
      // spinner visível por alguns milissegundos para evitar flicker.
      hideWithMin(400);
    }
  };

  return (
    <div className="requisicoes-com-loading">
      {/* 3) Posicione o componente <Loading /> em um local de alto nível.
          Ele precisa estar presente para reagir às mudanças de contexto. */}
      <Loading active={isLoading} text={label} />

      <h2>Exemplo de requisição com Loading</h2>
      <p>
        Clique no botão abaixo para disparar a chamada com o overlay ativo
        até a resposta chegar.
      </p>

      <button type="button" onClick={fetchProtectedResource}>
        Buscar dados protegidos
      </button>

      {result && (
        <pre className="resultado">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      {error && (
        <p className="erro" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
