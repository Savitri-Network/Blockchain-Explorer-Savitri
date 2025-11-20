"use client"
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, ChartData, Point, registerables } from 'chart.js';
import axios from 'axios';
import styles from '@/styles/ChartDashboard.module.scss'


interface LedgerEntry {
  status: string;
  balance?: number;
  owner?: string;
  last_ts?: number;
}

interface ApiResponse {
  length: number;
  ledger: Record<string, LedgerEntry>;
}

interface ChartDataPoint {
  time: string;
  count: number;
}
type IntervalGroup = Record<number, number>;


const ActiveUsersChart = () => {
  const measureAfter="K";
  const measureBefore ="";
  const title = "Active Users";
  const min=0;
  const max=10;
  const [containerHeight, setContainerHeight] = useState<number >(700);
  const [containerWidth, setContainerWidth] = useState<number >(500);
  let tooltipElement: HTMLElement;
  Chart.register(...registerables);
  Chart.defaults.plugins.tooltip.backgroundColor = '#FCE8FF';
  Chart.defaults.plugins.tooltip.bodyColor = '#000000';
  Chart.defaults.plugins.tooltip.titleColor = '#000000';

  const [dataSet, setDataSet] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  // Function to group data by time interval
  // Function to group data by time interval and limit to 13 labels
  // Function to group data by time interval and format the time labels
const groupByTimeInterval = (ledger: Record<string, LedgerEntry>, intervalInMinutes: number = 5): ChartDataPoint[] => {
  const intervalGroups: IntervalGroup = {};

  Object.values(ledger).forEach((entry) => {
    if (entry.last_ts) {
      // Round down the timestamp to the nearest interval
      const intervalTimestamp = Math.floor(entry.last_ts / (intervalInMinutes * 60)) * (intervalInMinutes * 60);
      intervalGroups[intervalTimestamp] = (intervalGroups[intervalTimestamp] || 0) + 1;
    }
  });

  // Convert interval groups to chart data points and sort
  const sortedData = Object.entries(intervalGroups).map(([timestamp, count]) => ({
    time: new Date(parseInt(timestamp) * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    count,
  })).sort((a, b) => a.time.localeCompare(b.time));

  // Reduce the number of data points to a maximum of 13 for the labels
  const labelInterval = Math.ceil(sortedData.length / 9);
  const reducedData = sortedData.filter((_, index) => index % labelInterval === 0);

  return reducedData.length > 9 ? reducedData.slice(0, 9) : reducedData;
};

  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>('/api/userchart');
        const processedChartData = groupByTimeInterval(response.data.ledger);

        // Extract labels and dataset for the chart
        setLabels(processedChartData.map(data => data.time));
        setDataSet(processedChartData.map(data => data.count));
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className={styles.container}
      onMouseOut={() => {
        if (tooltipElement) tooltipElement.style.display = 'none';
      }}
    >
      <h6>{title}</h6>
      <br />
      <div
        className={`${styles['chartContainer']}`}
        ref={(ev) => {
          if (ev) {
            setContainerHeight((ev as HTMLDivElement).clientHeight);
            setContainerWidth((ev as HTMLDivElement).clientWidth);
          }
        }}
        style={{ height: `300px` }}
      >
        {containerHeight > 0 && (
          <Line
            ref={(ev) => {
              if (ev) {
                ev.canvas.width = containerWidth;
                ev.canvas.height = containerHeight;
              }
            }}
            data={{
              labels:labels,
              datasets: [
                {
                  data: dataSet,
                  backgroundColor: function (context) {
                    if (!context.chart.chartArea) return;
                    const bgColor = ['#CE00F033', '#CE00F005'];
                    const {
                      ctx,
                      chartArea: { top, bottom },
                    } = context.chart;
                    const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
                    gradientBg.addColorStop(0, bgColor[0]);
                    gradientBg.addColorStop(1, bgColor[1]);
                    return gradientBg;
                  },
                  borderColor: '#CE00F0',
                  pointBackgroundColor: '#CE00F0',
                  tension: 0.5,
                  pointRadius: 0,
                  pointHitRadius: 30,
                  pointHoverRadius: 5,
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                duration: 2000,
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  enabled: true,
                  intersect: false,
                  displayColors: false,
                  callbacks: {
                    label: function (this, tooltipItem) {
                      return (
                        (measureBefore ? measureBefore : '') +
                        tooltipItem.dataset.data[tooltipItem.dataIndex] +
                        (measureAfter ? measureAfter : '')
                      );
                    },
                    title: function () {
                      return '';
                    },
                  },
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  labels: dataSet.map((_, index) => {
                    const step = Math.floor(dataSet.length / labels.length);
                    return index > 0 && (index - Math.floor(step / 2)) % step == 0
                      ? labels[(index - Math.floor(step / 2)) / step]
                      : '';
                  }),
                  ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                  },
                },
                y: {
                  ticks: {
                    callback: function (value) {
                      return (measureBefore ? measureBefore : '') + value + (measureAfter ? measureAfter : '');
                    },
                  },
                  min: min,
                  max: max,
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ActiveUsersChart;
