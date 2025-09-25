import { Node } from '@/types/projects';

// Grid settings
const GRID_SIZE = 8; // Base grid size in pixels
const SNAP_THRESHOLD = 5; // Snap threshold in pixels

export function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
  const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
  return [snappedX, snappedY];
}

// Find nearest alignment points (edges of other components)
export function findAlignmentGuides(
  currentNode: Pick<Node, 'x' | 'y' | 'width' | 'height'>,
  otherNodes: Node[],
  threshold: number = SNAP_THRESHOLD
): { vertical: number[], horizontal: number[] } {
  const guides = {
    vertical: [] as number[],
    horizontal: [] as number[]
  };

  // Current node edges
  const currentLeft = currentNode.x;
  const currentRight = currentNode.x + (currentNode.width || 0);
  const currentTop = currentNode.y;
  const currentBottom = currentNode.y + (currentNode.height || 0);
  const currentCenterX = currentLeft + (currentNode.width || 0) / 2;
  const currentCenterY = currentTop + (currentNode.height || 0) / 2;

  otherNodes.forEach(node => {
    const left = node.x;
    const right = node.x + (node.width || 0);
    const top = node.y;
    const bottom = node.y + (node.height || 0);
    const centerX = left + (node.width || 0) / 2;
    const centerY = top + (node.height || 0) / 2;

    // Vertical alignment
    [left, right, centerX].forEach(x => {
      [currentLeft, currentRight, currentCenterX].forEach(currentX => {
        if (Math.abs(x - currentX) <= threshold) {
          guides.vertical.push(x);
        }
      });
    });

    // Horizontal alignment
    [top, bottom, centerY].forEach(y => {
      [currentTop, currentBottom, currentCenterY].forEach(currentY => {
        if (Math.abs(y - currentY) <= threshold) {
          guides.horizontal.push(y);
        }
      });
    });
  });

  return {
    vertical: Array.from(new Set(guides.vertical)), // Remove duplicates
    horizontal: Array.from(new Set(guides.horizontal))
  };
}

// Find the closest snap point
export function findClosestSnapPoint(
  value: number,
  guides: number[],
  threshold: number = SNAP_THRESHOLD
): number | null {
  if (guides.length === 0) return null;

  const closest = guides.reduce((prev, curr) => {
    const prevDiff = Math.abs(prev - value);
    const currDiff = Math.abs(curr - value);
    return currDiff < prevDiff ? curr : prev;
  });

  return Math.abs(closest - value) <= threshold ? closest : null;
}

// Calculate final position with both grid and alignment snapping
export function calculateSnapPosition(
  x: number,
  y: number,
  currentNode: Pick<Node, 'x' | 'y' | 'width' | 'height'>,
  otherNodes: Node[]
): [number, number] {
  // First, get grid-snapped position
  const [gridX, gridY] = snapToGrid(x, y);

  // Then, find alignment guides
  const guides = findAlignmentGuides(
    { ...currentNode, x: gridX, y: gridY },
    otherNodes
  );

  // Check for alignment snaps
  const snapX = findClosestSnapPoint(gridX, guides.vertical);
  const snapY = findClosestSnapPoint(gridY, guides.horizontal);

  // Return the snapped position, falling back to grid position if no alignment snap
  return [
    snapX !== null ? snapX : gridX,
    snapY !== null ? snapY : gridY
  ];
}
