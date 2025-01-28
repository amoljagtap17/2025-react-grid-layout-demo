import React from 'react';
import { TreeItem } from '../types';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface TreeViewProps {
  items: TreeItem[];
  onToggleExpand: (id: string) => void;
  droppedItems: string[];
}

const TreeItemComponent: React.FC<{
  item: TreeItem;
  level: number;
  onToggleExpand: (id: string) => void;
  droppedItems: string[];
}> = ({ item, level, onToggleExpand, droppedItems }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isDropped = droppedItems.includes(item.id);
  const bgColor = level === 0 ? 'grey.800' : 
                 level === 1 ? 'grey.100' : 
                 'background.paper';
  const textColor = level === 0 ? 'common.white' : 'text.primary';

  const handleDragStart = (e: React.DragEvent) => {
    if (!hasChildren) {
      e.stopPropagation();
      e.dataTransfer.setData('text/plain', item.id);
      
      // Create a custom drag image
      const dragImage = document.createElement('div');
      dragImage.style.padding = '8px 16px';
      dragImage.style.background = '#000';
      dragImage.style.color = '#fff';
      dragImage.style.position = 'fixed';
      dragImage.style.top = '-100px';
      dragImage.style.left = '-100px';
      dragImage.textContent = item.name;
      document.body.appendChild(dragImage);
      
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      
      // Clean up the drag image after dragging
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
    }
  };

  return (
    <>
      <ListItem 
        disablePadding 
        sx={{ pl: level * 2 }}
      >
        <ListItemButton
          onClick={() => hasChildren && onToggleExpand(item.id)}
          draggable={!hasChildren}
          disabled={isDropped}
          onDragStart={handleDragStart}
          sx={{
            borderRadius: 0,
            bgcolor: bgColor,
            opacity: isDropped ? 0.5 : 1,
            mb: 0.5,
            '&:hover': {
              bgcolor: isDropped ? bgColor : 
                      level === 0 ? 'grey.700' : 
                      level === 1 ? 'grey.200' : 
                      'grey.50'
            },
            '&.Mui-disabled': {
              opacity: 0.5,
              bgcolor: bgColor
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 32, color: textColor }}>
            {hasChildren ? (
              item.isExpanded ? (
                <ExpandMoreIcon />
              ) : (
                <ChevronRightIcon />
              )
            ) : (
              <DragIndicatorIcon />
            )}
          </ListItemIcon>
          <ListItemText 
            primary={item.name}
            primaryTypographyProps={{
              fontWeight: hasChildren ? 600 : 400,
              color: isDropped ? 'text.disabled' : textColor,
              fontSize: level === 0 ? 14 : 13
            }}
          />
        </ListItemButton>
      </ListItem>
      {hasChildren && item.isExpanded && (
        <List disablePadding>
          {item.children.map((child) => (
            <TreeItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              onToggleExpand={onToggleExpand}
              droppedItems={droppedItems}
            />
          ))}
        </List>
      )}
    </>
  );
};

const TreeView: React.FC<TreeViewProps> = ({ items, onToggleExpand, droppedItems }) => {
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        height: '100%',
        overflow: 'auto',
        p: 2,
        bgcolor: 'background.default',
        border: 1,
        borderColor: 'grey.200'
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          fontWeight: 600,
          fontSize: 16,
          color: 'grey.900'
        }}
      >
        Components
      </Typography>
      <List disablePadding>
        {items.map((item) => (
          <TreeItemComponent
            key={item.id}
            item={item}
            level={0}
            onToggleExpand={onToggleExpand}
            droppedItems={droppedItems}
          />
        ))}
      </List>
    </Paper>
  );
};

export default TreeView;