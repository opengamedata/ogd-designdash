import React from 'react';
import GridLayout from '../components/layout/GridLayout';

const HomePage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Open Game Data</h1>
      <GridLayout />
    </div>
  );
};

export default HomePage;
