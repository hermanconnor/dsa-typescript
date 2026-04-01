import PriorityQueue from '../../../data-structures/priority-queue/PriorityQueue';

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

  const openPQ = new PriorityQueue<number, number>('min');
  const nodeMap = new Map<number, Node>();

  const getIdx = (p: { x: number; y: number }) => p.y * cols + p.x;

  const SQRT2 = Math.SQRT2;
  const TIE_BREAKER = 1.001;

  const getHeuristic = (x: number, y: number) => {
    const dx = Math.abs(x - goal.x);
    const dy = Math.abs(y - goal.y);
    // Octile distance for 8-way movement
    const h = dx + dy + (SQRT2 - 2) * Math.min(dx, dy);

    return h * TIE_BREAKER;
  };

  const startIdx = getIdx(start);

  const startNode: Node = {
    point: start,
    g: 0,
    h: getHeuristic(start.x, start.y),
    f: 0,
    parent: null,
    closed: false,
  };

  startNode.f = startNode.h;

  nodeMap.set(startIdx, startNode);
  openPQ.push(startIdx, startNode.f);

  const DIRS = [
    [0, -1, 1], // N
    [1, 0, 1], // E
    [0, 1, 1], // S
    [-1, 0, 1], // W
    [1, -1, SQRT2], // NE
    [1, 1, SQRT2], // SE
    [-1, 1, SQRT2], // SW
    [-1, -1, SQRT2], // NW
  ];

  while (!openPQ.empty) {
    const currentIdx = openPQ.pop()!;
    const current = nodeMap.get(currentIdx)!;

    // Goal Reached
    if (current.point.x === goal.x && current.point.y === goal.y) {
      const path: Point[] = [];
      let temp: Node | null = current;

      while (temp) {
        path.push(temp.point);
        temp = temp.parent;
      }

      return path.reverse();
    }

    current.closed = true;

    for (const [dx, dy, cost] of DIRS) {
      const nx = current.point.x + dx;
      const ny = current.point.y + dy;

      // Bounds and basic walkability
      if (!isInside(nx, ny) || grid[ny][nx] !== 0) continue;

      // Diagonal wall blocking (prevent cutting corners)
      if (dx !== 0 && dy !== 0) {
        // If either adjacent orthogonal neighbor is a wall, block diagonal move
        if (
          grid[current.point.y][nx] !== 0 ||
          grid[ny][current.point.x] !== 0
        ) {
          continue;
        }
      }

      const nIdx = ny * cols + nx;
      const neighborNode = nodeMap.get(nIdx);

      if (neighborNode?.closed) continue;

      const tentativeG = current.g + cost;

      if (!neighborNode) {
        const h = getHeuristic(nx, ny);

        const newNode: Node = {
          point: { x: nx, y: ny },
          g: tentativeG,
          h,
          f: tentativeG + h,
          parent: current,
          closed: false,
        };

        nodeMap.set(nIdx, newNode);
        openPQ.push(nIdx, newNode.f);
      } else if (tentativeG < neighborNode.g) {
        neighborNode.g = tentativeG;
        neighborNode.f = tentativeG + neighborNode.h;
        neighborNode.parent = current;
        openPQ.push(nIdx, neighborNode.f);
      }
    }
  }

  return null; // No path found
}
