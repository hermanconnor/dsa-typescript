import { describe, it, expect, beforeEach } from 'vitest';
import UndirectedMatrixGraph from './UndirectedMatrixGraph';

describe('UndirectedGraph', () => {
  let graph: UndirectedMatrixGraph;

  beforeEach(() => {
    graph = new UndirectedMatrixGraph(5);
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

    it('should be bidirectional', () => {
      graph.addEdge(0, 1);

      expect(graph.hasEdge(0, 1)).toBe(true);
      expect(graph.hasEdge(1, 0)).toBe(true); // Both directions!
    });

    it('should add weighted edges in both directions', () => {
      graph.addEdge(0, 1, 5);

      expect(graph.getWeight(0, 1)).toBe(5);
      expect(graph.getWeight(1, 0)).toBe(5); // Same weight both ways
    });

    it('should throw error for invalid vertex', () => {
      expect(() => graph.addEdge(-1, 0)).toThrow('Invalid vertex index');
      expect(() => graph.addEdge(0, 10)).toThrow('Invalid vertex index');
    });
  });

  describe('removeEdge', () => {
    it('should remove edge in both directions', () => {
      graph.addEdge(0, 1);

      expect(graph.hasEdge(0, 1)).toBe(true);
      expect(graph.hasEdge(1, 0)).toBe(true);

      graph.removeEdge(0, 1);

      expect(graph.hasEdge(0, 1)).toBe(false);
      expect(graph.hasEdge(1, 0)).toBe(false);
    });
  });

  describe('getDegree', () => {
    beforeEach(() => {
      graph.addEdge(0, 1);
      graph.addEdge(0, 2);
      graph.addEdge(1, 2);
    });

    it('should calculate degree correctly', () => {
      expect(graph.getDegree(0)).toBe(2); // connected to 1 and 2
      expect(graph.getDegree(1)).toBe(2); // connected to 0 and 2
      expect(graph.getDegree(2)).toBe(2); // connected to 0 and 1
      expect(graph.getDegree(3)).toBe(0); // isolated vertex
    });
  });

  describe('BFS and DFS', () => {
    beforeEach(() => {
      // Create graph: 0 - 1 - 3
      //               |   |
      //               2 - 4
      graph.addEdge(0, 1);
      graph.addEdge(0, 2);
      graph.addEdge(1, 3);
      graph.addEdge(1, 4);
      graph.addEdge(2, 4);
    });

    it('should traverse in BFS order', () => {
      const result = graph.bfs(0);

      expect(result).toEqual([0, 1, 2, 3, 4]);
    });

    it('should traverse in DFS order', () => {
      const result = graph.dfs(0);

      expect(result.length).toBe(5);
      expect(result[0]).toBe(0);
    });
  });

  describe('hasPath', () => {
    beforeEach(() => {
      graph.addEdge(0, 1);
      graph.addEdge(1, 2);
      // vertices 3 and 4 are isolated
    });

    it('should find path in both directions', () => {
      expect(graph.hasPath(0, 2)).toBe(true);
      expect(graph.hasPath(2, 0)).toBe(true); // Undirected!
    });

    it('should return false for disconnected vertices', () => {
      expect(graph.hasPath(0, 3)).toBe(false);
      expect(graph.hasPath(2, 4)).toBe(false);
    });
  });

  describe('findConnectedComponents', () => {
    it('should find all connected components', () => {
      // Component 1: 0-1-2
      graph.addEdge(0, 1);
      graph.addEdge(1, 2);

      // Component 2: 3-4
      graph.addEdge(3, 4);

      const components = graph.findConnectedComponents();

      expect(components.length).toBe(2);
      expect(components[0].sort()).toEqual([0, 1, 2]);
      expect(components[1].sort()).toEqual([3, 4]);
    });

    it('should handle fully connected graph', () => {
      graph.addEdge(0, 1);
      graph.addEdge(1, 2);
      graph.addEdge(2, 3);
      graph.addEdge(3, 4);

      const components = graph.findConnectedComponents();

      expect(components.length).toBe(1);
      expect(components[0].length).toBe(5);
    });
  });

  describe('isConnected', () => {
    it('should return true for connected graph', () => {
      graph.addEdge(0, 1);
      graph.addEdge(1, 2);
      graph.addEdge(2, 3);
      graph.addEdge(3, 4);

      expect(graph.isConnected()).toBe(true);
    });

    it('should return false for disconnected graph', () => {
      graph.addEdge(0, 1);
      graph.addEdge(3, 4);

      expect(graph.isConnected()).toBe(false);
    });
  });

  describe('hasCycle', () => {
    it('should detect cycles', () => {
      graph.addEdge(0, 1);
      graph.addEdge(1, 2);
      graph.addEdge(2, 0); // Creates a cycle

      expect(graph.hasCycle()).toBe(true);
    });

    it('should return false for acyclic graph', () => {
      graph.addEdge(0, 1);
      graph.addEdge(1, 2);
      graph.addEdge(2, 3);

      expect(graph.hasCycle()).toBe(false);
    });

    it('should detect self-loop as cycle', () => {
      graph.addEdge(0, 0);
      expect(graph.hasCycle()).toBe(true);
    });
  });

  describe('getEdgeCount', () => {
    it('should count edges correctly', () => {
      expect(graph.getEdgeCount()).toBe(0);

      graph.addEdge(0, 1);
      expect(graph.getEdgeCount()).toBe(1); // Not 2, even though stored twice

      graph.addEdge(1, 2);
      graph.addEdge(2, 3);
      expect(graph.getEdgeCount()).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('should handle self-loops', () => {
      graph.addEdge(0, 0);

      expect(graph.hasEdge(0, 0)).toBe(true);
    });

    it('should handle single vertex', () => {
      const single = new UndirectedMatrixGraph(1);

      expect(single.isConnected()).toBe(true);
      expect(single.hasCycle()).toBe(false);
    });
  });
});
