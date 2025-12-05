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

  // =========================================================================
  // DEGREE METHODS TESTS
  // =========================================================================

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

  // =========================================================================
  // TRAVERSAL TESTS
  // =========================================================================

  describe('getBFSOrder', () => {
    it('should return vertices in BFS order', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'C');
      graph.addEdge('B', 'D');

      const order = graph.getBFSOrder('A');

      expect(order).toEqual(['A', 'B', 'C', 'D']);
    });

    it('should handle disconnected vertices', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');

      const order = graph.getBFSOrder('A');
      expect(order).toEqual(['A', 'B']);
      expect(order).not.toContain('C');
    });

    it('should throw error for non-existent start vertex', () => {
      expect(() => graph.getBFSOrder('Z')).toThrow(
        'Start vertex "Z" not found for BFS',
      );
    });

    it('should handle single vertex', () => {
      graph.addVertex('A');
      expect(graph.getBFSOrder('A')).toEqual(['A']);
    });

    it('should handle graph with cycle', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('C', 'A');

      const order = graph.getBFSOrder('A');
      expect(order).toHaveLength(3);
      expect(order[0]).toBe('A');
    });
  });

  describe('getDFSOrder', () => {
    it('should return vertices in DFS order', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'C');
      graph.addEdge('B', 'D');

      const order = graph.getDFSOrder('A');
      expect(order).toHaveLength(4);
      expect(order[0]).toBe('A');
      expect(order).toContain('B');
      expect(order).toContain('C');
      expect(order).toContain('D');
    });

    it('should handle disconnected vertices', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');

      const order = graph.getDFSOrder('A');
      expect(order).toEqual(['A', 'B']);
      expect(order).not.toContain('C');
    });

    it('should throw error for non-existent start vertex', () => {
      expect(() => graph.getDFSOrder('Z')).toThrow(
        'Start vertex "Z" not found for DFS',
      );
    });

    it('should handle single vertex', () => {
      graph.addVertex('A');
      expect(graph.getDFSOrder('A')).toEqual(['A']);
    });

    it('should handle graph with cycle', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('C', 'A');

      const order = graph.getDFSOrder('A');

      expect(order).toHaveLength(3);
      expect(order[0]).toBe('A');
    });
  });

  describe('traverseBFS', () => {
    it('should call callback for each vertex in BFS order', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'C');

      const visited: string[] = [];

      graph.traverseBFS('A', (vertex) => visited.push(vertex));

      expect(visited).toEqual(['A', 'B', 'C']);
    });

    it('should throw error for non-existent start vertex', () => {
      expect(() => graph.traverseBFS('Z', () => {})).toThrow(
        'Start vertex "Z" not found for BFS',
      );
    });

    it('should not modify the graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');

      const initialCount = graph.vertexCount;

      graph.traverseBFS('A', () => {});

      expect(graph.vertexCount).toBe(initialCount);
    });
  });

  describe('traverseDFS', () => {
    it('should call callback for each vertex in DFS order', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'C');

      const visited: string[] = [];
      graph.traverseDFS('A', (vertex) => visited.push(vertex));

      expect(visited).toHaveLength(3);
      expect(visited[0]).toBe('A');
    });

    it('should throw error for non-existent start vertex', () => {
      expect(() => graph.traverseDFS('Z', () => {})).toThrow(
        'Start vertex "Z" not found for DFS',
      );
    });

    it('should not modify the graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');

      const initialCount = graph.vertexCount;

      graph.traverseDFS('A', () => {});

      expect(graph.vertexCount).toBe(initialCount);
    });
  });

  // =========================================================================
  // CYCLE DETECTION TESTS
  // =========================================================================

  describe('hasCycle', () => {
    it('should return false for acyclic graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');

      expect(graph.hasCycle()).toBe(false);
    });

    it('should detect simple cycle', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('C', 'A'); // Creates cycle

      expect(graph.hasCycle()).toBe(true);
    });

    it('should detect self-loop', () => {
      graph.addVertex('A');
      graph.addEdge('A', 'A');

      expect(graph.hasCycle()).toBe(true);
    });

    it('should return false for disconnected acyclic graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B');
      graph.addEdge('C', 'D');

      expect(graph.hasCycle()).toBe(false);
    });

    it('should detect cycle in disconnected graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B');
      graph.addEdge('C', 'D');
      graph.addEdge('D', 'C'); // Cycle in second component

      expect(graph.hasCycle()).toBe(true);
    });
  });

  // =========================================================================
  // TOPOLOGICAL SORT TESTS
  // =========================================================================

  describe("topologicalSort (Kahn's algorithm)", () => {
    it('should return valid topological ordering for DAG', () => {
      // Create DAG: A -> B -> D, A -> C -> D
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'C');
      graph.addEdge('B', 'D');
      graph.addEdge('C', 'D');

      const order = graph.topologicalSort();
      expect(order).toBeDefined();
      expect(order).toHaveLength(4);

      // Verify A comes before B and C
      expect(order!.indexOf('A')).toBeLessThan(order!.indexOf('B'));
      expect(order!.indexOf('A')).toBeLessThan(order!.indexOf('C'));
      // Verify B and C come before D
      expect(order!.indexOf('B')).toBeLessThan(order!.indexOf('D'));
      expect(order!.indexOf('C')).toBeLessThan(order!.indexOf('D'));
    });

    it('should return undefined for graph with cycle', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('C', 'A');

      expect(graph.topologicalSort()).toBeUndefined();
    });

    it('should handle single vertex', () => {
      graph.addVertex('A');
      expect(graph.topologicalSort()).toEqual(['A']);
    });

    it('should handle disconnected components', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B');
      graph.addEdge('C', 'D');

      const order = graph.topologicalSort();
      expect(order).toBeDefined();
      expect(order).toHaveLength(4);
      expect(order!.indexOf('A')).toBeLessThan(order!.indexOf('B'));
      expect(order!.indexOf('C')).toBeLessThan(order!.indexOf('D'));
    });
  });

  describe('topologicalSortDFS', () => {
    it('should return valid topological ordering for DAG', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'C');
      graph.addEdge('B', 'D');
      graph.addEdge('C', 'D');

      const order = graph.topologicalSortDFS();
      expect(order).toBeDefined();
      expect(order).toHaveLength(4);

      expect(order!.indexOf('A')).toBeLessThan(order!.indexOf('B'));
      expect(order!.indexOf('A')).toBeLessThan(order!.indexOf('C'));
      expect(order!.indexOf('B')).toBeLessThan(order!.indexOf('D'));
      expect(order!.indexOf('C')).toBeLessThan(order!.indexOf('D'));
    });

    it('should return undefined for graph with cycle', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'A');

      expect(graph.topologicalSortDFS()).toBeUndefined();
    });
  });

  // =========================================================================
  // STRONGLY CONNECTED COMPONENTS TESTS
  // =========================================================================

  describe('getStronglyConnectedComponents', () => {
    it('should find SCCs in simple graph', () => {
      // Graph: A <-> B, C -> A
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'A');
      graph.addEdge('C', 'A');

      const sccs = graph.getStronglyConnectedComponents();
      expect(sccs).toHaveLength(2);

      // Find the component containing A and B
      const abComponent = sccs.find((scc) => scc.includes('A'));
      expect(abComponent).toContain('A');
      expect(abComponent).toContain('B');

      // C should be in its own component
      const cComponent = sccs.find((scc) => scc.includes('C'));
      expect(cComponent).toEqual(['C']);
    });

    it('should handle graph where all vertices are in one SCC', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('C', 'A');

      const sccs = graph.getStronglyConnectedComponents();
      expect(sccs).toHaveLength(1);
      expect(sccs[0]).toHaveLength(3);
    });

    it('should handle graph where each vertex is its own SCC', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');

      const sccs = graph.getStronglyConnectedComponents();
      expect(sccs).toHaveLength(3);
      sccs.forEach((scc) => expect(scc).toHaveLength(1));
    });
  });

  // =========================================================================
  // GRAPH TRANSFORMATIONS TESTS
  // =========================================================================

  describe('transpose', () => {
    it('should reverse all edges', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B', 5);
      graph.addEdge('B', 'C', 10);

      const transposed = graph.transpose();

      expect(transposed.hasEdge('B', 'A')).toBe(true);
      expect(transposed.hasEdge('C', 'B')).toBe(true);
      expect(transposed.hasEdge('A', 'B')).toBe(false);
      expect(transposed.hasEdge('B', 'C')).toBe(false);

      expect(transposed.getEdgeWeight('B', 'A')).toBe(5);
      expect(transposed.getEdgeWeight('C', 'B')).toBe(10);
    });

    it('should preserve vertex count', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');

      const transposed = graph.transpose();
      expect(transposed.vertexCount).toBe(graph.vertexCount);
    });
  });

  // =========================================================================
  // PATH FINDING TESTS
  // =========================================================================

  describe('hasPath', () => {
    it('should return true when path exists', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');

      expect(graph.hasPath('A', 'C')).toBe(true);
    });

    it('should return false when no path exists', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('C', 'A');

      expect(graph.hasPath('A', 'C')).toBe(false);
    });

    it('should return true for same vertex', () => {
      graph.addVertex('A');
      expect(graph.hasPath('A', 'A')).toBe(true);
    });

    it('should return false for non-existent vertices', () => {
      graph.addVertex('A');
      expect(graph.hasPath('A', 'Z')).toBe(false);
      expect(graph.hasPath('Z', 'A')).toBe(false);
    });
  });

  describe('findShortestPath', () => {
    it('should find shortest path', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'C');
      graph.addEdge('B', 'D');
      graph.addEdge('C', 'D');

      const path = graph.findShortestPath('A', 'D');
      expect(path).toBeDefined();
      expect(path).toHaveLength(3);
      expect(path![0]).toBe('A');
      expect(path![2]).toBe('D');
    });

    it('should return undefined when no path exists', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      expect(graph.findShortestPath('A', 'B')).toBeUndefined();
    });

    it('should return single vertex path for same source and target', () => {
      graph.addVertex('A');
      expect(graph.findShortestPath('A', 'A')).toEqual(['A']);
    });

    it('should return undefined for non-existent vertices', () => {
      graph.addVertex('A');
      expect(graph.findShortestPath('A', 'Z')).toBeUndefined();
    });
  });

  // =========================================================================
  // WEIGHTED SHORTEST PATH TESTS
  // =========================================================================

  describe('findShortestPathWeighted (Dijkstra)', () => {
    it('should find shortest weighted path', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B', 4);
      graph.addEdge('A', 'C', 2);
      graph.addEdge('C', 'B', 1);
      graph.addEdge('B', 'D', 5);
      graph.addEdge('C', 'D', 8);

      const result = graph.findShortestPathWeighted('A', 'D');

      expect(result).toBeDefined();
      expect(result!.path).toEqual(['A', 'C', 'B', 'D']);
      expect(result!.distance).toBe(8); // 2 + 1 + 5
    });

    it('should handle edges without weights (default to 1)', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');

      const result = graph.findShortestPathWeighted('A', 'C');

      expect(result).toBeDefined();
      expect(result!.distance).toBe(2);
    });

    it('should return path with distance 0 for same vertex', () => {
      graph.addVertex('A');

      const result = graph.findShortestPathWeighted('A', 'A');

      expect(result).toEqual({ path: ['A'], distance: 0 });
    });

    it('should return undefined when no path exists', () => {
      graph.addVertex('A');
      graph.addVertex('B');

      expect(graph.findShortestPathWeighted('A', 'B')).toBeUndefined();
    });

    it('should return undefined for non-existent vertices', () => {
      graph.addVertex('A');

      expect(graph.findShortestPathWeighted('A', 'Z')).toBeUndefined();
      expect(graph.findShortestPathWeighted('Z', 'A')).toBeUndefined();
    });

    it('should handle complex weighted graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addVertex('E');
      graph.addEdge('A', 'B', 10);
      graph.addEdge('A', 'C', 3);
      graph.addEdge('B', 'D', 2);
      graph.addEdge('C', 'B', 4);
      graph.addEdge('C', 'D', 8);
      graph.addEdge('D', 'E', 7);
      graph.addEdge('B', 'E', 1);

      const result = graph.findShortestPathWeighted('A', 'E');

      expect(result).toBeDefined();
      expect(result!.path).toEqual(['A', 'C', 'B', 'E']);
      expect(result!.distance).toBe(8); // 3 + 4 + 1
    });
  });

  // =========================================================================
  // UTILITY METHODS TESTS
  // =========================================================================

  describe('isDAG', () => {
    it('should return true for DAG', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');
      expect(graph.isDAG()).toBe(true);
    });

    it('should return false for cyclic graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'A');
      expect(graph.isDAG()).toBe(false);
    });
  });

  describe('getSources', () => {
    it('should return vertices with no incoming edges', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'C');

      const sources = graph.getSources();
      expect(sources).toEqual(['A']);
    });

    it('should return all vertices if no edges exist', () => {
      graph.addVertex('A');
      graph.addVertex('B');

      const sources = graph.getSources();
      expect(sources).toHaveLength(2);
    });
  });

  describe('getSinks', () => {
    it('should return vertices with no outgoing edges', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'C');

      const sinks = graph.getSinks();
      expect(sinks).toHaveLength(2);
      expect(sinks).toContain('B');
      expect(sinks).toContain('C');
    });
  });

  describe('clear', () => {
    it('should remove all vertices and edges', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');

      graph.clear();

      expect(graph.vertexCount).toBe(0);
      expect(graph.edgeCount).toBe(0);
      expect(graph.getAllVertices()).toEqual([]);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B', 10);

      const str = graph.toString();
      expect(str).toContain('DirectedGraph:');
      expect(str).toContain('A -> [B(10)]');
    });
  });

  // =========================================================================
  // COMPLEX INTEGRATION TESTS
  // =========================================================================

  describe('Complex scenarios', () => {
    it('should handle course prerequisite scenario', () => {
      // Courses with prerequisites
      graph.addVertex('Intro CS');
      graph.addVertex('Data Structures');
      graph.addVertex('Algorithms');
      graph.addVertex('AI');

      graph.addEdge('Intro CS', 'Data Structures');
      graph.addEdge('Data Structures', 'Algorithms');
      graph.addEdge('Algorithms', 'AI');

      const order = graph.topologicalSort();
      expect(order).toBeDefined();
      expect(order![0]).toBe('Intro CS');
      expect(order![order!.length - 1]).toBe('AI');
    });

    it('should detect impossible course schedule (cycle)', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'A'); // Circular prerequisite!

      expect(graph.topologicalSort()).toBeUndefined();
      expect(graph.isDAG()).toBe(false);
    });

    it('should handle web page link scenario', () => {
      graph.addVertex('Home');
      graph.addVertex('About');
      graph.addVertex('Contact');
      graph.addVertex('Blog');

      graph.addEdge('Home', 'About');
      graph.addEdge('Home', 'Blog');
      graph.addEdge('Blog', 'Contact');

      expect(graph.hasPath('Home', 'Contact')).toBe(true);
      expect(graph.hasPath('Contact', 'Home')).toBe(false);

      const path = graph.findShortestPath('Home', 'Contact');
      expect(path).toEqual(['Home', 'Blog', 'Contact']);
    });
  });
});
