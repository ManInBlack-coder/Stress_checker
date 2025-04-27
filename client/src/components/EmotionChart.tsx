import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Scale,
  ScriptableContext
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
  const emotions = [
    { key: 'neutraalne', label: 'Neutraalne', color: '#64748b', gradientFrom: '#94a3b8', gradientTo: '#cbd5e1' },
    { key: 'rõõm', label: 'Rõõm', color: '#eab308', gradientFrom: '#fde047', gradientTo: '#fef9c3' },
    { key: 'kurbus', label: 'Kurbus', color: '#2563eb', gradientFrom: '#60a5fa', gradientTo: '#bfdbfe' },
    { key: 'viha', label: 'Viha', color: '#dc2626', gradientFrom: '#f87171', gradientTo: '#fecaca' },
    { key: 'hirm', label: 'Hirm', color: '#7c3aed', gradientFrom: '#a78bfa', gradientTo: '#ddd6fe' },
    { key: 'üllatus', label: 'Üllatus', color: '#16a34a', gradientFrom: '#4ade80', gradientTo: '#bbf7d0' },
    { key: 'vastikus', label: 'Vastikus', color: '#92400e', gradientFrom: '#fb923c', gradientTo: '#fed7aa' }
  ];

  const createChartOptions = (emotionLabel: string) => ({
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: emotionLabel,
        font: {
          size: 16,
          weight: 'bold' as const
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => `${context.parsed.y.toFixed(1)}%`
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        max: 100,
        grid: {
          color: '#e5e7eb',
          drawBorder: false
        },
        ticks: {
          callback: function(value: number | string) {
            return value + '%';
          },
          padding: 8
        }
      },
      x: {
        type: 'category' as const,
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          padding: 8
        }
      }
      
    },
    maintainAspectRatio: false
  });

  const createChartData = (emotionKey: string, color: string, gradientFrom: string, gradientTo: string) => {
    const ctx = document.createElement('canvas').getContext('2d');
    let gradient = undefined;
    if (ctx) {
      gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, gradientFrom + '40');
      gradient.addColorStop(1, gradientTo + '10');
    }

    return {
      labels: data.map(entry => new Date(entry.timestamp).toLocaleTimeString()),
      datasets: [{
        label: emotionKey,
        data: data.map(entry => entry.emotions[emotionKey]),
        borderColor: color,
        backgroundColor: gradient || color + '40',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }]
    };
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {emotions.map(emotion => (
        <div key={emotion.key} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
          <div className="h-[200px] lg:h-[250px]">
            <Line
              options={createChartOptions(emotion.label)}
              data={createChartData(emotion.key, emotion.color, emotion.gradientFrom, emotion.gradientTo)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmotionChart; 