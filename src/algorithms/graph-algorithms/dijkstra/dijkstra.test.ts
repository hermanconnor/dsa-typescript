import { describe, it, expect } from 'vitest';
import { dijkstra, createGraph } from './dijkstra';

describe('Dijkstra Algorithm', () => {
  describe('dijkstra', () => {
    it('should find shortest paths in a simple graph', () => {
      const edges: [number, number, number][] = [
        [0, 1, 4],
        [0, 2, 1],
        [2, 1, 2],
        [1, 3, 1],
        [2, 3, 5],
      ];
      const graph = createGraph(edges);
      const result = dijkstra(graph, 0);

      expect(result.distances.get(0)).toBe(0);
      expect(result.distances.get(1)).toBe(3);
      expect(result.distances.get(2)).toBe(1);
      expect(result.distances.get(3)).toBe(4);
    });

    it('should handle a single node graph', () => {
      const graph = new Map();
      graph.set(0, []);
      const result = dijkstra(graph, 0);

      expect(result.distances.get(0)).toBe(0);
      expect(result.distances.size).toBe(1);
    });

    it('should handle disconnected nodes', () => {
      const edges: [number, number, number][] = [
        [0, 1, 1],
        [2, 3, 1],
      ];
      const graph = createGraph(edges);
      const result = dijkstra(graph, 0);

      expect(result.distances.get(0)).toBe(0);
      expect(result.distances.get(1)).toBe(1);
      expect(result.distances.has(2)).toBe(false);
      expect(result.distances.has(3)).toBe(false);
    });

    it('should handle a linear path', () => {
      const edges: [number, number, number][] = [
        [0, 1, 5],
        [1, 2, 3],
        [2, 3, 2],
      ];
      const graph = createGraph(edges);
      const result = dijkstra(graph, 0);

      expect(result.distances.get(0)).toBe(0);
      expect(result.distances.get(1)).toBe(5);
      expect(result.distances.get(2)).toBe(8);
      expect(result.distances.get(3)).toBe(10);
    });

    it('should choose shorter path when multiple paths exist', () => {
      const edges: [number, number, number][] = [
        [0, 1, 10],
        [0, 2, 3],
        [2, 1, 2],
      ];
      const graph = createGraph(edges);
      const result = dijkstra(graph, 0);

      expect(result.distances.get(1)).toBe(5); // Via node 2, not direct
      expect(result.previous.get(1)).toBe(2);
    });

    it('should handle a complex graph with cycles', () => {
      const edges: [number, number, number][] = [
        [0, 1, 1],
        [1, 2, 1],
        [2, 0, 1], // Cycle back
        [1, 3, 4],
        [2, 3, 2],
      ];
      const graph = createGraph(edges);
      const result = dijkstra(graph, 0);

      expect(result.distances.get(0)).toBe(0);
      expect(result.distances.get(1)).toBe(1);
      expect(result.distances.get(2)).toBe(2);
      expect(result.distances.get(3)).toBe(4); // Via 0->1->2->3
    });

    it('should handle graphs with zero-weight edges', () => {
      const edges: [number, number, number][] = [
        [0, 1, 0],
        [1, 2, 5],
      ];
      const graph = createGraph(edges);
      const result = dijkstra(graph, 0);

      expect(result.distances.get(0)).toBe(0);
      expect(result.distances.get(1)).toBe(0);
      expect(result.distances.get(2)).toBe(5);
    });

    it('should correctly track previous nodes for path reconstruction', () => {
      const edges: [number, number, number][] = [
        [0, 1, 1],
        [1, 2, 1],
        [2, 3, 1],
      ];
      const graph = createGraph(edges);
      const result = dijkstra(graph, 0);

      expect(result.previous.get(0)).toBe(null);
      expect(result.previous.get(1)).toBe(0);
      expect(result.previous.get(2)).toBe(1);
      expect(result.previous.get(3)).toBe(2);
    });

    it('should handle starting from a non-zero node', () => {
      const edges: [number, number, number][] = [
        [0, 1, 1],
        [1, 2, 1],
        [2, 3, 1],
      ];
      const graph = createGraph(edges);
      const result = dijkstra(graph, 1);

      expect(result.distances.get(1)).toBe(0);
      expect(result.distances.get(2)).toBe(1);
      expect(result.distances.get(3)).toBe(2);
      expect(result.distances.has(0)).toBe(false);
    });
  });

  describe('createGraph', () => {
    it('should create a graph from edge list', () => {
      const edges: [number, number, number][] = [
        [0, 1, 5],
        [0, 2, 3],
        [1, 2, 1],
      ];
      const graph = createGraph(edges);

      expect(graph.get(0)).toEqual([
        { to: 1, weight: 5 },
        { to: 2, weight: 3 },
      ]);
      expect(graph.get(1)).toEqual([{ to: 2, weight: 1 }]);
      expect(graph.get(2)).toBeUndefined();
    });

    it('should handle empty edge list', () => {
      const graph = createGraph([]);
      expect(graph.size).toBe(0);
    });

    it('should handle multiple edges from same node', () => {
      const edges: [number, number, number][] = [
        [0, 1, 1],
        [0, 2, 2],
        [0, 3, 3],
      ];
      const graph = createGraph(edges);

      expect(graph.get(0)?.length).toBe(3);
      expect(graph.get(0)).toEqual([
        { to: 1, weight: 1 },
        { to: 2, weight: 2 },
        { to: 3, weight: 3 },
      ]);
    });
  });

  describe('integration tests', () => {
    it('should find shortest path in a weighted directed graph', () => {
      const edges: [number, number, number][] = [
        [0, 1, 7],
        [0, 2, 9],
        [0, 5, 14],
        [1, 2, 10],
        [1, 3, 15],
        [2, 3, 11],
        [2, 5, 2],
        [3, 4, 6],
        [4, 5, 9],
      ];
      const graph = createGraph(edges);
      const result = dijkstra(graph, 0);

      expect(result.distances.get(0)).toBe(0);
      expect(result.distances.get(1)).toBe(7);
      expect(result.distances.get(2)).toBe(9);
      expect(result.distances.get(3)).toBe(20);
      expect(result.distances.get(4)).toBe(26);
      expect(result.distances.get(5)).toBe(11);
    });

    it('should handle dense graph efficiently', () => {
      const edges: [number, number, number][] = [];
      // Create a complete graph with 10 nodes
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (i !== j) {
            edges.push([i, j, i + j + 1]);
          }
        }
      }
      const graph = createGraph(edges);
      const result = dijkstra(graph, 0);

      expect(result.distances.get(0)).toBe(0);
      expect(result.distances.size).toBe(10);
      // All nodes should be reachable
      for (let i = 1; i < 10; i++) {
        expect(result.distances.has(i)).toBe(true);
      }
    });
  });
});
