// components/admin/IncomeChart.jsx
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Form } from 'react-bootstrap';

const IncomeChart = () => {
  const [period, setPeriod] = useState('monthly');

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

  return (
    <>
      <Form.Group className="mb-3" controlId="periodSelect">
        <Form.Label>Income View</Form.Label>
        <Form.Select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="half-year">Half-Yearly</option>
          <option value="yearly">Yearly</option>
        </Form.Select>
      </Form.Group>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#0d6efd" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default IncomeChart;
