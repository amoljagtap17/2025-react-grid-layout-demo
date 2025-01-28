import React from 'react';
import { TreeItem } from '../types';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface TreeViewProps {
  items: TreeItem[];
  onToggleExpand: (id: string) => void;
}

const TreeItemComponent: React.FC<{
  item: TreeItem;
  level: number;
  onToggleExpand: (id: string) => void;
}> = ({ item, level, onToggleExpand }) => {
  const hasChildren = item.children && item.children.length > 0;
  const bgColorClass = level === 0 ? 'hover:bg-blue-50' 
    : level === 1 ? 'hover:bg-green-50' 
    : 'hover:bg-purple-50';
  const indentClass = `ml-${level * 4}`;

  return (
    <>
      <li
        className={`relative ${bgColorClass} rounded-lg transition-colors`}
      >
        <div 
          className={`flex items-center p-2 ${indentClass} ${hasChildren ? 'cursor-pointer' : 'cursor-move'}`}
          onClick={() => hasChildren && onToggleExpand(item.id)}
          draggable={!hasChildren}
          onDragStart={(e) => {
            if (!hasChildren) {
              e.dataTransfer.setData('text/plain', item.id);
            }
          }}
        >
          {hasChildren && (
            <span className="mr-1">
              {item.isExpanded ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
            </span>
          )}
          <span className={`${hasChildren ? 'font-medium' : ''}`}>
            {item.name}
          </span>
        </div>
      </li>
      {hasChildren && item.isExpanded && (
        <ul className="mt-1">
          {item.children.map((child) => (
            <TreeItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </ul>
      )}
    </>
  );
};

const TreeView: React.FC<TreeViewProps> = ({ items, onToggleExpand }) => {
  return (
    <div className="h-full bg-white rounded-lg shadow p-4 overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      <ul className="space-y-1">
        {items.map((item) => (
          <TreeItemComponent
            key={item.id}
            item={item}
            level={0}
            onToggleExpand={onToggleExpand}
          />
        ))}
      </ul>
    </div>
  );
};

export default TreeView;