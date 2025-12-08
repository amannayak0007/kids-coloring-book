import * as d3 from 'd3-shape';

// Expanded palette for more variety
const PALETTE = [
  '#FDE047', // Yellow
  '#FB923C', // Orange
  '#86EFAC', // Green
  '#67E8F9', // Cyan
  '#F472B6', // Pink
  '#A78BFA', // Purple
  '#FDA4AF', // Rose
  '#94A3B8', // Slate
  '#C084FC', // Violet
  '#2DD4BF', // Teal
];

export const getRandomColor = () => PALETTE[Math.floor(Math.random() * PALETTE.length)];

// Helper to generate a random number within a range
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Generates an organic, blob-like shape.
 * Enhanced with variable complexity, center offset, and lobe variance.
 */
export const generateBlobPath = (width: number, height: number): string => {
  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) * 0.35;
  
  // Complexity: Number of anchor points for the curve
  const numPoints = Math.floor(randomRange(5, 12));
  const points: [number, number][] = [];
  const angleStep = (Math.PI * 2) / numPoints;

  // Asymmetry: Shift the center of mass slightly
  const centerOffsetX = randomRange(-30, 30);
  const centerOffsetY = randomRange(-30, 30);

  // Irregularity factors
  const noiseFreq = randomRange(1, 4); // How many "lobes" or waves
  const stretchX = randomRange(0.7, 1.4); // Stretch horizontally
  const stretchY = randomRange(0.7, 1.4); // Stretch vertically

  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep;
    
    // Per-point randomness (jitter)
    const randomPush = randomRange(0.7, 1.3);
    
    // Sinusoidal variance to create distinct lobes vs just noise
    const wave = Math.sin(angle * noiseFreq); // -1 to 1
    
    // Combine base radius with wave and jitter
    // The 0.8 + 0.3*wave ensures we don't go too close to center
    const r = baseRadius * randomPush * (0.8 + 0.3 * wave);
    
    const x = centerX + centerOffsetX + Math.cos(angle) * r * stretchX;
    const y = centerY + centerOffsetY + Math.sin(angle) * r * stretchY;
    points.push([x, y]);
  }

  // curveBasisClosed creates a very smooth, organic look
  return d3.line().curve(d3.curveBasisClosed)(points) || "";
};

/**
 * Generates geometric shapes with distinct styles:
 * 1. Spiky/Star-like
 * 2. Blocky/Orthogonal (Step curve)
 * 3. Asymmetric Polygon
 */
export const generateGeometricPath = (width: number, height: number): string => {
  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) * 0.38;

  const style = Math.random();

  // STYLE 1: Spiky Star / Burst (30% chance)
  if (style < 0.3) {
    const points: [number, number][] = [];
    const spikes = Math.floor(randomRange(5, 12));
    const innerMult = randomRange(0.3, 0.65); // Depth of the spikes
    
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (Math.PI * i) / spikes;
      // Alternate between outer radius and inner radius
      const isOuter = i % 2 === 0;
      const r = baseRadius * (isOuter ? randomRange(0.9, 1.25) : innerMult);
      
      // Small jitter to rotation
      const theta = angle + randomRange(-0.05, 0.05);

      points.push([
        centerX + Math.cos(theta) * r,
        centerY + Math.sin(theta) * r
      ]);
    }
    // curveLinearClosed makes sharp, straight edges
    return d3.line().curve(d3.curveLinearClosed)(points) || "";
  } 
  
  // STYLE 2: Blocky / Orthogonal (40% chance) 
  // Uses curveStepClosed to create 90-degree angles
  else if (style < 0.7) {
    const points: [number, number][] = [];
    const steps = Math.floor(randomRange(5, 10));
    
    // Asymmetric center shift
    const offX = randomRange(-20, 20);
    const offY = randomRange(-20, 20);

    for (let i = 0; i < steps; i++) {
        const angle = (i / steps) * Math.PI * 2;
        // High variance in radius creates "nooks and crannies"
        const r = baseRadius * randomRange(0.4, 1.3);
        points.push([
            centerX + offX + Math.cos(angle) * r,
            centerY + offY + Math.sin(angle) * r
        ]);
    }
    // curveStepClosed connects points with vertical/horizontal lines
    return d3.line().curve(d3.curveStepClosed)(points) || "";
  } 
  
  // STYLE 3: Sharp Asymmetric Polygon (30% chance)
  else {
    const points: [number, number][] = [];
    const vertices = Math.floor(randomRange(3, 7)); // Triangles to Heptagons
    
    let currentAngle = 0;
    for (let i = 0; i < vertices; i++) {
        // Distribute points unevenly around the circle
        const angleSlice = (Math.PI * 2) / vertices;
        currentAngle += angleSlice * randomRange(0.6, 1.4); // Uneven spacing
        
        const r = baseRadius * randomRange(0.6, 1.4); // Uneven distance
        
        points.push([
            centerX + Math.cos(currentAngle) * r,
            centerY + Math.sin(currentAngle) * r
        ]);
    }
    return d3.line().curve(d3.curveLinearClosed)(points) || "";
  }
};
