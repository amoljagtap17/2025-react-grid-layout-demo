import React, { useRef, useEffect, useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import { GridItem } from '../types';
import { X } from 'lucide-react';

const ReactGridLayout = WidthProvider(RGL);

interface GridLayoutProps {
  items: GridItem[];
  onLayoutChange: (layout: any[]) => void;
  onRemoveItem: (id: string) => void;
}

const GridLayout: React.FC<GridLayoutProps> = ({
  items,
  onLayoutChange,
  onRemoveItem,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Calculate dimensions
  const padding = 16; // Container padding
  const gap = 16; // Gap between items
  const availableWidth = dimensions.width - (padding * 2);
  const availableHeight = dimensions.height - (padding * 2);
  const rowHeight = Math.floor((availableHeight - gap) / 2);

  return (
    <div 
      ref={containerRef} 
      className="h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 relative"
      style={{ padding: `${padding}px` }}
    >
      {/* Grid lines */}
      <div className="absolute inset-4 pointer-events-none">
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4">
          {/* Vertical divider */}
          <div className="absolute left-1/2 top-0 w-px h-full bg-gray-300 -translate-x-1/2"></div>
          {/* Horizontal divider */}
          <div className="absolute top-1/2 left-0 h-px w-full bg-gray-300 -translate-y-1/2"></div>
          
          {/* Quadrant labels when empty */}
          {items.length === 0 && (
            <>
              <div className="flex items-center justify-center text-gray-400">Quadrant 1</div>
              <div className="flex items-center justify-center text-gray-400">Quadrant 2</div>
              <div className="flex items-center justify-center text-gray-400">Quadrant 3</div>
              <div className="flex items-center justify-center text-gray-400">Quadrant 4</div>
            </>
          )}
        </div>
      </div>

      <ReactGridLayout
        className="layout"
        cols={2}
        rowHeight={rowHeight}
        width={availableWidth}
        onLayoutChange={onLayoutChange}
        compactType={null}
        maxRows={2}
        isDraggable={false}
        isResizable={false}
        preventCollision={true}
        margin={[gap, gap]}
        containerPadding={[0, 0]}
        useCSSTransforms={true}
      >
        {items.map((item) => (
          <div
            key={item.id}
            data-grid={{ 
              x: item.x, 
              y: item.y, 
              w: 1, 
              h: 1, 
              static: true 
            }}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="h-full relative flex flex-col">
              <button
                onClick={() => onRemoveItem(item.id)}
                className="absolute top-3 right-3 z-10 p-2 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 shadow-sm"
                aria-label="Remove component"
              >
                <X size={20} />
              </button>
              <div className="flex-1 flex items-center justify-center text-lg font-medium p-4">
                {item.content}
              </div>
            </div>
          </div>
        ))}
      </ReactGridLayout>
      
      {items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
          Drag components here
        </div>
      )}
    </div>
  );
};

export default GridLayout;