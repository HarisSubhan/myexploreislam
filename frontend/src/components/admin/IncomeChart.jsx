// components/admin/IncomeChart.jsx
import React, { useState } from 'react';
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { ButtonGroup, Button, Form } from 'react-bootstrap';

const IncomeChart = () => {
  const [period, setPeriod] = useState('monthly');
  const [chartType, setChartType] = useState('bar');

  const staticData = {
    monthly: [
      { label: 'Jan', total: 1200 },
      { label: 'Feb', total: 1500 },
      { label: 'Mar', total: 1800 },
      { label: 'Apr', total: 1400 },
      { label: 'May', total: 1700 },
      { label: 'Jun', total: 1600 },
    ],
    quarterly: [
      { label: 'Q1', total: 4500 },
      { label: 'Q2', total: 4700 },
    ],
    'half-year': [
      { label: 'H1', total: 9200 },
      { label: 'H2', total: 8800 },
    ],
    yearly: [
      { label: '2023', total: 18000 },
      { label: '2024', total: 19500 },
    ],
  };

  const chartData = staticData[period];

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      width: '100%',
      height: 250,
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#0d6efd" strokeWidth={3} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="total" stroke="#198754" fill="#d1e7dd" strokeWidth={2} />
          </AreaChart>
        );
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#0d6efd" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Group controlId="periodSelect" className="mb-0">
          <Form.Label className="fw-semibold">Income View</Form.Label>
          <Form.Select size="sm" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="half-year">Half-Yearly</option>
            <option value="yearly">Yearly</option>
          </Form.Select>
        </Form.Group>

        <ButtonGroup size="sm">
          <Button variant={chartType === 'bar' ? 'primary' : 'outline-primary'} onClick={() => setChartType('bar')}>
            Bar
          </Button>
          <Button variant={chartType === 'line' ? 'success' : 'outline-success'} onClick={() => setChartType('line')}>
            Line
          </Button>
          <Button variant={chartType === 'area' ? 'warning' : 'outline-warning'} onClick={() => setChartType('area')}>
            Area
          </Button>
        </ButtonGroup>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        {renderChart()}
      </ResponsiveContainer>
    </>
  );
};

export default IncomeChart;
