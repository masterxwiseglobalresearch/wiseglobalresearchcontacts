import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import registerChartOnce from '../utils/registerChart';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { generateChartData } from '../utils/chartUtils';
import { cardVariants } from '../utils/animationVariants';

// Ensure Chart.js is registered once when this module is imported (module-eval of this lazy chunk)
registerChartOnce();

const AnimatedChart = ({ symbol }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(generateChartData(symbol));

  React.useEffect(() => {
    try {
      ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
    } catch (e) {
      // ignore if already registered
    }
  }, []);

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    if (prefersReduced) return; // disable auto updates if reduced motion
    const interval = setInterval(() => {
      setChartData((prev) => {
        const newValues = prev.values.map((value) => value + (Math.random() * 50 - 25));
        return { ...prev, values: newValues };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [symbol, prefersReduced]);

  useEffect(() => {
    if (!chartData.values || chartData.values.some(isNaN)) {
      console.error(`Invalid chart data for ${symbol}:`, chartData);
    }
  }, [chartData, symbol]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: symbol.split(':')[1],
        data: chartData.values,
        borderColor: chartData.border || '#A1C4FD',
      backgroundColor: chartData.bg || 'var(--bg-transparent, rgba(255, 255, 255, 0.30))',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 8,
        pointBackgroundColor: chartData.border || '#A1C4FD',
        pointBorderColor: '#fff',
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: prefersReduced
      ? false
      : {
          duration: 1500,
          easing: 'easeInOutQuart',
          animateScale: true,
          animateRotate: true,
        },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 12 },
          color: 'var(--text-body, #ffffff)',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'var(--bg-transparent, rgba(255, 255, 255, 0.30))',
        titleColor: 'var(--text-body, #333333)',
        bodyColor: 'var(--text-body, #333333)',
        borderColor: chartData.border || '#A1C4FD',
        borderWidth: 1,
      },
      title: {
        display: true,
        text: `${symbol.split(':')[1]} Trend`,
        font: { size: 16, weight: 'bold' },
        color: 'var(--text-body, #ffffff)',
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'var(--text-body, #ffffff)', font: { size: 10 } },
      },
      y: {
        grid: { color: 'var(--navbar-border, rgba(255, 255, 255, 0.10))' },
        ticks: { color: 'var(--text-body, #ffffff)', font: { size: 10 } },
        beginAtZero: false,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%' }}
    >
      <div className="relative w-full h-full">
  <Line ref={chartRef} data={data} options={options} aria-label={`${symbol} chart`} role="img" />
      </div>
    </motion.div>
  );
};

export default AnimatedChart;