"use client";
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const StockChart = ({ data, fileName }) => {
  // Format Date for XAxis
  const formattedData = data.map(item => ({
    Date: item.Date.toISOString().split('T')[0], // Convert Date object to string 'YYYY-MM-DD'
    Close: item.Close
  }));

  return (
    <div className="w-full">
      <h2 className="text-center text-2xl font-bold mb-4 text-black">{fileName}</h2> {/* Display the file name as title */}
      <div style={{ width: '1000px', height: '600px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Close" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;
