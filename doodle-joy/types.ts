export interface Point {
  x: number;
  y: number;
}

export interface ShapeConfig {
  id: string;
  path: string; // SVG Path data
  color: string;
  rotation: number;
  scaleX: number; // For flipping
  scaleY: number;
}

export interface GalleryItem {
  id: string;
  imageData: string; // Base64
  title?: string;
  date: number;
}

export enum ToolType {
  PEN = 'PEN',
  ERASER = 'ERASER'
}
