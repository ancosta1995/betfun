// TradingViewChart.js
import React, { useEffect, useRef, useState } from 'react';
import { LineSeries, Chart } from 'lightweight-charts';

const TradingViewChart = ({ data, lineColor }) => {
  const chartContainerRef = useRef();
  const [chart, setChart] = useState(null);

  useEffect(() => {
    // Create a new chart instance when the component mounts
    const chartInstance = new Chart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      lineSeries: {
        lineWidth: 2,
        color: lineColor,
      },
    });
    setChart(chartInstance);

    // Cleanup chart instance on component unmount
    return () => {
      chartInstance.remove();
    };
  }, [lineColor]);

  useEffect(() => {
    if (chart) {
      // Update chart data whenever the data prop changes
      chart.setData(data);
    }
  }, [data, chart]);

  return <div ref={chartContainerRef} style={{ position: 'relative', width: '100%', height: '100%' }} />;
};

export default TradingViewChart;
