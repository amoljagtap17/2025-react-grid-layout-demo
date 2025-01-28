import React, { useRef, useEffect, useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import { GridItem } from '../types';
import { Box, Button, Paper } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';

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
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleGeneratePDF = () => {
    const quadrants: Record<number, string> = {};
    items.forEach(item => {
      const quadrantNumber = (item.y * 2) + item.x + 1;
      quadrants[quadrantNumber] = item.content;
    });

    console.log('Data to be sent to backend:', {
      quadrants,
      summary: {
        totalComponents: items.length,
        occupiedQuadrants: Object.keys(quadrants).length,
        components: Object.entries(quadrants).map(([quadrant, component]) => 
          `Quadrant ${quadrant}: ${component}`
        )
      }
    });
  };

  const padding = 16;
  const gap = 16;
  const availableWidth = dimensions.width - (padding * 2);
  const availableHeight = dimensions.height - 80;
  const gridHeight = Math.min(availableHeight, availableWidth * 0.75);
  const rowHeight = Math.floor((gridHeight - gap) / 2);

  const quadrantStyle = {
    position: 'absolute',
    width: '50%',
    height: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(0, 0, 0, 0.1)',
    fontSize: '64px',
    fontWeight: 'bold',
    pointerEvents: 'none',
    zIndex: 0
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          disabled={items.length === 0}
          onClick={handleGeneratePDF}
          startIcon={<FileDownloadIcon />}
        >
          Log Layout Data
        </Button>
      </Box>
      
      <Paper
        ref={containerRef}
        variant="outlined"
        sx={{
          flex: 1,
          bgcolor: 'grey.50',
          border: '2px dashed',
          borderColor: 'grey.300',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: availableWidth,
            height: gridHeight,
            p: 2
          }}
        >
          <Box sx={{ ...quadrantStyle as any, top: 16, left: 16 }}>1</Box>
          <Box sx={{ ...quadrantStyle as any, top: 16, right: 16 }}>2</Box>
          <Box sx={{ ...quadrantStyle as any, bottom: 16, left: 16 }}>3</Box>
          <Box sx={{ ...quadrantStyle as any, bottom: 16, right: 16 }}>4</Box>

          <Box
            sx={{
              position: 'absolute',
              inset: 16,
              pointerEvents: 'none',
              '& .grid-lines': {
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: 2,
                '& > div': {
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  padding: 2
                }
              }
            }}
          >
            <Box className="grid-lines">
              <Box />
              <Box />
              <Box />
              <Box />
            </Box>
          </Box>

          <ReactGridLayout
            className="layout"
            cols={2}
            rowHeight={rowHeight}
            width={availableWidth - (padding * 2)}
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
              <Paper
                key={item.id}
                elevation={2}
                sx={{
                  width: '100%',
                  height: '100%',
                  transition: 'box-shadow 200ms',
                  '&:hover': {
                    boxShadow: 6
                  }
                }}
                data-grid={{ 
                  x: item.x, 
                  y: item.y, 
                  w: 1, 
                  h: 1, 
                  static: true 
                }}
              >
                <Box sx={{ 
                  height: '100%', 
                  position: 'relative', 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 2
                }}>
                  <Button
                    onClick={() => onRemoveItem(item.id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      minWidth: 0,
                      p: 1,
                      borderRadius: '50%',
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'error.main',
                        bgcolor: 'error.lighter'
                      }
                    }}
                  >
                    <CloseIcon />
                  </Button>
                  <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    typography: 'body1',
                    fontWeight: 500
                  }}>
                    {item.content}
                  </Box>
                </Box>
              </Paper>
            ))}
          </ReactGridLayout>
        </Box>
      </Paper>
    </Box>
  );
};

export default GridLayout;