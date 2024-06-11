"use client";
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import StockChart from './StockChart';

const CSVUploader = ({ file }) => {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (file) {
      const nameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
      setFileName(nameWithoutExtension);
      
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const parsedData = results.data.map(row => ({
            Date: new Date(row.date), // Parse date string to Date object
            Close: parseFloat(row.close)
          })).filter(row => !isNaN(row.Close)); // Filter out any rows with invalid numbers

          setData(parsedData);
        },
      });
    }
  }, [file]);

  return (
    <div className="flex flex-col items-center text-black">
      {data.length > 0 && fileName.length > 0 && <StockChart data={data} fileName={fileName} />}
    </div>
  );
};

export default CSVUploader;
