import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const TradingViewChart = ({ data, lineColor }) => {
  const chartContainerRef = useRef();
  const chartInstanceRef = useRef();

  useEffect(() => {
    // Create chart instance
    chartInstanceRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        textColor: 'white',
        background: { type: 'solid', color: 'transparent' }, // Set background to transparent
      },
      timeScale: {
        timeVisible: true,
      },
      grid: {
        vertLines: {
          color: '#00000000',
        },
        horzLines: {
          color: '#00000000',
        },
      },
      crosshair: {
        vertLine: {
          color: '#00000000',
        },
        horzLine: {
          color: '#00000000',
        },
      },
      watermark: {
        color: '#00000000',
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
    });

    // Add line series to the chart
    const lineSeries = chartInstanceRef.current.addLineSeries({
      lineWidth: 2,
      color: lineColor,
    });

    lineSeries.setData(data);

    // Cleanup function
    return () => {
      chartInstanceRef.current.remove();
    };
  }, [data, lineColor]);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight);
    }
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: 'transparent' }} // Set background color to transparent
    />
  );
};

export default TradingViewChart;
