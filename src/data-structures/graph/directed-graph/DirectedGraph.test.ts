import { describe, it, expect, beforeEach } from 'vitest';
import DirectedGraph from './DirectedGraph';

describe('DirectedGraph', () => {
  let graph: DirectedGraph<string>;

  beforeEach(() => {
    graph = new DirectedGraph<string>();
  });

  // =========================================================================
  // CORE STRUCTURE MANIPULATION TESTS
  // =========================================================================

  describe('addVertex', () => {
    it('should add a vertex to the graph', () => {
      graph.addVertex('A');
      expect(graph.hasVertex('A')).toBe(true);
      expect(graph.vertexCount).toBe(1);
    });

    it('should not duplicate vertices', () => {
      graph.addVertex('A');
      graph.addVertex('A');
      expect(graph.vertexCount).toBe(1);
    });

    it('should add multiple vertices', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      expect(graph.vertexCount).toBe(3);
    });
  });

  describe('removeVertex', () => {
    it('should remove a vertex and its edges', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');

      const removed = graph.removeVertex('A');

      expect(removed).toBe(true);
      expect(graph.hasVertex('A')).toBe(false);
      expect(graph.vertexCount).toBe(1);
    });

    it('should remove incoming edges when vertex is deleted', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'C');
      graph.addEdge('B', 'C');

      graph.removeVertex('C');

      expect(graph.edgeCount).toBe(0);
    });

    it('should return false when removing non-existent vertex', () => {
      const removed = graph.removeVertex('Z');

      expect(removed).toBe(false);
    });
  });

  describe('addEdge', () => {
    it('should add an edge between two vertices', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');

      expect(graph.hasEdge('A', 'B')).toBe(true);
      expect(graph.edgeCount).toBe(1);
    });

    it('should add an edge with weight', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B', 10);

      expect(graph.getEdgeWeight('A', 'B')).toBe(10);
    });

    it('should update weight if edge already exists', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B', 5);
      graph.addEdge('A', 'B', 10);

      expect(graph.edgeCount).toBe(1);
      expect(graph.getEdgeWeight('A', 'B')).toBe(10);
    });

    it('should throw error if source vertex does not exist', () => {
      graph.addVertex('B');

      expect(() => graph.addEdge('A', 'B')).toThrow(
        'Source vertex "A" does not exist',
      );
    });

    it('should throw error if target vertex does not exist', () => {
      graph.addVertex('A');

      expect(() => graph.addEdge('A', 'B')).toThrow(
        'Target vertex "B" does not exist',
      );
    });

    it('should maintain directed property (A->B does not imply B->A)', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');

      expect(graph.hasEdge('A', 'B')).toBe(true);
      expect(graph.hasEdge('B', 'A')).toBe(false);
    });
  });

  describe('removeEdge', () => {
    it('should remove an edge', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');

      const removed = graph.removeEdge('A', 'B');

      expect(removed).toBe(true);
      expect(graph.hasEdge('A', 'B')).toBe(false);
      expect(graph.edgeCount).toBe(0);
    });

    it('should return false when removing non-existent edge', () => {
      graph.addVertex('A');
      graph.addVertex('B');

      const removed = graph.removeEdge('A', 'B');

      expect(removed).toBe(false);
    });

    it('should not affect other edges', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'C');

      graph.removeEdge('A', 'B');

      expect(graph.hasEdge('A', 'C')).toBe(true);
    });
  });

  // =========================================================================
  // QUERYING TESTS
  // =========================================================================

  describe('hasVertex', () => {
    it('should return true for existing vertex', () => {
      graph.addVertex('A');

      expect(graph.hasVertex('A')).toBe(true);
    });

    it('should return false for non-existent vertex', () => {
      expect(graph.hasVertex('Z')).toBe(false);
    });
  });

  describe('hasEdge', () => {
    it('should return true for existing edge', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');

      expect(graph.hasEdge('A', 'B')).toBe(true);
    });

    it('should return false for non-existent edge', () => {
      graph.addVertex('A');
      graph.addVertex('B');

      expect(graph.hasEdge('A', 'B')).toBe(false);
    });
  });

  describe('getNeighbors', () => {
    it('should return all neighbors', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B', 5);
      graph.addEdge('A', 'C', 10);

      const neighbors = graph.getNeighbors('A');

      expect(neighbors).toHaveLength(2);
      expect(neighbors).toContainEqual({ target: 'B', weight: 5 });
      expect(neighbors).toContainEqual({ target: 'C', weight: 10 });
    });

    it('should return empty array for vertex with no neighbors', () => {
      graph.addVertex('A');
      expect(graph.getNeighbors('A')).toEqual([]);
    });

    it('should throw error for non-existent vertex', () => {
      expect(() => graph.getNeighbors('Z')).toThrow(
        'Vertex "Z" does not exist',
      );
    });

    it('should return a copy (prevent external mutation)', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');

      const neighbors = graph.getNeighbors('A');
      neighbors.push({ target: 'C', weight: 99 });

      expect(graph.getNeighbors('A')).toHaveLength(1);
    });
  });

  describe('getEdgeWeight', () => {
    it('should return edge weight', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B', 15);

      expect(graph.getEdgeWeight('A', 'B')).toBe(15);
    });

    it('should return undefined for edge without weight', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');

      expect(graph.getEdgeWeight('A', 'B')).toBeUndefined();
    });

    it('should return undefined for non-existent edge', () => {
      graph.addVertex('A');
      graph.addVertex('B');

      expect(graph.getEdgeWeight('A', 'B')).toBeUndefined();
    });
  });

  describe('getAllVertices', () => {
    it('should return all vertices', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');

      const vertices = graph.getAllVertices();

      expect(vertices).toHaveLength(3);
      expect(vertices).toContain('A');
      expect(vertices).toContain('B');
      expect(vertices).toContain('C');
    });

    it('should return empty array for empty graph', () => {
      expect(graph.getAllVertices()).toEqual([]);
    });
  });

  describe('vertexCount and edgeCount', () => {
    it('should track vertex count correctly', () => {
      expect(graph.vertexCount).toBe(0);

      graph.addVertex('A');
      expect(graph.vertexCount).toBe(1);

      graph.addVertex('B');
      expect(graph.vertexCount).toBe(2);
    });

    it('should track edge count correctly', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');

      expect(graph.edgeCount).toBe(0);

      graph.addEdge('A', 'B');
      expect(graph.edgeCount).toBe(1);

      graph.addEdge('B', 'C');
      expect(graph.edgeCount).toBe(2);
    });
  });

  describe('getOutDegree', () => {
    it('should return number of outgoing edges', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'C');

      expect(graph.getOutDegree('A')).toBe(2);
      expect(graph.getOutDegree('B')).toBe(0);
    });

    it('should throw error for non-existent vertex', () => {
      expect(() => graph.getOutDegree('Z')).toThrow();
    });
  });

  describe('getInDegree', () => {
    it('should return number of incoming edges', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'C');
      graph.addEdge('B', 'C');

      expect(graph.getInDegree('C')).toBe(2);
      expect(graph.getInDegree('A')).toBe(0);
    });

    it('should throw error for non-existent vertex', () => {
      expect(() => graph.getInDegree('Z')).toThrow();
    });
  });
});
