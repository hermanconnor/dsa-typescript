import { describe, it, expect, beforeEach } from 'vitest';
import DirectedMatrixGraph from './DirectedMatrixGraph';

describe('DirectedMatrixGraph', () => {
  let graph: DirectedMatrixGraph;

  beforeEach(() => {
    graph = new DirectedMatrixGraph(5);
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
});
