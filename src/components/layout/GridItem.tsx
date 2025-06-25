import React from 'react';
import { GripVertical, X } from 'lucide-react';

interface GridItemProps {
  style?: React.CSSProperties;
  className?: string;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  children: React.ReactNode;
  chartId: string;
  onRemove: (chartId: string) => void;
}

/**
 * GridItem is a component that represents a single item in the grid layout.
 * It is a custom implementation of the GridItem component from react-grid-layout,
 * in order to add a drag handle and close button to the chart.
 * It is used to display a chart in the grid layout.
 * It is also used to display the chart content.
 */
const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      style = {},
      className = '',
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      children,
      chartId,
      onRemove,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        style={style}
        className={`${className} group relative`}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        {/* Drag Handle */}
        <div
          className="drag-handle absolute top-2 left-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center cursor-move z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ pointerEvents: 'auto' }}
        >
          <GripVertical size={14} className="text-gray-600" />
        </div>

        {/* Close Button */}
        <button
          className="absolute top-2 right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none"
          onClick={() => onRemove(chartId)}
          type="button"
          title="Remove chart"
        >
          <X size={14} className="text-gray-600" />
        </button>

        {/* Chart content */}
        <div className="h-full w-full">{children}</div>
      </div>
    );
  },
);

GridItem.displayName = 'GridItem';

export default GridItem;
