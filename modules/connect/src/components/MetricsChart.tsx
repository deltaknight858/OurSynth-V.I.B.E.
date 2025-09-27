import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

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

const MetricsChart = () => {
  const data = {
    labels: ['-30m', '-25m', '-20m', '-15m', '-10m', '-5m', 'Now'],
    datasets: [
      {
        label: 'Live Traffic',
        data: [65, 59, 80, 81, 56, 55, 90],
        fill: true,
        backgroundColor: 'rgba(0, 255, 157, 0.1)',
        borderColor: 'rgba(0, 255, 157, 1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(0, 255, 157, 1)',
        pointBorderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0a0a0a',
        titleColor: '#00ff9d',
        bodyColor: '#fff',
        borderColor: '#00ff9d',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
    },
  };

  return <div style={{ height: '300px' }}><Line options={options} data={data} /></div>;
};

export default MetricsChart;