/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { prim, createGraphFromEdges, Edge } from './prim';

describe('Prim Algorithm', () => {
  describe('prim', () => {
    it('should find the MST of a standard connected graph with string vertices', () => {
      // Example: A diamond shape with a cross-edge
      const edges: Edge<string>[] = [
        { from: 'A', to: 'B', weight: 1 },
        { from: 'B', to: 'C', weight: 3 },
        { from: 'A', to: 'C', weight: 4 },
        { from: 'C', to: 'D', weight: 2 },
        { from: 'B', to: 'D', weight: 5 },
      ];

      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph, 'A');

      // Expected MST edges: A-B (1), C-D (2), B-C (3) = Total 6
      expect(result.totalWeight).toBe(6);
      expect(result.mst.length).toBe(3);
      expect(result.isConnected).toBe(true);
      expect(result.visited.size).toBe(4);
    });

    it('should handle a disconnected graph and report isConnected: false', () => {
      const edges: Edge<number>[] = [
        { from: 1, to: 2, weight: 10 },
        // 3 and 4 are connected to each other, but not to 1 and 2
        { from: 3, to: 4, weight: 5 },
      ];

      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph, 1);

      expect(result.isConnected).toBe(false);
      expect(result.visited.has(1)).toBe(true);
      expect(result.visited.has(2)).toBe(true);
      expect(result.visited.has(3)).toBe(false); // Should not reach isolated island
      expect(result.totalWeight).toBe(10);
    });

    it('should handle a graph with a single node', () => {
      const graph = new Map<number, any>();
      graph.set(1, []);

      const result = prim(graph, 1);

      expect(result.totalWeight).toBe(0);
      expect(result.mst).toEqual([]);
      expect(result.isConnected).toBe(true);
    });

    it('should work with different weights to pick the most optimal path', () => {
      // Testing that the "Eager" update logic correctly picks
      // the cheaper edge even if discovered later
      const edges: Edge<string>[] = [
        { from: 'Start', to: 'End', weight: 10 },
        { from: 'Start', to: 'Mid', weight: 2 },
        { from: 'Mid', to: 'End', weight: 3 },
      ];

      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph, 'Start');

      // It should pick Start-Mid (2) and Mid-End (3) = 5
      // instead of the direct Start-End (10)
      expect(result.totalWeight).toBe(5);
      expect(result.mst).toContainEqual({
        from: 'Start',
        to: 'Mid',
        weight: 2,
      });
      expect(result.mst).toContainEqual({ from: 'Mid', to: 'End', weight: 3 });
    });

    it('should throw an error if the start vertex is not in the graph', () => {
      const graph = new Map<string, any>();
      graph.set('A', []);

      expect(() => prim(graph, 'Z')).toThrow(
        'Starting vertex not found in graph',
      );
    });

    it('should find MST in a simple connected graph', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 4 },
        { from: 0, to: 2, weight: 4 },
        { from: 1, to: 2, weight: 2 },
        { from: 1, to: 3, weight: 5 },
        { from: 2, to: 3, weight: 5 },
        { from: 2, to: 4, weight: 9 },
        { from: 3, to: 4, weight: 7 },
      ];
      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph);

      expect(result.isConnected).toBe(true);
      expect(result.mst.length).toBe(4); // V - 1 = 5 - 1 = 4
      expect(result.totalWeight).toBe(18); // Minimum spanning tree weight
      expect(result.visited.size).toBe(5);
    });

    it('should handle single edge graph', () => {
      const edges: Edge<number>[] = [{ from: 0, to: 1, weight: 5 }];
      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph);

      expect(result.isConnected).toBe(true);
      expect(result.mst.length).toBe(1);
      expect(result.totalWeight).toBe(5);
    });

    it('should handle single vertex graph', () => {
      const graph = new Map();
      graph.set(0, []);
      const result = prim(graph);

      expect(result.isConnected).toBe(true);
      expect(result.mst.length).toBe(0);
      expect(result.totalWeight).toBe(0);
      expect(result.visited.size).toBe(1);
    });

    it('should handle empty graph', () => {
      const graph = new Map();
      const result = prim(graph);

      expect(result.isConnected).toBe(true);
      expect(result.mst.length).toBe(0);
      expect(result.totalWeight).toBe(0);
      expect(result.visited.size).toBe(0);
    });

    it('should detect disconnected graph', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 2, to: 3, weight: 1 },
      ];
      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph, 0);

      expect(result.isConnected).toBe(false);
      expect(result.mst.length).toBe(1); // Only edges in component with start vertex
      expect(result.visited.size).toBe(2); // Only vertices 0 and 1
    });

    it('should select edges with minimum weight', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 10 },
        { from: 1, to: 2, weight: 1 },
        { from: 0, to: 2, weight: 5 },
      ];
      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph);

      expect(result.mst.length).toBe(2);
      expect(result.totalWeight).toBe(6); // 5 + 1
    });

    it('should work from different starting vertices', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 },
        { from: 2, to: 3, weight: 3 },
      ];
      const graph = createGraphFromEdges(edges, false);

      const result1 = prim(graph, 0);
      const result2 = prim(graph, 2);

      expect(result1.totalWeight).toBe(result2.totalWeight);
      expect(result1.mst.length).toBe(result2.mst.length);
      expect(result1.isConnected).toBe(result2.isConnected);
    });

    it('should handle graph with equal weight edges', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 1 },
        { from: 2, to: 3, weight: 1 },
        { from: 0, to: 3, weight: 1 },
      ];
      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph);

      expect(result.isConnected).toBe(true);
      expect(result.mst.length).toBe(3);
      expect(result.totalWeight).toBe(3);
    });

    it('should handle linear graph', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 5 },
        { from: 1, to: 2, weight: 3 },
        { from: 2, to: 3, weight: 7 },
      ];
      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph);

      expect(result.isConnected).toBe(true);
      expect(result.mst.length).toBe(3);
      expect(result.totalWeight).toBe(15);
    });

    it('should handle star graph', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 0, to: 2, weight: 2 },
        { from: 0, to: 3, weight: 3 },
        { from: 0, to: 4, weight: 4 },
      ];
      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph);

      expect(result.isConnected).toBe(true);
      expect(result.mst.length).toBe(4);
      expect(result.totalWeight).toBe(10);
    });

    it('should work with negative weights', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: -5 },
        { from: 1, to: 2, weight: 3 },
        { from: 0, to: 2, weight: 10 },
      ];
      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph);

      expect(result.isConnected).toBe(true);
      expect(result.mst.length).toBe(2);
      expect(result.totalWeight).toBe(-2); // -5 + 3
    });

    it('should handle complete graph', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 0, to: 2, weight: 2 },
        { from: 0, to: 3, weight: 3 },
        { from: 1, to: 2, weight: 4 },
        { from: 1, to: 3, weight: 5 },
        { from: 2, to: 3, weight: 6 },
      ];
      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph);

      expect(result.isConnected).toBe(true);
      expect(result.mst.length).toBe(3);
      expect(result.totalWeight).toBe(6); // 1 + 2 + 3
    });

    it('should throw error for invalid start vertex', () => {
      const edges: Edge<number>[] = [{ from: 0, to: 1, weight: 1 }];
      const graph = createGraphFromEdges(edges, false);

      expect(() => prim(graph, 99)).toThrow();
    });

    it('should handle cycle graph', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 },
        { from: 2, to: 3, weight: 3 },
        { from: 3, to: 0, weight: 4 },
      ];
      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph);

      expect(result.isConnected).toBe(true);
      expect(result.mst.length).toBe(3); // Tree has V-1 edges
      expect(result.totalWeight).toBe(6); // 1 + 2 + 3
    });

    it('should handle dense graph efficiently', () => {
      const edges: Edge<number>[] = [];
      // Create a complete graph with 10 nodes
      for (let i = 0; i < 10; i++) {
        for (let j = i + 1; j < 10; j++) {
          edges.push({ from: i, to: j, weight: i + j });
        }
      }
      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph);

      expect(result.isConnected).toBe(true);
      expect(result.mst.length).toBe(9); // 10 - 1
      expect(result.visited.size).toBe(10);
    });
  });

  describe('createGraphFromEdges', () => {
    it('should create undirected graph', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 5 },
        { from: 1, to: 2, weight: 3 },
      ];
      const graph = createGraphFromEdges(edges, false);

      expect(graph.get(0)).toContainEqual({ to: 1, weight: 5 });
      expect(graph.get(1)).toContainEqual({ to: 0, weight: 5 });
      expect(graph.get(1)).toContainEqual({ to: 2, weight: 3 });
      expect(graph.get(2)).toContainEqual({ to: 1, weight: 3 });
    });

    it('should create directed graph', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 5 },
        { from: 1, to: 2, weight: 3 },
      ];
      const graph = createGraphFromEdges(edges, true);

      expect(graph.get(0)).toContainEqual({ to: 1, weight: 5 });
      expect(graph.get(1)).not.toContainEqual({ to: 0, weight: 5 });
      expect(graph.get(1)).toContainEqual({ to: 2, weight: 3 });
    });

    it('should handle empty edge list', () => {
      const graph = createGraphFromEdges([]);
      expect(graph.size).toBe(0);
    });

    it('should handle multiple edges between same vertices', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 5 },
        { from: 0, to: 1, weight: 3 },
      ];
      const graph = createGraphFromEdges(edges, false);

      expect(graph.get(0)?.length).toBe(2);
    });
  });

  describe('integration tests', () => {
    it('should find same MST as Kruskal for same graph', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 2 },
        { from: 0, to: 3, weight: 6 },
        { from: 1, to: 2, weight: 3 },
        { from: 1, to: 3, weight: 8 },
        { from: 1, to: 4, weight: 5 },
        { from: 2, to: 4, weight: 7 },
        { from: 3, to: 4, weight: 9 },
      ];
      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph);

      expect(result.isConnected).toBe(true);
      expect(result.mst.length).toBe(4);
      expect(result.totalWeight).toBe(16); // Same as Kruskal
    });

    it('should handle classic MST example', () => {
      const edges: Edge<number>[] = [
        { from: 0, to: 1, weight: 4 },
        { from: 0, to: 7, weight: 8 },
        { from: 1, to: 2, weight: 8 },
        { from: 1, to: 7, weight: 11 },
        { from: 2, to: 3, weight: 7 },
        { from: 2, to: 5, weight: 4 },
        { from: 2, to: 8, weight: 2 },
        { from: 3, to: 4, weight: 9 },
        { from: 3, to: 5, weight: 14 },
        { from: 4, to: 5, weight: 10 },
        { from: 5, to: 6, weight: 2 },
        { from: 6, to: 7, weight: 1 },
        { from: 6, to: 8, weight: 6 },
        { from: 7, to: 8, weight: 7 },
      ];
      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph);

      expect(result.isConnected).toBe(true);
      expect(result.mst.length).toBe(8);
      expect(result.totalWeight).toBe(37);
    });

    it('should handle large graph efficiently', () => {
      const edges: Edge<number>[] = [];
      // Create a chain of 100 nodes
      for (let i = 0; i < 99; i++) {
        edges.push({ from: i, to: i + 1, weight: i + 1 });
      }
      const graph = createGraphFromEdges(edges, false);
      const result = prim(graph);

      expect(result.isConnected).toBe(true);
      expect(result.mst.length).toBe(99);
      expect(result.visited.size).toBe(100);
    });
  });
});
