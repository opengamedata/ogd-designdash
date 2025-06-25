'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CollapsibleSidePanelProps {
  children: React.ReactNode;
  title?: string;
}

const CollapsibleSidePanel: React.FC<CollapsibleSidePanelProps> = ({
  children,
  title = 'Data Sources',
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-lg transition-all duration-300 ease-in-out z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-8 top-0 bg-white border border-gray-200 rounded-l-lg p-2 shadow-md hover:bg-gray-50 transition-colors"
        aria-label={isOpen ? 'Close panel' : 'Open panel'}
      >
        {isOpen ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Panel Content */}
      <div
        className={`h-full transition-all duration-300 ease-in-out ${
          isOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'
        } overflow-clip`}
      >
        <div className="h-full w-80 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSidePanel;
