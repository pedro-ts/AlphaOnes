import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./GraficoColunas.module.css"; // import do module.css

const dados = [
  { dia: "01/10", valor: 120 },
  { dia: "02/10", valor: 80 },
  { dia: "03/10", valor: 150 },
  { dia: "04/10", valor: 200 },
  { dia: "05/10", valor: 90 },
  { dia: "06/10", valor: 300 },
  { dia: "07/10", valor: 250 },
  { dia: "08/10", valor: 170 },
  { dia: "09/10", valor: 220 },
  { dia: "10/10", valor: 140 },
];

export default function GraficoColunas() {
  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Gráfico de Colunas - Últimos 10 dias</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dia" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="valor" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
