import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EmotionData {
  timestamp: string;
  emotions: {
    [key: string]: number;
  };
}

interface EmotionChartProps {
  data: EmotionData[];
}

const EmotionChart: React.FC<EmotionChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Emotsioonide muutused ajas',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Emotsiooni tugevus (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Aeg'
        }
      }
    }
  };

  const chartData = {
    labels: data.map(entry => new Date(entry.timestamp).toLocaleTimeString()),
    datasets: Object.keys(data[0]?.emotions || {}).map((emotion, index) => ({
      label: emotion,
      data: data.map(entry => entry.emotions[emotion]),
      borderColor: getEmotionColor(emotion),
      backgroundColor: getEmotionColor(emotion) + '40',
      tension: 0.4,
      fill: false,
    })),
  };

  return <Line options={options} data={chartData} />;
};

// Funktsioon emotsiooni värvi määramiseks
const getEmotionColor = (emotion: string): string => {
  const colors: { [key: string]: string } = {
    rõõm: '#FFD700',
    kurbus: '#4169E1',
    viha: '#FF4500',
    hirm: '#800080',
    üllatus: '#32CD32',
    vastikus: '#8B4513'
  };
  return colors[emotion.toLowerCase()] || '#000000';
};

export default EmotionChart; 