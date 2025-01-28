import React, { useState } from 'react';
import 'react-grid-layout/css/styles.css';
import TreeView from './components/TreeView';
import GridLayout from './components/GridLayout';
import { GridItem, TreeItem } from './types';

function App() {
  const [treeItems, setTreeItems] = useState<TreeItem[]>([
    {
      id: '1',
      name: 'Layout Components',
      isExpanded: true,
      children: [
        { id: '1-1', name: 'Header' },
        { id: '1-2', name: 'Footer' },
        { id: '1-3', name: 'Sidebar' }
      ]
    },
    {
      id: '2',
      name: 'Navigation Components',
      isExpanded: true,
      children: [
        { id: '2-1', name: 'Menu Bar' },
        { id: '2-2', name: 'Breadcrumbs' },
        { id: '2-3', name: 'Pagination' }
      ]
    },
    {
      id: '3',
      name: 'Content Components',
      isExpanded: true,
      children: [
        { id: '3-1', name: 'Card' },
        { id: '3-2', name: 'Table' },
        { id: '3-3', name: 'Form' }
      ]
    }
  ]);

  const [gridItems, setGridItems] = useState<GridItem[]>([]);

  const handleLayoutChange = (layout: any[]) => {
    const updatedItems = gridItems.map(item => {
      const layoutItem = layout.find(l => l.i === item.id);
      if (layoutItem) {
        return {
          ...item,
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h,
        };
      }
      return item;
    });
    setGridItems(updatedItems);
  };

  const handleRemoveGridItem = (id: string) => {
    setGridItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (gridItems.length >= 4) return;
    
    const itemId = e.dataTransfer.getData('text/plain');
    const findTreeItem = (items: TreeItem[]): TreeItem | undefined => {
      for (const item of items) {
        if (item.id === itemId) return item;
        if (item.children) {
          const found = findTreeItem(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    
    const treeItem = findTreeItem(treeItems);
    
    if (treeItem && !gridItems.find(item => item.id === itemId) && !treeItem.children) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate quadrant (accounting for padding and grid lines)
      const effectiveWidth = rect.width - 32; // Subtract padding
      const effectiveHeight = rect.height - 32;
      const quadrantX = Math.floor((x - 16) / (effectiveWidth / 2));
      const quadrantY = Math.floor((y - 16) / (effectiveHeight / 2));
      
      // Ensure coordinates are within bounds
      const boundedX = Math.max(0, Math.min(1, quadrantX));
      const boundedY = Math.max(0, Math.min(1, quadrantY));
      
      const newGridItem: GridItem = {
        id: itemId,
        content: treeItem.name,
        x: boundedX,
        y: boundedY,
        w: 1,
        h: 1,
      };
      
      // Check if the quadrant is already occupied
      const isQuadrantOccupied = gridItems.some(
        item => item.x === boundedX && item.y === boundedY
      );
      
      if (!isQuadrantOccupied) {
        setGridItems(prevItems => [...prevItems, newGridItem]);
      }
    }
  };

  const toggleExpand = (id: string) => {
    const updateItems = (items: TreeItem[]): TreeItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, isExpanded: !item.isExpanded };
        }
        if (item.children) {
          return { ...item, children: updateItems(item.children) };
        }
        return item;
      });
    };
    setTreeItems(updateItems(treeItems));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="h-[calc(100vh-3rem)] bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Component Builder</h1>
        <div className="grid grid-cols-4 gap-8 h-[calc(100%-4rem)]">
          <div className="col-span-1 h-full overflow-hidden">
            <TreeView items={treeItems} onToggleExpand={toggleExpand} />
          </div>
          <div 
            className="col-span-3 h-full overflow-hidden"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <GridLayout
              items={gridItems}
              onLayoutChange={handleLayoutChange}
              onRemoveItem={handleRemoveGridItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;