import { describe, it, expect, beforeEach } from 'vitest';
import DirectedMatrixGraph from './DirectedMatrixGraph';

describe('DirectedMatrixGraph', () => {
  let graph: DirectedMatrixGraph;

  beforeEach(() => {
    graph = new DirectedMatrixGraph(5);
  });

  describe('constructor', () => {
    it('should create a graph with correct number of vertices', () => {
      expect(graph.getVertexCount()).toBe(5);
    });

    it('should initialize with no edges', () => {
      const matrix = graph.getMatrix();
      const hasEdge = matrix.some((row) => row.some((val) => val !== 0));

      expect(hasEdge).toBe(false);
    });
  });

  describe('addEdge', () => {
    it('should add an edge between two vertices', () => {
      graph.addEdge(0, 1);

      expect(graph.hasEdge(0, 1)).toBe(true);
    });

    it('should add weighted edges', () => {
      graph.addEdge(0, 1, 5);

      expect(graph.getWeight(0, 1)).toBe(5);
    });

    it('should be directional (edge only in one direction)', () => {
      graph.addEdge(0, 1);

      expect(graph.hasEdge(0, 1)).toBe(true);
      expect(graph.hasEdge(1, 0)).toBe(false);
    });

    it('should throw error for invalid vertex', () => {
      expect(() => graph.addEdge(-1, 0)).toThrow('Invalid vertex index');
      expect(() => graph.addEdge(0, 10)).toThrow('Invalid vertex index');
    });
  });

  describe('removeEdge', () => {
    it('should remove an existing edge', () => {
      graph.addEdge(0, 1);
      expect(graph.hasEdge(0, 1)).toBe(true);

      graph.removeEdge(0, 1);
      expect(graph.hasEdge(0, 1)).toBe(false);
    });

    it('should throw error for invalid vertex', () => {
      expect(() => graph.removeEdge(-1, 0)).toThrow('Invalid vertex index');
    });
  });

  describe('getNeighbors', () => {
    it('should return all neighbors of a vertex', () => {
      graph.addEdge(0, 1);
      graph.addEdge(0, 2);
      graph.addEdge(0, 3);

      expect(graph.getNeighbors(0)).toEqual([1, 2, 3]);
    });

    it('should return empty array for vertex with no neighbors', () => {
      expect(graph.getNeighbors(0)).toEqual([]);
    });
  });

  describe('getInDegree and getOutDegree', () => {
    beforeEach(() => {
      graph.addEdge(0, 1);
      graph.addEdge(0, 2);
      graph.addEdge(1, 2);
      graph.addEdge(3, 1);
    });

    it('should calculate in-degree correctly', () => {
      expect(graph.getInDegree(1)).toBe(2); // edges from 0 and 3
      expect(graph.getInDegree(2)).toBe(2); // edges from 0 and 1
      expect(graph.getInDegree(0)).toBe(0); // no incoming edges
    });

    it('should calculate out-degree correctly', () => {
      expect(graph.getOutDegree(0)).toBe(2); // edges to 1 and 2
      expect(graph.getOutDegree(1)).toBe(1); // edge to 2
      expect(graph.getOutDegree(4)).toBe(0); // no outgoing edges
    });
  });

  describe('BFS', () => {
    beforeEach(() => {
      // Create graph: 0 -> 1 -> 3
      //                |    |
      //                v    v
      //                2 -> 4
      graph.addEdge(0, 1);
      graph.addEdge(0, 2);
      graph.addEdge(1, 3);
      graph.addEdge(1, 4);
      graph.addEdge(2, 4);
    });

    it('should traverse graph in BFS order', () => {
      const result = graph.bfs(0);

      expect(result).toEqual([0, 1, 2, 3, 4]);
    });

    it('should start from any valid vertex', () => {
      const result = graph.bfs(1);

      expect(result).toEqual([1, 3, 4]);
    });

    it('should throw error for invalid start vertex', () => {
      expect(() => graph.bfs(-1)).toThrow('Invalid vertex index');
      expect(() => graph.bfs(10)).toThrow('Invalid vertex index');
    });

    it('should handle disconnected components', () => {
      const isolatedGraph = new DirectedMatrixGraph(3);

      isolatedGraph.addEdge(0, 1);
      // vertex 2 is isolated
      const result = isolatedGraph.bfs(0);

      expect(result).toEqual([0, 1]);
    });
  });

  describe('DFS', () => {
    beforeEach(() => {
      // Create graph: 0 -> 1 -> 3
      //                |    |
      //                v    v
      //                2 -> 4
      graph.addEdge(0, 1);
      graph.addEdge(0, 2);
      graph.addEdge(1, 3);
      graph.addEdge(1, 4);
      graph.addEdge(2, 4);
    });

    it('should traverse graph in DFS order (iterative)', () => {
      const result = graph.dfs(0);

      expect(result).toEqual([0, 1, 3, 4, 2]);
    });

    it('should traverse graph in DFS order (recursive)', () => {
      const result = graph.dfsRecursive(0);

      expect(result).toEqual([0, 1, 3, 4, 2]);
    });

    it('should handle different start vertices', () => {
      const result = graph.dfs(1);

      expect(result).toEqual([1, 3, 4]);
    });

    it('should throw error for invalid start vertex', () => {
      expect(() => graph.dfs(-1)).toThrow('Invalid vertex index');
      expect(() => graph.dfsRecursive(10)).toThrow('Invalid vertex index');
    });
  });

  describe('hasPath', () => {
    beforeEach(() => {
      graph.addEdge(0, 1);
      graph.addEdge(1, 2);
      graph.addEdge(2, 3);
      // vertex 4 is isolated
    });

    it('should return true for connected vertices', () => {
      expect(graph.hasPath(0, 3)).toBe(true);
      expect(graph.hasPath(0, 2)).toBe(true);
      expect(graph.hasPath(1, 3)).toBe(true);
    });

    it('should return false for disconnected vertices', () => {
      expect(graph.hasPath(0, 4)).toBe(false);
      expect(graph.hasPath(3, 0)).toBe(false); // no reverse path
    });

    it('should return true for same vertex', () => {
      expect(graph.hasPath(0, 0)).toBe(true);
    });

    it('should return false for invalid vertices', () => {
      expect(graph.hasPath(-1, 0)).toBe(false);
      expect(graph.hasPath(0, 10)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle self-loops', () => {
      graph.addEdge(0, 0);
      expect(graph.hasEdge(0, 0)).toBe(true);
      expect(graph.getNeighbors(0)).toEqual([0]);
    });

    it('should handle single vertex graph', () => {
      const single = new DirectedMatrixGraph(1);

      expect(single.bfs(0)).toEqual([0]);
      expect(single.dfs(0)).toEqual([0]);
    });

    it('should handle complete graph', () => {
      const complete = new DirectedMatrixGraph(3);

      complete.addEdge(0, 1);
      complete.addEdge(0, 2);
      complete.addEdge(1, 0);
      complete.addEdge(1, 2);
      complete.addEdge(2, 0);
      complete.addEdge(2, 1);

      expect(complete.bfs(0).sort()).toEqual([0, 1, 2]);
    });
  });
});
