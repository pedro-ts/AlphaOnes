import styles from "./EstatisticasListaContainer.module.css";
import { useEffect, useRef, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const EstatisticasListaContainer = ({ key, listaKey, lista }) => {
  if (!lista) return null;

  // Doughnut gate
  const chartRef = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold: 0.2 }
    );
    if (chartRef.current) obs.observe(chartRef.current);
    return () => obs.disconnect();
  }, []);

  // Bars gate (100% visível)
  const tabRef = useRef(null);
  const [barsReady, setBarsReady] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio === 1) {
          requestAnimationFrame(() =>
            requestAnimationFrame(() => setBarsReady(true))
          );
        }
      },
      { threshold: 1 }
    );
    if (tabRef.current) obs.observe(tabRef.current);
    return () => obs.disconnect();
  }, []);

  // Legenda: anima apenas quando cada <li> entra na viewport
  const legendRef = useRef(null);
  useEffect(() => {
    const els = legendRef.current?.querySelectorAll("li") ?? [];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) en.target.classList.add(styles.show);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const listaInfo = lista;

  const doughnutData = {
    labels: [
      "Abandonadas",
      "Atendidas",
      "Caixa postal pré atendimento",
      "Caixa postal pós atendimento",
      "Falhas",
      "Não atendidas",
      "Total telefones",
    ],
    datasets: [
      {
        data: [
          lista["Abandonadas"],
          lista["Atendidas"],
          lista["Caixa postal pré atendimento"],
          lista["Caixa postal pós atendimento"],
          lista["Falhas"],
          lista["Não atendidas"],
          lista["Total telefones"],
        ],
        backgroundColor: [
          "#102A43",
          "#243B53",
          "#334E68",
          "#627D98",
          "#9CB2C0",
          "#BCCCDC",
          "#DDE4EA",
        ],
        borderWidth: 0.7,
      },
    ],
  };

  const doughnutOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    animation: {
      duration: 1000,
      animateRotate: true,
      animateScale: true,
      delay: (ctx) => (ctx.type === "data" ? ctx.dataIndex * 240 : 0),
    },
  };

  const barData = {
    labels: listaInfo["grafico"]["label"],
    datasets: [
      {
        label: "Valores",
        data: listaInfo["grafico"]["values"],
        backgroundColor: [
          "#7DD3FC",
          "#60A5FA",
          "#34D399",
          "#FBBF24",
          "#F97316",
          "#F472B6",
          "#A78BFA",
          "#FCA5A5",
          "#67E8F9",
          "#4ADE80",
          "#84CC16",
          "#FDE68A",
          "#C4B5FD",
          "#F0ABFC",
          "#FB7185",
        ],
        borderRadius: 5,
        hidden: !barsReady, // barras só quando 100%
      },
    ],
  };

  const barOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#fff" } },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5, color: "#fff" },
        grid: { color: "rgba(255,255,255,0.12)" },
      },
    },
    animations: {
      y: {
        from: (ctx) => ctx.chart.scales.y.getPixelForValue(0),
        duration: 1200,
        easing: "easeOutBack",
      },
    },
    animation: {
      delay: (ctx) => (ctx.type === "data" ? ctx.dataIndex * 150 : 0),
    },
  };

  return (
    <div className={styles.container}>
      <h3>Ligações</h3>

      <div className={styles.headers}>
        <ul>
          <li>
            <b>Nome da lista:</b> {listaInfo["nome"]}
          </li>
          <li className={styles["horaContainer"]}>
            <b>Data e hora:</b> {listaInfo["horario"]}
          </li>
        </ul>
      </div>

      <div className={styles.containerLigacoes}>
        <div
          ref={chartRef}
          className={styles.containerGraficoLigacoes}
          style={{ position: "relative" }}
        >
          {inView ? (
            <Doughnut
              data={doughnutData}
              options={doughnutOptions}
              style={{ height: "100%" }}
            />
          ) : null}
        </div>
        <div className={styles.containerInfoLigacoes}>
          <ul>
            <li>
              <b>Abandonadas:</b> {listaInfo["Abandonadas"]}
            </li>
            <li>
              <b>Atendidas:</b> {listaInfo["Atendidas"]}
            </li>
            <li>
              <b>Caixa postal pré atendimento:</b>{" "}
              {listaInfo["Caixa postal pré atendimento"]}
            </li>
            <li>
              <b>Caixa postal pós atendimento:</b>{" "}
              {listaInfo["Caixa postal pós atendimento"]}
            </li>
            <li>
              <b>Falhas:</b> {listaInfo["Falhas"]}
            </li>
            <li>
              <b>Não atendidas:</b> {listaInfo["Não atendidas"]}
            </li>
            <li>
              <b>Total telefones:</b> {listaInfo["Total telefones"]}
            </li>
          </ul>
        </div>
      </div>

      <hr />
      <h3>Tabulação</h3>
      <div className={styles.containerTabulacao}>
        <div ref={tabRef} className={styles.containerGraficoTabulacao}>
          <Bar data={barData} options={barOptions} style={{ height: "100%" }} />
        </div>

        {/* legenda: anima item apenas quando entra na viewport */}
        <div className={styles.containerInfoTabulacao}>
          <ul ref={legendRef} className={styles.legendList}>
            {barData.labels.map((label, i) => (
              <li
                key={i}
                className={styles.legendItem}
                style={{ "--delay": i * 0.1 }}
              >
                <span
                  className={styles.colorSwatch}
                  style={{
                    backgroundColor: barData.datasets[0].backgroundColor[i],
                  }}
                />
                <span className={styles.legendLabel}>{label}</span>
                <span className={styles.legendValue}>
                  {barData.datasets[0].data[i]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EstatisticasListaContainer;
