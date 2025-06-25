import React from 'react';
import GridLayout from '../components/layout/GridLayout';
import DataSourceList from '../components/data-management/DataSourceList';
import CollapsibleSidePanel from '../components/layout/CollapsibleSidePanel';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Main Content */}
      <div className="overflow-hidden h-full">
        <h1 className="text-2xl font-light text-gray-900 mb-1">
          Open Game Data
        </h1>
        <GridLayout />
      </div>

      {/* Collapsible Side Panel */}
      <CollapsibleSidePanel title="Data Sources">
        <DataSourceList />
      </CollapsibleSidePanel>
    </div>
  );
};

export default HomePage;
