import { Category } from './types';

export const PALETTE_COLORS = [
  '#FFCD00', // Yellow
  '#FF8C00', // Orange
  '#E63E62', // Pink/Red
  '#9ACD32', // YellowGreen
  '#00BFFF', // DeepSkyBlue
  '#FFFFFF', // White
  '#8B4513', // SaddleBrown
  '#000000', // Black
  '#9370DB', // MediumPurple
  '#20B2AA', // LightSeaGreen
  '#FF69B4', // HotPink
  '#CD853F', // Peru
  '#FF0000', // Red
  '#00FF00', // Lime
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#00FFFF', // Cyan
  '#FF00FF', // Magenta
  '#C0C0C0', // Silver
  '#808080', // Gray
  '#800000', // Maroon
  '#808000', // Olive
  '#008000', // Green
  '#800080', // Purple
  '#008080', // Teal
  '#000080', // Navy
  '#FA8072', // Salmon
  '#F0E68C', // Khaki
  '#E6E6FA', // Lavender
  '#DDA0DD', // Plum
  '#B0E0E6', // PowderBlue
  '#FFDAB9', // PeachPuff
  '#F5DEB3', // Wheat
  '#D2691E', // Chocolate
  '#A0522D', // Sienna
  '#4682B4', // SteelBlue
  '#5F9EA0', // CadetBlue
  '#7B68EE', // MediumSlateBlue
  '#6A5ACD', // SlateBlue
  '#483D8B', // DarkSlateBlue
  '#2F4F4F', // DarkSlateGray
  '#BC8F8F', // RosyBrown
  '#F4A460', // SandyBrown
  '#DAA520', // Goldenrod
  '#B8860B', // DarkGoldenrod
  '#32CD32', // LimeGreen
  '#228B22', // ForestGreen
  '#006400', // DarkGreen
  '#66CDAA', // MediumAquamarine
  '#00CED1', // DarkTurquoise
  '#1E90FF', // DodgerBlue
  '#4169E1', // RoyalBlue
  '#0000CD', // MediumBlue
  '#191970', // MidnightBlue
  '#8A2BE2', // BlueViolet
  '#9400D3', // DarkViolet
  '#9932CC', // DarkOrchid
  '#8B008B', // DarkMagenta
  '#C71585', // MediumVioletRed
  '#DB7093', // PaleVioletRed
];

// Helper to create consistent line-art style images
const createSvgDataUri = (pathData: string, viewBox: string = "0 0 512 512") => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" style="background-color: white;">
    <g fill="none" stroke="#000000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">
      ${pathData}
    </g>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// --- CATEGORIES ---

export const CATEGORIES: Category[] = [
  {
    id: 'animals',
    title: 'Coloring Animals',
    colorTheme: 'text-orange-600',
    bgTheme: 'bg-orange-50',
    items: Array.from({ length: 21 }, (_, i) => ({
      id: `a_big_${i + 1}`,
      title: `Animal ${i + 1}`,
      imageSrc: `/Animals/A_big_${i + 1}.png`,
      thumbnailSrc: `/Animals/A_big_${i + 1}.png`
    }))
  },
  {
    id: 'christmas',
    title: 'Coloring Christmas',
    colorTheme: 'text-red-600',
    bgTheme: 'bg-red-50',
    items: Array.from({ length: 10 }, (_, i) => ({
      id: `c_big_${i + 1}`,
      title: `Christmas ${i + 1}`,
      imageSrc: `/Christmas/C_big_${i + 1}.png`,
      thumbnailSrc: `/Christmas/C_big_${i + 1}.png`
    }))
  },
  {
    id: 'fruits',
    title: 'Coloring Fruits',
    colorTheme: 'text-green-600',
    bgTheme: 'bg-green-50',
    items: Array.from({ length: 14 }, (_, i) => ({
      id: `f_big_${i + 1}`,
      title: `Fruit ${i + 1}`,
      imageSrc: `/Fruits/F_big_${i + 1}.png`,
      thumbnailSrc: `/Fruits/F_big_${i + 1}.png`
    }))
  },
  {
    id: 'geometry',
    title: 'Coloring Geometry',
    colorTheme: 'text-blue-600',
    bgTheme: 'bg-blue-50',
    items: Array.from({ length: 11 }, (_, i) => ({
      id: `g_big_${i + 1}`,
      title: `Geometry ${i + 1}`,
      imageSrc: `/Geometry/G_big_${i + 1}.png`,
      thumbnailSrc: `/Geometry/G_big_${i + 1}.png`
    }))
  },
  {
    id: 'nature',
    title: 'Coloring Nature',
    colorTheme: 'text-emerald-600',
    bgTheme: 'bg-emerald-50',
    items: Array.from({ length: 7 }, (_, i) => ({
      id: `n_big_${i + 1}`,
      title: `Nature ${i + 1}`,
      imageSrc: `/Nature/N_big_${i + 1}.png`,
      thumbnailSrc: `/Nature/N_big_${i + 1}.png`
    }))
  },
  {
    id: 'people',
    title: 'Coloring People',
    colorTheme: 'text-yellow-600',
    bgTheme: 'bg-yellow-50',
    items: Array.from({ length: 9 }, (_, i) => ({
      id: `p_big_${i + 1}`,
      title: `People ${i + 1}`,
      imageSrc: `/People/P_big_${i + 1}.png`,
      thumbnailSrc: `/People/P_big_${i + 1}.png`
    }))
  },
  {
    id: 'shapes',
    title: 'Coloring Shapes',
    colorTheme: 'text-indigo-600',
    bgTheme: 'bg-indigo-50',
    items: Array.from({ length: 11 }, (_, i) => ({
      id: `s_big_${i + 1}`,
      title: `Shape ${i + 1}`,
      imageSrc: `/Shape/S_big_${i + 1}.png`,
      thumbnailSrc: `/Shape/S_big_${i + 1}.png`
    }))
  },
  {
    id: 'vehicles',
    title: 'Coloring Vehicles',
    colorTheme: 'text-slate-600',
    bgTheme: 'bg-slate-50',
    items: Array.from({ length: 12 }, (_, i) => ({
      id: `v_big_${i + 1}`,
      title: `Vehicle ${i + 1}`,
      imageSrc: `/Vehicle/V_big_${i + 1}.png`,
      thumbnailSrc: `/Vehicle/V_big_${i + 1}.png`
    }))
  }
];
