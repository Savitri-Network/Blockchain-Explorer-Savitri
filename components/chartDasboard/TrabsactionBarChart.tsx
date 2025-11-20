"use client"
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ChartData, ChartOptions } from 'chart.js';

// Define the structure of the data you expect to receive
interface BlockData {
  items: Array<{
    txs: Array<{
      timestamp: number;
    }>;
  }>;
}
interface TransactionCount {
  [key: string]: number;
}

const TransactionChart = (): JSX.Element => {
  const [chartData, setChartData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: [
      {
        label: 'Number of Transactions',
        data: [],
        backgroundColor: '#4CC3FC',
        borderColor: '#0290e5',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      // Replace this with the actual timestamp
      const oneHourAgoTimestamp = Math.floor(Date.now() / 1000) - 3600;
      try {
        const response = await axios.get<BlockData>(`/api/barchart/${oneHourAgoTimestamp}?sort=0&page=1&size=50`);
        const transactions = response.data?.items?.flatMap(item => item.txs);

        const transactionCounts: TransactionCount = transactions.reduce((acc: TransactionCount, curr) => {
          const date = new Date(curr.timestamp * 1000);
          const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          acc[timeString] = (acc[timeString] || 0) + 1;
          return acc;
        }, {});


        setChartData({
          labels: Object.keys(transactionCounts),
          datasets: [
            {
              ...chartData.datasets[0],
              data: Object.values(transactionCounts),
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching transaction data: ", error);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 60000);

    return () => clearInterval(interval);
  }, []);

  // Define chart options
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
  };

  return <Bar data={chartData} options={options} />;
};

export default TransactionChart;

