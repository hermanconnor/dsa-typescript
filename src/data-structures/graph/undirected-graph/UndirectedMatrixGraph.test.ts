import { describe, it, expect, beforeEach } from 'vitest';
import UndirectedMatrixGraph from './UndirectedMatrixGrapt';

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
});
