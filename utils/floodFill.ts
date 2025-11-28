
export function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export function floodFill(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColorHex: string,
  tolerance: number = 50 // Increased tolerance for better fill against anti-aliased lines
) {
  const canvas = ctx.canvas;
  const width = canvas.width;
  const height = canvas.height;
  
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const [fillR, fillG, fillB] = hexToRgb(fillColorHex);

  const startPos = (startY * width + startX) * 4;
  const startR = data[startPos];
  const startG = data[startPos + 1];
  const startB = data[startPos + 2];
  // const startA = data[startPos + 3];

  // Prevent filling if clicking on the fill color itself
  if (
    Math.abs(startR - fillR) < 10 &&
    Math.abs(startG - fillG) < 10 &&
    Math.abs(startB - fillB) < 10
  ) {
    return;
  }

  // Boundary Detection: Do not start fill if clicking on a very dark line (original image lines)
  // Only prevent if it's very dark (close to pure black, RGB < 40), not dark gray filled areas
  // This allows filling over dark gray filled areas (RGB ~47)
  if (startR < 40 && startG < 40 && startB < 40) {
      return;
  }

  // Heuristic to detect if we are starting from a grayscale color (like white canvas)
  const isStartGrayscale = 
      Math.abs(startR - startG) < 20 && 
      Math.abs(startG - startB) < 20 && 
      Math.abs(startR - startB) < 20;

  const stack: [number, number][] = [[startX, startY]];
  const seen = new Uint8Array(width * height); 

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const pixelIndex = y * width + x;
    
    if (seen[pixelIndex]) continue;
    
    const offset = pixelIndex * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    
    // Check if pixel is grayscale (to handle anti-aliasing edges of black lines)
    const isPixelGrayscale = 
      Math.abs(r - g) < 20 && 
      Math.abs(g - b) < 20 && 
      Math.abs(r - b) < 20;

    // If both start and current pixel are grayscale, we can use a higher tolerance
    // to fill closer to the black lines (reducing white halo)
    const effectiveTolerance = (isStartGrayscale && isPixelGrayscale) ? 150 : tolerance;

    // Check if pixel color matches the START color (the color we clicked on)
    // This ensures we only fill the specific white (or other color) area we clicked
    const matchesStartColor = 
      Math.abs(r - startR) <= effectiveTolerance &&
      Math.abs(g - startG) <= effectiveTolerance &&
      Math.abs(b - startB) <= effectiveTolerance;

    // Boundary check: 
    // 1. Very dark pixels (RGB < 40) are always boundaries (original black lines)
    // 2. Moderately dark pixels (RGB 40-90) are boundaries only if they don't match start color
    //    This allows filling over dark gray filled areas when clicking on them
    const isVeryDarkLine = r < 40 && g < 40 && b < 40; // Original image lines (always boundary)
    const isModeratelyDark = r < 90 && g < 90 && b < 90 && !isVeryDarkLine; // Dark filled areas
    const isBoundary = isVeryDarkLine || (isModeratelyDark && !matchesStartColor); 

    if (matchesStartColor && !isBoundary) {
      data[offset] = fillR;
      data[offset + 1] = fillG;
      data[offset + 2] = fillB;
      data[offset + 3] = 255; 

      seen[pixelIndex] = 1;

      if (x > 0) stack.push([x - 1, y]);
      if (x < width - 1) stack.push([x + 1, y]);
      if (y > 0) stack.push([x, y - 1]);
      if (y < height - 1) stack.push([x, y + 1]);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
