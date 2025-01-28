export interface GridItem {
  id: string;
  content: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface TreeItem {
  id: string;
  name: string;
  children?: TreeItem[];
  isExpanded?: boolean;
}

export interface QuadrantData {
  position: number;
  component: string;
}