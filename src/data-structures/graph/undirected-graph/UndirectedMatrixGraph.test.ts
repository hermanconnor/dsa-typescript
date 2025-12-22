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
});
