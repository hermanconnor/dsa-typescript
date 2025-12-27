import { describe, it, expect } from 'vitest';
import {
  bellmanFord,
  reconstructPath,
  getVertices,
  Edge,
} from './bellman-ford';

describe('Bellman-Ford Algorithm', () => {
  describe('bellmanFord', () => {
    it('should find the shortest path in a simple numeric graph', () => {
      const vertices = [1, 2, 3];
      const edges: Edge<number>[] = [
        { from: 1, to: 2, weight: 5 },
        { from: 2, to: 3, weight: 10 },
        { from: 1, to: 3, weight: 20 },
      ];

      const result = bellmanFord(edges, vertices, 1);

      expect(result.distances.get(3)).toBe(15);
      expect(result.previous.get(3)).toBe(2);
      expect(result.hasNegativeCycle).toBe(false);
    });

    it('should work with string-based vertices (generic test)', () => {
      const vertices = ['A', 'B', 'C', 'D'];
      const edges: Edge<string>[] = [
        { from: 'A', to: 'B', weight: 1 },
        { from: 'B', to: 'C', weight: 2 },
        { from: 'A', to: 'C', weight: 5 },
        { from: 'C', to: 'D', weight: 1 },
      ];

      const result = bellmanFord(edges, vertices, 'A');

      expect(result.distances.get('D')).toBe(4); // A -> B -> C -> D
      expect(reconstructPath(result.previous, 'A', 'D')).toEqual([
        'A',
        'B',
        'C',
        'D',
      ]);
    });

    it('should handle negative weights without cycles', () => {
      const vertices = ['S', 'A', 'B'];
      const edges: Edge<string>[] = [
        { from: 'S', to: 'A', weight: 10 },
        { from: 'S', to: 'B', weight: 8 },
        { from: 'A', to: 'B', weight: -5 },
      ];

      const result = bellmanFord(edges, vertices, 'S');

      // S -> A -> B is 10 + (-5) = 5, which is better than S -> B (8)
      expect(result.distances.get('B')).toBe(5);
      expect(result.hasNegativeCycle).toBe(false);
    });

    it('should detect a negative cycle and identify affected nodes', () => {
      const vertices = ['A', 'B', 'C', 'D'];
      const edges: Edge<string>[] = [
        { from: 'A', to: 'B', weight: 1 },
        { from: 'B', to: 'C', weight: -5 },
        { from: 'C', to: 'B', weight: 1 }, // Cycle: B -> C -> B has weight -4
        { from: 'C', to: 'D', weight: 2 },
      ];

      const result = bellmanFord(edges, vertices, 'A');

      expect(result.hasNegativeCycle).toBe(true);
      expect(result.negativeCycleNodes?.has('B')).toBe(true);
      expect(result.negativeCycleNodes?.has('C')).toBe(true);
      // D is reachable from the negative cycle, so it should also be marked
      expect(result.negativeCycleNodes?.has('D')).toBe(true);
    });

    it('should return null path if the end node is unreachable', () => {
      const vertices = ['A', 'B', 'Z'];
      const edges: Edge<string>[] = [{ from: 'A', to: 'B', weight: 1 }];

      const result = bellmanFord(edges, vertices, 'A');
      const path = reconstructPath(result.previous, 'A', 'Z');

      expect(path).toBeNull();
      expect(result.distances.get('Z')).toBe(Infinity);
    });

    it('should handle negative weights correctly', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 5 },
        { from: 0, to: 2, weight: 3 },
        { from: 1, to: 2, weight: -2 },
        { from: 2, to: 3, weight: 2 },
      ];
      const vertices = getVertices(edges);
      const result = bellmanFord(edges, vertices, 0);

      expect(result.distances.get(0)).toBe(0);
      expect(result.distances.get(1)).toBe(5);
      expect(result.distances.get(2)).toBe(3);
      expect(result.distances.get(3)).toBe(5);
      expect(result.hasNegativeCycle).toBe(false);
    });

    it('should detect negative cycles', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: -1 },
        { from: 2, to: 1, weight: -1 }, // Creates negative cycle: 1->2->1
      ];
      const vertices = getVertices(edges);
      const result = bellmanFord(edges, vertices, 0);

      expect(result.hasNegativeCycle).toBe(true);
      expect(result.negativeCycleNodes).toBeDefined();
      expect(result.negativeCycleNodes?.size).toBeGreaterThan(0);
    });

    it('should detect negative cycle reachable from start', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 },
        { from: 2, to: 3, weight: -5 },
        { from: 3, to: 1, weight: 1 }, // Negative cycle: 1->2->3->1
      ];
      const vertices = getVertices(edges);
      const result = bellmanFord(edges, vertices, 0);

      expect(result.hasNegativeCycle).toBe(true);
      expect(result.negativeCycleNodes?.has(1)).toBe(true);
      expect(result.negativeCycleNodes?.has(2)).toBe(true);
      expect(result.negativeCycleNodes?.has(3)).toBe(true);
    });

    it('should handle single node graph', () => {
      const edges: Edge<number>[] = [];
      const vertices = new Set([0]);
      const result = bellmanFord(edges, vertices, 0);

      expect(result.distances.get(0)).toBe(0);
      expect(result.distances.size).toBe(1);
      expect(result.hasNegativeCycle).toBe(false);
    });

    it('should handle disconnected nodes', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 2, to: 3, weight: 1 },
      ];
      const vertices = getVertices(edges);
      const result = bellmanFord(edges, vertices, 0);

      expect(result.distances.get(0)).toBe(0);
      expect(result.distances.get(1)).toBe(1);
      expect(result.distances.get(2)).toBe(Infinity);
      expect(result.distances.get(3)).toBe(Infinity);
      expect(result.hasNegativeCycle).toBe(false);
    });

    it('should find shortest path with negative edges', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 4 },
        { from: 0, to: 2, weight: 1 },
        { from: 2, to: 1, weight: 2 },
        { from: 1, to: 3, weight: 1 },
        { from: 2, to: 3, weight: 5 },
        { from: 3, to: 4, weight: -3 }, // Negative weight
      ];
      const vertices = getVertices(edges);
      const result = bellmanFord(edges, vertices, 0);

      expect(result.distances.get(4)).toBe(1); // 0->2->1->3->4 = 1+2+1+(-3) = 1
      expect(result.hasNegativeCycle).toBe(false);
    });

    it('should handle linear path', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 5 },
        { from: 1, to: 2, weight: 3 },
        { from: 2, to: 3, weight: 2 },
      ];
      const vertices = getVertices(edges);
      const result = bellmanFord(edges, vertices, 0);

      expect(result.distances.get(0)).toBe(0);
      expect(result.distances.get(1)).toBe(5);
      expect(result.distances.get(2)).toBe(8);
      expect(result.distances.get(3)).toBe(10);
    });

    it('should correctly track previous nodes', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 1 },
        { from: 2, to: 3, weight: 1 },
      ];
      const vertices = getVertices(edges);
      const result = bellmanFord(edges, vertices, 0);

      expect(result.previous.get(0)).toBe(null);
      expect(result.previous.get(1)).toBe(0);
      expect(result.previous.get(2)).toBe(1);
      expect(result.previous.get(3)).toBe(2);
    });

    it('should handle zero-weight edges', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 0 },
        { from: 1, to: 2, weight: 5 },
      ];
      const vertices = getVertices(edges);
      const result = bellmanFord(edges, vertices, 0);

      expect(result.distances.get(0)).toBe(0);
      expect(result.distances.get(1)).toBe(0);
      expect(result.distances.get(2)).toBe(5);
      expect(result.hasNegativeCycle).toBe(false);
    });

    it('should handle starting from non-zero node', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 1 },
        { from: 2, to: 3, weight: 1 },
      ];
      const vertices = getVertices(edges);
      const result = bellmanFord(edges, vertices, 1);

      expect(result.distances.get(0)).toBe(Infinity);
      expect(result.distances.get(1)).toBe(0);
      expect(result.distances.get(2)).toBe(1);
      expect(result.distances.get(3)).toBe(2);
    });

    it('should handle complex graph with multiple paths', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 7 },
        { from: 0, to: 2, weight: 9 },
        { from: 0, to: 5, weight: 14 },
        { from: 1, to: 2, weight: 10 },
        { from: 1, to: 3, weight: 15 },
        { from: 2, to: 3, weight: 11 },
        { from: 2, to: 5, weight: 2 },
        { from: 3, to: 4, weight: 6 },
        { from: 4, to: 5, weight: 9 },
      ];
      const vertices = getVertices(edges);
      const result = bellmanFord(edges, vertices, 0);

      expect(result.distances.get(0)).toBe(0);
      expect(result.distances.get(5)).toBe(11); // via 0->2->5
      expect(result.hasNegativeCycle).toBe(false);
    });
  });

  describe('reconstructPath', () => {
    it('should reconstruct a simple path', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 1 },
        { from: 2, to: 3, weight: 1 },
      ];
      const vertices = getVertices(edges);
      const result = bellmanFord(edges, vertices, 0);
      const path = reconstructPath(result.previous, 0, 3);

      expect(path).toEqual([0, 1, 2, 3]);
    });

    it('should return null for unreachable nodes', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 2, to: 3, weight: 1 },
      ];
      const vertices = getVertices(edges);
      const result = bellmanFord(edges, vertices, 0);
      const path = reconstructPath(result.previous, 0, 3);

      expect(path).toBe(null);
    });

    it('should return path with single node when start equals end', () => {
      const edges: Edge<number>[] = [{ from: 0, to: 1, weight: 1 }];
      const vertices = getVertices(edges);
      const result = bellmanFord(edges, vertices, 0);
      const path = reconstructPath(result.previous, 0, 0);

      expect(path).toEqual([0]);
    });

    it('should reconstruct path with negative weights', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 4 },
        { from: 0, to: 2, weight: 1 },
        { from: 2, to: 1, weight: 2 },
        { from: 1, to: 3, weight: 1 },
        { from: 2, to: 3, weight: 5 },
        { from: 3, to: 4, weight: -3 },
      ];
      const vertices = getVertices(edges);
      const result = bellmanFord(edges, vertices, 0);
      const path = reconstructPath(result.previous, 0, 4);

      expect(path).toEqual([0, 2, 1, 3, 4]);
    });

    it('should detect cycles during reconstruction', () => {
      const previous = new Map<number, number | null>();
      previous.set(0, null);
      previous.set(1, 2);
      previous.set(2, 1); // Cycle!

      const path = reconstructPath(previous, 0, 1);
      expect(path).toBe(null);
    });
  });

  describe('getVertices', () => {
    it('should extract all vertices from edges', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 0, to: 2, weight: 1 },
        { from: 1, to: 2, weight: 1 },
      ];
      const vertices = getVertices(edges);

      expect(vertices.size).toBe(3);
      expect(vertices.has(0)).toBe(true);
      expect(vertices.has(1)).toBe(true);
      expect(vertices.has(2)).toBe(true);
    });

    it('should handle empty edge list', () => {
      const vertices = getVertices([]);
      expect(vertices.size).toBe(0);
    });

    it('should handle duplicate vertices', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 0, to: 2, weight: 1 },
        { from: 0, to: 1, weight: 2 }, // Duplicate edge
      ];
      const vertices = getVertices(edges);

      expect(vertices.size).toBe(3);
    });
  });
});
