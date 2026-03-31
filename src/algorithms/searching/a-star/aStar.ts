export interface Point {
  x: number;
  y: number;
}

interface Node {
  point: Point;
  g: number;
  h: number;
  f: number;
  parent: Node | null;
  closed: boolean;
}

export function aStar(
  grid: number[][],
  start: Point,
  goal: Point,
): Point[] | null {
  if (!grid || grid.length === 0 || grid[0].length === 0) return null;

  const rows = grid.length;
  const cols = grid[0].length;

  const isInside = (x: number, y: number): boolean => {
    return x >= 0 && x < cols && y >= 0 && y < rows;
  };

  // Ensure start and goal are actually on the map before checking values
  if (!isInside(start.x, start.y) || !isInside(goal.x, goal.y)) return null;

  // Ensure start and goal are walkable (0)
  if (grid[start.y][start.x] !== 0 || grid[goal.y][goal.x] !== 0) return null;

  // Already at the goal
  if (start.x === goal.x && start.y === goal.y) return [start];
}
