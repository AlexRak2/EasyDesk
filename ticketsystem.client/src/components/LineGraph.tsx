import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface LineGraphProps {
  data: number[];
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
    },
    stroke: {
      curve: 'straight',
    },
    xaxis: {
      categories: months,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: false,
      intersect: false,
    },
  };



  return (
    <div>
      <Chart options={options} series={[{ name: 'Data', data }]} type="line" height={350} />
    </div>
  );
};

export default LineGraph;
