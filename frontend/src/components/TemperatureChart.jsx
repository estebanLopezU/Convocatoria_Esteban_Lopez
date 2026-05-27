import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function TemperatureChart({ inputData, outputData }) {
  const chartData = useMemo(() => {
    if (!inputData || !outputData) return null;

    // Preparar datos de entrada (originales)
    const inputLabels = [];
    const inputTemps = [];

    for (const d of inputData) {
      const temp = parseFloat(d.temp);
      if (!isNaN(temp)) {
        inputLabels.push(`${d.hora.slice(0, 5)}`);
        inputTemps.push(temp);
      }
    }

    // Preparar datos de salida (cincominutales)
    const outputLabels = [];
    const outputTemps = [];

    for (const d of outputData) {
      const temp = parseFloat(d.temp);
      if (!isNaN(temp)) {
        outputLabels.push(`${d.hora.slice(0, 5)}`);
        outputTemps.push(temp);
      }
    }

    return {
      labels: Array.from(
        new Set([...inputLabels, ...outputLabels])
      ).sort((a, b) => {
        const [h1, m1] = a.split(':').map(Number);
        const [h2, m2] = b.split(':').map(Number);
        return h1 * 60 + m1 - h2 * 60 + m2;
      }),
      inputTemps,
      outputTemps,
      inputLabels,
      outputLabels
    };
  }, [inputData, outputData]);

  if (!chartData) {
    return (
      <div className="chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#888' }}>No hay datos de temperatura disponibles para graficar.</p>
      </div>
    );
  }

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Temp Original (°C)',
        data: chartData.labels.map(label => {
          const idx = chartData.inputLabels.indexOf(label);
          return idx !== -1 ? chartData.inputTemps[idx] : null;
        }),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.1)',
        pointBackgroundColor: 'rgb(255, 159, 64)',
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.3,
        spanGaps: false,
        fill: false,
        order: 2
      },
      {
        label: 'Temp Cincominutal (°C)',
        data: chartData.labels.map(label => {
          const idx = chartData.outputLabels.indexOf(label);
          return idx !== -1 ? chartData.outputTemps[idx] : null;
        }),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        spanGaps: false,
        fill: '-1',
        order: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 13
          }
        }
      },
      title: {
        display: true,
        text: 'Comparación de Temperatura: Original vs Cincominutal',
        font: {
          size: 16,
          weight: '600'
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 13
        },
        bodyFont: {
          size: 12
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (value === null) return `${label}: Sin dato`;
            return `${label}: ${value.toFixed(2)}°C`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hora',
          font: {
            size: 13,
            weight: '600'
          }
        },
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 20
        }
      },
      y: {
        title: {
          display: true,
          text: 'Temperatura (°C)',
          font: {
            size: 13,
            weight: '600'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.06)'
        },
        ticks: {
          callback: (value) => value.toFixed(1) + '°C'
        }
      }
    },
    elements: {
      line: {
        borderWidth: 2
      }
    }
  };

  return (
    <div className="chart-wrapper">
      <Line data={data} options={options} />
    </div>
  );
}

export default TemperatureChart;