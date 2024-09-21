import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts'; // Import ApexOptions for typing

interface DonutChartProps {
  labels: string[];
  series: number[];
}

const DonutChart: React.FC<DonutChartProps> = ({ labels, series }) => {
  const options: ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0,
        gradientToColors: ['#F55555', '#6078EA', '#00C9A7', '#FECF6A'], 
        inverseColors: true,
        opacityFrom: 0,
        opacityTo: 1,
        stops: [0, 100],
      },

    },
    stroke: {
      show: false,
      width: 0, 
    },
    legend: {
      position: 'top',
    },
  };

  return (
    <div>
      <Chart options={options} series={series} type="donut" width="380" />
    </div>
  );
};

export default DonutChart
