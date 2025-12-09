import { describe, it, expect, beforeEach } from 'vitest';
import UndirectedGraph from './UndirectedGraph';

describe('UndirectedGraph', () => {
  let graph: UndirectedGraph<string>;

  beforeEach(() => {
    graph = new UndirectedGraph<string>();
  });

  describe('Constructor and Basic Properties', () => {
    it('should create an empty graph', () => {
      expect(graph.vertexCount).toBe(0);
      expect(graph.edgeCount).toBe(0);
      expect(graph.getAllVertices()).toEqual([]);
    });
  });

  describe('addVertex()', () => {
    it('should add a vertex to the graph', () => {
      graph.addVertex('A');
      expect(graph.vertexCount).toBe(1);
      expect(graph.hasVertex('A')).toBe(true);
    });

    it('should not add duplicate vertices', () => {
      graph.addVertex('A');
      graph.addVertex('A');

      expect(graph.vertexCount).toBe(1);
    });

    it('should add multiple vertices', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');

      expect(graph.vertexCount).toBe(3);
      expect(graph.getAllVertices()).toEqual(
        expect.arrayContaining(['A', 'B', 'C']),
      );
    });
  });

  describe('addEdge()', () => {
    beforeEach(() => {
      graph.addVertex('A');
      graph.addVertex('B');
    });

    it('should add an edge between two vertices', () => {
      graph.addEdge('A', 'B');

      expect(graph.hasEdge('A', 'B')).toBe(true);
      expect(graph.hasEdge('B', 'A')).toBe(true);
      expect(graph.edgeCount).toBe(1);
    });

    it('should add an edge with weight', () => {
      graph.addEdge('A', 'B', 5);

      expect(graph.getEdgeWeight('A', 'B')).toBe(5);
      expect(graph.getEdgeWeight('B', 'A')).toBe(5);
    });

    it('should update edge weight if edge exists', () => {
      graph.addEdge('A', 'B', 5);
      graph.addEdge('A', 'B', 10);

      expect(graph.getEdgeWeight('A', 'B')).toBe(10);
      expect(graph.edgeCount).toBe(1);
    });

    it('should throw error if vertex1 does not exist', () => {
      expect(() => graph.addEdge('C', 'A')).toThrow(
        'Vertex "C" does not exist',
      );
    });

    it('should throw error if vertex2 does not exist', () => {
      expect(() => graph.addEdge('A', 'C')).toThrow(
        'Vertex "C" does not exist',
      );
    });

    it('should allow self-loops', () => {
      graph.addEdge('A', 'A');

      expect(graph.hasEdge('A', 'A')).toBe(true);
    });
  });

  describe('removeVertex()', () => {
    beforeEach(() => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
    });

    it('should remove a vertex and its edges', () => {
      expect(graph.removeVertex('B')).toBe(true);
      expect(graph.hasVertex('B')).toBe(false);
      expect(graph.vertexCount).toBe(2);
      expect(graph.hasEdge('A', 'B')).toBe(false);
      expect(graph.hasEdge('B', 'C')).toBe(false);
    });

    it('should return false when removing non-existent vertex', () => {
      expect(graph.removeVertex('D')).toBe(false);
    });

    it('should update edge count after removing vertex', () => {
      expect(graph.edgeCount).toBe(2);
      graph.removeVertex('B');
      expect(graph.edgeCount).toBe(0);
    });
  });

  describe('removeEdge()', () => {
    beforeEach(() => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
    });

    it('should remove an edge between two vertices', () => {
      expect(graph.removeEdge('A', 'B')).toBe(true);
      expect(graph.hasEdge('A', 'B')).toBe(false);
      expect(graph.hasEdge('B', 'A')).toBe(false);
      expect(graph.edgeCount).toBe(1);
    });

    it('should return false for non-existent edge', () => {
      expect(graph.removeEdge('A', 'C')).toBe(false);
    });

    it('should return false if vertex does not exist', () => {
      expect(graph.removeEdge('A', 'D')).toBe(false);
    });
  });

  describe('hasVertex() and hasEdge()', () => {
    beforeEach(() => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');
    });

    it('should correctly identify existing vertices', () => {
      expect(graph.hasVertex('A')).toBe(true);
      expect(graph.hasVertex('B')).toBe(true);
    });

    it('should correctly identify non-existing vertices', () => {
      expect(graph.hasVertex('C')).toBe(false);
    });

    it('should correctly identify existing edges', () => {
      expect(graph.hasEdge('A', 'B')).toBe(true);
      expect(graph.hasEdge('B', 'A')).toBe(true);
    });

    it('should correctly identify non-existing edges', () => {
      expect(graph.hasEdge('A', 'C')).toBe(false);
    });
  });

  describe('getNeighbors()', () => {
    beforeEach(() => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B', 5);
      graph.addEdge('A', 'C', 10);
    });

    it('should return neighbors of a vertex', () => {
      const neighbors = graph.getNeighbors('A');

      expect(neighbors).toHaveLength(2);
      expect(neighbors).toEqual(
        expect.arrayContaining([
          { target: 'B', weight: 5 },
          { target: 'C', weight: 10 },
        ]),
      );
    });

    it('should return empty array for isolated vertex', () => {
      graph.addVertex('D');

      expect(graph.getNeighbors('D')).toEqual([]);
    });

    it('should throw error for non-existent vertex', () => {
      expect(() => graph.getNeighbors('D')).toThrow(
        'Vertex "D" does not exist',
      );
    });
  });

  describe('getDegree()', () => {
    beforeEach(() => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'C');
    });

    it('should return correct degree for vertex', () => {
      expect(graph.getDegree('A')).toBe(2);
      expect(graph.getDegree('B')).toBe(1);
      expect(graph.getDegree('C')).toBe(1);
    });

    it('should return 0 for isolated vertex', () => {
      graph.addVertex('D');

      expect(graph.getDegree('D')).toBe(0);
    });

    it('should throw error for non-existent vertex', () => {
      expect(() => graph.getDegree('D')).toThrow('Vertex "D" does not exist');
    });
  });

  describe('getAllEdges()', () => {
    beforeEach(() => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B', 5);
      graph.addEdge('B', 'C', 10);
    });

    it('should return all edges once', () => {
      const edges = graph.getAllEdges();

      expect(edges).toHaveLength(2);
    });

    it('should include edge weights', () => {
      const edges = graph.getAllEdges();

      expect(edges).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ weight: 5 }),
          expect.objectContaining({ weight: 10 }),
        ]),
      );
    });
  });

  describe('getDensity()', () => {
    it('should return 0 for empty graph', () => {
      expect(graph.getDensity()).toBe(0);
    });

    it('should return 0 for single vertex', () => {
      graph.addVertex('A');

      expect(graph.getDensity()).toBe(0);
    });

    it('should calculate density correctly', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      // 1 edge out of 3 possible = 1/3 ≈ 0.333
      expect(graph.getDensity()).toBeCloseTo(0.333, 2);
    });

    it('should return 1 for complete graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('A', 'C');

      expect(graph.getDensity()).toBe(1);
    });
  });

  describe('clear()', () => {
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

  describe('BFS Traversal', () => {
    beforeEach(() => {
      // Create a simple graph: A-B-C
      //                         |
      //                         D
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('B', 'D');
    });

    it('should return vertices in BFS order', () => {
      const order = graph.getBFSOrder('A');

      expect(order[0]).toBe('A');
      expect(order[1]).toBe('B');
      expect(order).toHaveLength(4);
    });

    it('should throw error for non-existent start vertex', () => {
      expect(() => graph.getBFSOrder('E')).toThrow(
        'Start vertex "E" not found',
      );
    });

    it('should call callback for each vertex in BFS order', () => {
      const visited: string[] = [];
      graph.traverseBFS('A', (v) => visited.push(v));

      expect(visited).toHaveLength(4);
      expect(visited[0]).toBe('A');
    });
  });

  describe('DFS Traversal', () => {
    beforeEach(() => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('B', 'D');
    });

    it('should return vertices in DFS order', () => {
      const order = graph.getDFSOrder('A');

      expect(order[0]).toBe('A');
      expect(order).toHaveLength(4);
    });

    it('should throw error for non-existent start vertex', () => {
      expect(() => graph.getDFSOrder('E')).toThrow(
        'Start vertex "E" not found',
      );
    });

    it('should call callback for each vertex in DFS order', () => {
      const visited: string[] = [];
      graph.traverseDFS('A', (v) => visited.push(v));

      expect(visited).toHaveLength(4);
      expect(visited[0]).toBe('A');
    });
  });

  describe('hasCycle()', () => {
    it('should return false for acyclic graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');

      expect(graph.hasCycle()).toBe(false);
    });

    it('should return true for cyclic graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('C', 'A');

      expect(graph.hasCycle()).toBe(true);
    });

    it('should return false for empty graph', () => {
      expect(graph.hasCycle()).toBe(false);
    });

    it('should return false for single vertex', () => {
      graph.addVertex('A');

      expect(graph.hasCycle()).toBe(false);
    });
  });

  describe('hasPath()', () => {
    beforeEach(() => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
    });

    it('should return true for connected vertices', () => {
      expect(graph.hasPath('A', 'C')).toBe(true);
    });

    it('should return false for disconnected vertices', () => {
      expect(graph.hasPath('A', 'D')).toBe(false);
    });

    it('should return true when from equals to', () => {
      expect(graph.hasPath('A', 'A')).toBe(true);
    });

    it('should return false if vertex does not exist', () => {
      expect(graph.hasPath('A', 'E')).toBe(false);
      expect(graph.hasPath('E', 'A')).toBe(false);
    });
  });

  describe('findShortestPath()', () => {
    beforeEach(() => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('A', 'D');
      graph.addEdge('D', 'C');
    });

    it('should find shortest path between connected vertices', () => {
      const path = graph.findShortestPath('A', 'C');

      expect(path).toBeDefined();
      expect(path![0]).toBe('A');
      expect(path![path!.length - 1]).toBe('C');
      expect(path!.length).toBe(3); // A-D-C or A-B-C
    });

    it('should return undefined for disconnected vertices', () => {
      graph.addVertex('E');

      expect(graph.findShortestPath('A', 'E')).toBeUndefined();
    });

    it('should return single vertex path when from equals to', () => {
      expect(graph.findShortestPath('A', 'A')).toEqual(['A']);
    });

    it('should return undefined if vertex does not exist', () => {
      expect(graph.findShortestPath('A', 'Z')).toBeUndefined();
    });
  });

  describe('findShortestPathWeighted()', () => {
    beforeEach(() => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B', 1);
      graph.addEdge('B', 'C', 1);
      graph.addEdge('A', 'D', 5);
      graph.addEdge('D', 'C', 1);
    });

    it('should find shortest weighted path', () => {
      const result = graph.findShortestPathWeighted('A', 'C');

      expect(result).toBeDefined();
      expect(result!.path[0]).toBe('A');
      expect(result!.path[result!.path.length - 1]).toBe('C');
      expect(result!.distance).toBe(2); // A-B-C = 2
    });

    it('should return correct distance', () => {
      const result = graph.findShortestPathWeighted('A', 'D');
      // Shortest path is A->B->C->D = 1+1+1 = 3, not direct A->D = 5
      expect(result!.distance).toBe(3);
    });

    it('should return distance 0 when from equals to', () => {
      const result = graph.findShortestPathWeighted('A', 'A');

      expect(result).toEqual({ path: ['A'], distance: 0 });
    });

    it('should return undefined for disconnected vertices', () => {
      graph.addVertex('E');

      expect(graph.findShortestPathWeighted('A', 'E')).toBeUndefined();
    });
  });

  describe('getConnectedComponents()', () => {
    it('should return single component for connected graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');

      const components = graph.getConnectedComponents();

      expect(components).toHaveLength(1);
      expect(components[0]).toHaveLength(3);
    });

    it('should return multiple components for disconnected graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B');
      graph.addEdge('C', 'D');

      const components = graph.getConnectedComponents();

      expect(components).toHaveLength(2);
    });

    it('should return empty array for empty graph', () => {
      expect(graph.getConnectedComponents()).toEqual([]);
    });
  });

  describe('isConnected()', () => {
    it('should return true for connected graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');

      expect(graph.isConnected()).toBe(true);
    });

    it('should return false for disconnected graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');

      expect(graph.isConnected()).toBe(false);
    });

    it('should return true for empty graph', () => {
      expect(graph.isConnected()).toBe(true);
    });
  });

  describe("findMinimumSpanningTree() - Prim's", () => {
    beforeEach(() => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B', 1);
      graph.addEdge('B', 'C', 2);
      graph.addEdge('C', 'D', 3);
      graph.addEdge('D', 'A', 4);
      graph.addEdge('A', 'C', 5);
    });

    it('should find MST for connected graph', () => {
      const result = graph.findMinimumSpanningTree();

      expect(result).toBeDefined();
      expect(result!.edges).toHaveLength(3); // V-1 edges
      expect(result!.totalWeight).toBe(6); // 1+2+3
    });

    it('should return undefined for disconnected graph', () => {
      graph.addVertex('E');

      expect(graph.findMinimumSpanningTree()).toBeUndefined();
    });

    it('should handle empty graph', () => {
      const emptyGraph = new UndirectedGraph<string>();
      const result = emptyGraph.findMinimumSpanningTree();

      expect(result).toEqual({ edges: [], totalWeight: 0 });
    });

    it('should throw error for invalid start vertex', () => {
      expect(() => graph.findMinimumSpanningTree('Z')).toThrow(
        'Start vertex "Z" does not exist',
      );
    });
  });

  describe('findMinimumSpanningTreeKruskal()', () => {
    beforeEach(() => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B', 1);
      graph.addEdge('B', 'C', 2);
      graph.addEdge('C', 'D', 3);
      graph.addEdge('D', 'A', 4);
      graph.addEdge('A', 'C', 5);
    });

    it('should find MST using Kruskal algorithm', () => {
      const result = graph.findMinimumSpanningTreeKruskal();

      expect(result).toBeDefined();
      expect(result!.edges).toHaveLength(3);
      expect(result!.totalWeight).toBe(6); // 1+2+3
    });

    it('should return undefined for disconnected graph', () => {
      graph.addVertex('E');

      expect(graph.findMinimumSpanningTreeKruskal()).toBeUndefined();
    });

    it('should handle empty graph', () => {
      const emptyGraph = new UndirectedGraph<string>();
      const result = emptyGraph.findMinimumSpanningTreeKruskal();

      expect(result).toEqual({ edges: [], totalWeight: 0 });
    });

    it("should produce same total weight as Prim's algorithm", () => {
      const primResult = graph.findMinimumSpanningTree();
      const kruskalResult = graph.findMinimumSpanningTreeKruskal();

      expect(kruskalResult!.totalWeight).toBe(primResult!.totalWeight);
    });
  });

  describe('isBipartite()', () => {
    it('should return sets for bipartite graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('C', 'D');

      const result = graph.isBipartite();

      expect(result).toBeDefined();
      expect(result!.setA.length + result!.setB.length).toBe(4);
    });

    it('should return undefined for non-bipartite graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('C', 'A'); // Creates odd cycle

      expect(graph.isBipartite()).toBeUndefined();
    });

    it('should handle empty graph', () => {
      const result = graph.isBipartite();

      expect(result).toEqual({ setA: [], setB: [] });
    });

    it('should handle disconnected bipartite components', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addVertex('D');
      graph.addEdge('A', 'B');
      graph.addEdge('C', 'D');

      const result = graph.isBipartite();

      expect(result).toBeDefined();
    });
  });

  describe('isTree()', () => {
    it('should return true for valid tree', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');

      expect(graph.isTree()).toBe(true);
    });

    it('should return false for graph with cycle', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('C', 'A');

      expect(graph.isTree()).toBe(false);
    });

    it('should return false for disconnected graph', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');

      expect(graph.isTree()).toBe(false);
    });

    it('should return false for empty graph', () => {
      expect(graph.isTree()).toBe(false);
    });

    it('should return false for graph with too many edges', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('A', 'C');
      graph.addEdge('A', 'A'); // Extra edge

      expect(graph.isTree()).toBe(false);
    });
  });

  describe('clone()', () => {
    beforeEach(() => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');
      graph.addEdge('A', 'B', 5);
      graph.addEdge('B', 'C', 10);
    });

    it('should create a deep copy of the graph', () => {
      const cloned = graph.clone();

      expect(cloned.vertexCount).toBe(graph.vertexCount);
      expect(cloned.edgeCount).toBe(graph.edgeCount);
    });

    it('should not affect original when modifying clone', () => {
      const cloned = graph.clone();
      cloned.addVertex('D');
      cloned.addEdge('A', 'D');

      expect(graph.hasVertex('D')).toBe(false);
      expect(graph.hasEdge('A', 'D')).toBe(false);
    });

    it('should preserve edge weights', () => {
      const cloned = graph.clone();

      expect(cloned.getEdgeWeight('A', 'B')).toBe(5);
      expect(cloned.getEdgeWeight('B', 'C')).toBe(10);
    });
  });

  describe('toString()', () => {
    it('should return string representation', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B', 5);

      const str = graph.toString();

      expect(str).toContain('UndirectedGraph');
      expect(str).toContain('A');
      expect(str).toContain('B');
    });
  });

  describe('Iterator', () => {
    beforeEach(() => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');
    });

    it('should allow iteration with for...of', () => {
      const vertices: string[] = [];
      for (const [vertex] of graph) {
        vertices.push(vertex);
      }

      expect(vertices).toHaveLength(2);
      expect(vertices).toContain('A');
      expect(vertices).toContain('B');
    });
  });

  describe('Edge Cases and Stress Tests', () => {
    it('should handle large graph efficiently', () => {
      const largeGraph = new UndirectedGraph<number>();
      const n = 100;

      for (let i = 0; i < n; i++) {
        largeGraph.addVertex(i);
      }

      for (let i = 0; i < n - 1; i++) {
        largeGraph.addEdge(i, i + 1, i);
      }

      expect(largeGraph.vertexCount).toBe(n);
      expect(largeGraph.edgeCount).toBe(n - 1);
    });

    it('should handle complete graph', () => {
      const n = 10;
      for (let i = 0; i < n; i++) {
        graph.addVertex(String(i));
      }

      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          graph.addEdge(String(i), String(j));
        }
      }

      expect(graph.edgeCount).toBe((n * (n - 1)) / 2);
      expect(graph.getDensity()).toBe(1);
    });

    it('should handle graph with only vertices', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addVertex('C');

      expect(graph.vertexCount).toBe(3);
      expect(graph.edgeCount).toBe(0);
      expect(graph.isConnected()).toBe(false);
    });
  });
});
