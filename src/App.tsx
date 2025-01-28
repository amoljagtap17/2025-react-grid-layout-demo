import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, Paper, Grid, AppBar, Toolbar, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import 'react-grid-layout/css/styles.css';
import TreeView from './components/TreeView';
import GridLayout from './components/GridLayout';
import { GridItem, TreeItem } from './types';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
      light: '#333333',
      lighter: '#f5f5f5',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});

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
      
      const effectiveWidth = rect.width - 32;
      const effectiveHeight = rect.height - 32;
      const quadrantX = Math.floor((x - 16) / (effectiveWidth / 2));
      const quadrantY = Math.floor((y - 16) / (effectiveHeight / 2));
      
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <ViewQuiltIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="h1">
            Quadrant Layout Builder
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4, height: 'calc(100vh - 64px)' }}>
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            <Grid item xs={12} md={3}>
              <TreeView 
                items={treeItems} 
                onToggleExpand={toggleExpand} 
                droppedItems={gridItems.map(item => item.id)}
              />
            </Grid>
            <Grid 
              item 
              xs={12} 
              md={9}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <GridLayout
                items={gridItems}
                onLayoutChange={handleLayoutChange}
                onRemoveItem={handleRemoveGridItem}
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;