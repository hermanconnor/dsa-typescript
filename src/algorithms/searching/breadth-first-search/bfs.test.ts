import { describe, it, expect } from 'vitest';
import { bfs, bfsWithArray, createGraph } from './bfs';

describe('Generic Graph BFS', () => {
  describe('bfs - basic traversal with numbers', () => {
    it('should handle single node graph', () => {
      const graph = createGraph<number>([], false);
      graph.set(1, []);

      expect(bfs(graph, 1)).toEqual([1]);
      expect(bfsWithArray(graph, 1)).toEqual([1]);
    });

    it('should traverse simple undirected graph', () => {
      //   1 --- 2
      //   |     |
      //   3 --- 4
      const edges: [number, number][] = [
        [1, 2],
        [1, 3],
        [2, 4],
        [3, 4],
      ];
      const graph = createGraph(edges, false);

      const result = bfs(graph, 1);
      expect(result).toHaveLength(4);
      expect(result[0]).toBe(1);
      expect(result).toContain(2);
      expect(result).toContain(3);
      expect(result).toContain(4);

      const resultWithArray = bfsWithArray(graph, 1);
      expect(resultWithArray).toHaveLength(4);
      expect(resultWithArray[0]).toBe(1);
      expect(resultWithArray).toContain(2);
      expect(resultWithArray).toContain(3);
      expect(resultWithArray).toContain(4);
    });

    it('should traverse directed graph', () => {
      // 1 → 2 → 3
      // ↓
      // 4
      const edges: [number, number][] = [
        [1, 2],
        [2, 3],
        [1, 4],
      ];
      const graph = createGraph(edges, true);

      expect(bfs(graph, 1)).toEqual([1, 2, 4, 3]);
      expect(bfsWithArray(graph, 1)).toEqual([1, 2, 4, 3]);
    });
  });

  describe('bfs with strings', () => {
    it('should traverse string node graph', () => {
      // A --- B --- C
      const edges: [string, string][] = [
        ['A', 'B'],
        ['B', 'C'],
      ];
      const graph = createGraph(edges, false);

      expect(bfs(graph, 'A')).toEqual(['A', 'B', 'C']);
      expect(bfsWithArray(graph, 'A')).toEqual(['A', 'B', 'C']);
    });
  });

  describe('bfs with custom objects', () => {
    type City = { name: string; id: number };

    it('should traverse graph of objects', () => {
      const nyc: City = { name: 'NYC', id: 1 };
      const la: City = { name: 'LA', id: 2 };
      const chicago: City = { name: 'Chicago', id: 3 };

      const edges: [City, City][] = [
        [nyc, la],
        [la, chicago],
      ];
      const graph = createGraph(edges, false);

      const result = bfs(graph, nyc);
      expect(result).toHaveLength(3);
      expect(result[0]).toBe(nyc);
      expect(result).toContain(la);
      expect(result).toContain(chicago);

      const resultWithArray = bfs(graph, nyc);
      expect(resultWithArray).toHaveLength(3);
      expect(resultWithArray[0]).toBe(nyc);
      expect(resultWithArray).toContain(la);
      expect(resultWithArray).toContain(chicago);
    });
  });

  describe('createGraph helper', () => {
    it('should create undirected graph correctly', () => {
      const edges: [number, number][] = [[1, 2]];
      const graph = createGraph(edges, false);

      expect(graph.get(1)).toContain(2);
      expect(graph.get(2)).toContain(1);
    });

    it('should create directed graph correctly', () => {
      const edges: [number, number][] = [[1, 2]];
      const graph = createGraph(edges, true);

      expect(graph.get(1)).toContain(2);
      expect(graph.get(2)).not.toContain(1);
    });
  });
});
