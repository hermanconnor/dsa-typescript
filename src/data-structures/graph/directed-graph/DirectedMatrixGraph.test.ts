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
});
