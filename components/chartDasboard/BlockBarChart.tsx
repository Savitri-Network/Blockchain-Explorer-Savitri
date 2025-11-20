"use client"
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables, ChartData, ChartOptions } from 'chart.js';
import axios from 'axios';

interface BlockItem {
  timestamp: number;
  // include other properties that you might need
}
interface BlockCount {
  [timeString: string]: number;
}
interface ApiResponse {
  items: BlockItem[];
}
const BlocksChart = (): JSX.Element => {
  const [chartData, setChartData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: [
      {
        label: 'Number of Blocks',
        data: [],
        backgroundColor: '#FCE8FF',
        borderColor: '#CE00F0',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchBlocks = async () => {
      const oneHourAgoTimestamp = Math.floor(Date.now() / 1000) - 3600;
      try {
        const response = await axios.get<ApiResponse>(`/api/barchart/${oneHourAgoTimestamp}?sort=0&page=1&size=50`);
        const blocks = response.data.items;

         // Initialize blockCounts with an explicit type
         const blockCounts = blocks?.reduce((acc: BlockCount, block) => {
          const date = new Date(block.timestamp * 1000);
          const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          acc[timeString] = (acc[timeString] || 0) + 1;
          return acc;
        }, {} as BlockCount); // Type assertion here
        setChartData({
          labels: Object.keys(blockCounts),
          datasets: [
            {
              ...chartData.datasets[0],
              data: Object.values(blockCounts),
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching blocks data: ", error);
      }
    };

    fetchBlocks();

    const interval = setInterval(fetchBlocks, 60000);

    return () => clearInterval(interval);
  }, []);

  const options: ChartOptions<'bar'> = {
    scales: {
      x: {
        grid: {
          display: false, // This will remove the vertical gridlines
        }
      },
      y: {
        grid: {
          display: true, // Keep the horizontal gridlines
          // drawBorder: false, // Optional: remove the border on the axis
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BlocksChart;
