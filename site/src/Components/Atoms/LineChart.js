import React from 'react';
import PropTypes from 'prop-types';
import { Line } from '@ant-design/plots';

export const LineChart = ({
  title = 'Demo Line Chart',
  data,
  xField,
  yField,
  xLabel,
  yLabel,
}) => {
  const config = {
    data,
    xField,
    yField,
    label: {},
    point: {
      size: 5,
      shape: 'custom-point',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'custom-marker-interaction',
      },
    ],
  };
  return (
    <div className="line-chart">
      <h2>{title}</h2>
      <div className="chart-container">
        <div className="yLabel">
          <label>{yLabel}</label>
        </div>
        <div className="sub-container">
          <Line {...config} />
          <div className="xLabel">
            <label>{xLabel}</label>
          </div>
        </div>
      </div>
    </div>
  );
};

LineChart.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array.isRequired,
  xField: PropTypes.string.isRequired,
  yField: PropTypes.string.isRequired,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
};
