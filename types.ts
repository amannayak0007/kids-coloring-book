export interface ColoringPage {
  id: string;
  title: string;
  imageSrc: string; // Data URI or URL for the line art
  thumbnailSrc: string; // Can be the same as imageSrc or a colored version
}

export interface Category {
  id: string;
  title: string;
  items: ColoringPage[];
  colorTheme: string; // Tailwind class for text color
  bgTheme?: string; // Tailwind class for background accents
}

export type ToolType = 'fill' | 'brush';

export interface Point {
  x: number;
  y: number;
}
