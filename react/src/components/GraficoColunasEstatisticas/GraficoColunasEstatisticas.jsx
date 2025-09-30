import { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import styles from "./GraficoColunasEstatisticas.module.css";

const GraficoColunasEstatisticas = ({
  dias = [],
  valores = [],
  titulo = "",
}) => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const options = {
      chart: { type: "bar", height: 280, toolbar: { show: false } },
      series: [{ name: titulo || "Série", data: valores }],
      xaxis: {
        categories: dias,
        labels: {
          style: { colors: "#ffffff" }, // texto branco no eixo X
        },
      },
      yaxis: {
        labels: {
          style: { colors: "#ffffff" }, // texto branco no eixo Y
        },
      },
      dataLabels: { enabled: false },
      plotOptions: { bar: { columnWidth: "55%", borderRadius: 6 } },
      grid: { strokeDashArray: 4 },
    };

    // cria
    chartRef.current = new ApexCharts(containerRef.current, options);
    chartRef.current.render();

    // limpa
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [dias, valores, titulo]);

  return <div ref={containerRef} className={styles.chart} />;
};

export default GraficoColunasEstatisticas;
