import { describe, it, expect } from 'vitest';
import { aStar, Point } from './aStar';

// Helper to check if a path is valid (each step is adjacent, all points walkable)
function isValidPath(grid: number[][], path: Point[]): boolean {
  for (let i = 1; i < path.length; i++) {
    const dx = Math.abs(path[i].x - path[i - 1].x);
    const dy = Math.abs(path[i].y - path[i - 1].y);

    if (dx > 1 || dy > 1) return false;
    if (grid[path[i].y][path[i].x] !== 0) return false;
  }

  return true;
}

describe('aStar', () => {
  // ─── Guard / Edge Cases ───────────────────────────────────────────────────

  describe('guard clauses', () => {
    it('returns null for a null grid', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(aStar(null as any, { x: 0, y: 0 }, { x: 1, y: 1 })).toBeNull();
    });

    it('returns null for an empty grid', () => {
      expect(aStar([], { x: 0, y: 0 }, { x: 1, y: 1 })).toBeNull();
    });

    it('returns null for a grid with empty rows', () => {
      expect(aStar([[]], { x: 0, y: 0 }, { x: 1, y: 1 })).toBeNull();
    });

    it('returns null when start is out of bounds', () => {
      const grid = [
        [0, 0],
        [0, 0],
      ];

      expect(aStar(grid, { x: -1, y: 0 }, { x: 1, y: 1 })).toBeNull();
      expect(aStar(grid, { x: 5, y: 0 }, { x: 1, y: 1 })).toBeNull();
    });

    it('returns null when goal is out of bounds', () => {
      const grid = [
        [0, 0],
        [0, 0],
      ];

      expect(aStar(grid, { x: 0, y: 0 }, { x: 0, y: 5 })).toBeNull();
    });

    it('returns null when start is a wall', () => {
      const grid = [
        [1, 0],
        [0, 0],
      ];

      expect(aStar(grid, { x: 0, y: 0 }, { x: 1, y: 1 })).toBeNull();
    });

    it('returns null when goal is a wall', () => {
      const grid = [
        [0, 0],
        [0, 1],
      ];

      expect(aStar(grid, { x: 0, y: 0 }, { x: 1, y: 1 })).toBeNull();
    });
  });

  // ─── Trivial Cases ────────────────────────────────────────────────────────

  describe('trivial cases', () => {
    it('returns [start] when start equals goal', () => {
      const grid = [
        [0, 0],
        [0, 0],
      ];

      const result = aStar(grid, { x: 1, y: 1 }, { x: 1, y: 1 });

      expect(result).toEqual([{ x: 1, y: 1 }]);
    });

    it('returns a two-point path for immediately adjacent goal (horizontal)', () => {
      const grid = [[0, 0]];
      const result = aStar(grid, { x: 0, y: 0 }, { x: 1, y: 0 });

      expect(result).toEqual([
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ]);
    });

    it('returns a two-point path for immediately adjacent goal (vertical)', () => {
      const grid = [[0], [0]];
      const result = aStar(grid, { x: 0, y: 0 }, { x: 0, y: 1 });

      expect(result).toEqual([
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ]);
    });

    it('returns a two-point path for a diagonal neighbour goal', () => {
      const grid = [
        [0, 0],
        [0, 0],
      ];

      const result = aStar(grid, { x: 0, y: 0 }, { x: 1, y: 1 });

      expect(result).toEqual([
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ]);
    });
  });

  // ─── Reachability ─────────────────────────────────────────────────────────

  describe('no path found', () => {
    it('returns null when goal is completely surrounded by walls', () => {
      // Goal is at (1,1) — walled in — but we want it to be the goal
      // Make all neighbours walls instead so the goal itself is reachable
      // but surrounded:
      const blockedGrid = [
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
      ];

      expect(aStar(blockedGrid, { x: 0, y: 0 }, { x: 2, y: 2 })).toBeNull();
    });

    it('returns null when start and goal are in disconnected regions', () => {
      // Full vertical wall splits the grid
      const grid = [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ];

      expect(aStar(grid, { x: 0, y: 0 }, { x: 2, y: 2 })).toBeNull();
    });
  });

  // ─── Path Validity ────────────────────────────────────────────────────────

  describe('path validity', () => {
    it('path starts at start and ends at goal', () => {
      const grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];

      const start = { x: 0, y: 0 };
      const goal = { x: 2, y: 2 };
      const path = aStar(grid, start, goal)!;

      expect(path[0]).toEqual(start);
      expect(path[path.length - 1]).toEqual(goal);
    });

    it('every step in the path is at most one cell away (8-directional)', () => {
      const grid = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ];

      const path = aStar(grid, { x: 0, y: 0 }, { x: 4, y: 4 })!;

      expect(isValidPath(grid, path)).toBe(true);
    });

    it('path contains no walls', () => {
      const grid = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ];

      const path = aStar(grid, { x: 0, y: 0 }, { x: 4, y: 4 })!;

      for (const p of path) {
        expect(grid[p.y][p.x]).toBe(0);
      }
    });
  });

  // ─── Optimality ───────────────────────────────────────────────────────────

  describe('path optimality', () => {
    it('finds the shortest straight-line path on an open grid', () => {
      //  On a 5x1 corridor the only path length is 5 points.
      const grid = [[0, 0, 0, 0, 0]];
      const path = aStar(grid, { x: 0, y: 0 }, { x: 4, y: 0 })!;

      expect(path).toHaveLength(5);
    });

    it('uses diagonal movement rather than going around corners', () => {
      const grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];

      // Diagonal from (0,0) to (2,2) should be 3 points, not 5
      const path = aStar(grid, { x: 0, y: 0 }, { x: 2, y: 2 })!;

      expect(path).toHaveLength(3);
    });

    it('routes around a horizontal wall efficiently', () => {
      const grid = [
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ];

      const path = aStar(grid, { x: 0, y: 0 }, { x: 0, y: 2 })!;

      expect(path).not.toBeNull();
      expect(path[0]).toEqual({ x: 0, y: 0 });
      expect(path[path.length - 1]).toEqual({ x: 0, y: 2 });
      expect(isValidPath(grid, path)).toBe(true);
    });
  });

  // ─── Corner Cutting ───────────────────────────────────────────────────────

  describe('diagonal corner cutting prevention', () => {
    it('does not cut through a wall corner diagonally', () => {
      //  . W          The diagonal move from (0,0) → (1,1) must be
      //  . .          blocked because (1,0) is a wall.
      const grid = [
        [0, 1],
        [0, 0],
      ];

      const path = aStar(grid, { x: 0, y: 0 }, { x: 1, y: 1 })!;
      // The only valid path goes (0,0)→(0,1)→(1,1)
      expect(path).toHaveLength(3);
      expect(path).toEqual([
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ]);
    });

    it('does not cut through the other wall corner diagonally', () => {
      //  . .          The diagonal move from (0,1) → (1,0) must be
      //  W .          blocked because (0,1) row has a wall at x=0 ...
      // actually test (1,1) → (0,0) with wall at (0,1):
      const grid = [
        [0, 0],
        [1, 0],
      ];
      // (1,1) → (0,0): adjacent orthogonals are grid[1][0]=1 (wall) — must go around
      const path = aStar(grid, { x: 1, y: 1 }, { x: 0, y: 0 })!;

      expect(path).toHaveLength(3);
      expect(path).toEqual([
        { x: 1, y: 1 },
        { x: 1, y: 0 },
        { x: 0, y: 0 },
      ]);
    });
  });

  // ─── Larger / Maze Grids ──────────────────────────────────────────────────

  describe('larger grids', () => {
    it('solves a 10×10 open grid', () => {
      const grid = Array.from({ length: 10 }, () => Array(10).fill(0));

      const path = aStar(grid, { x: 0, y: 0 }, { x: 9, y: 9 })!;

      expect(path[0]).toEqual({ x: 0, y: 0 });
      expect(path[path.length - 1]).toEqual({ x: 9, y: 9 });
      expect(isValidPath(grid, path)).toBe(true);
    });

    it('solves a maze-like grid with a single winding corridor', () => {
      // Serpentine corridor:
      // S . . . W
      // W W W . W
      // W . . . W
      // W . W W W
      // W . . . G
      const grid = [
        [0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0],
      ];

      const path = aStar(grid, { x: 0, y: 0 }, { x: 4, y: 4 })!;

      expect(path).not.toBeNull();
      expect(path[path.length - 1]).toEqual({ x: 4, y: 4 });
      expect(isValidPath(grid, path)).toBe(true);
    });

    it('returns null on a fully walled 5×5 grid (except start/goal)', () => {
      const grid = Array.from({ length: 5 }, () => Array(5).fill(1));

      grid[0][0] = 0;
      grid[4][4] = 0;

      expect(aStar(grid, { x: 0, y: 0 }, { x: 4, y: 4 })).toBeNull();
    });
  });
});
