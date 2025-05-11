import { beforeEach, describe, expect, it } from 'vitest';
import DirectedGraph from '../src/data-structures/graph/DirectedGraph';

describe('DirectedGraph', () => {
  let graph: DirectedGraph<string>;

  beforeEach(() => {
    graph = new DirectedGraph();
  });

  it('should create an empty graph', () => {
    expect(graph.getAllVertices()).toEqual([]);
  });

  it('addVertex should add a vertex to the graph', () => {
    graph.addVertex('A');
    graph.addVertex('B');

    expect(graph.hasVertex('A')).toBe(true);
    expect(graph.hasVertex('B')).toBe(true);
    expect(graph.getAllVertices()).toEqual(['A', 'B']);
  });

  it('addVertex should not add duplicate vertices', () => {
    graph.addVertex('A');
    graph.addVertex('A');

    expect(graph.getAllVertices().length).toBe(1);
  });

  it('addEdge should automatically add vertices when adding an edge', () => {
    graph.addEdge('A', 'B');

    expect(graph.hasVertex('A')).toBe(true);
    expect(graph.hasVertex('B')).toBe(true);
  });

  it('addEdge should not add duplicate edges', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'B');

    expect(graph.getNeighbors('A')).toEqual(['B']);
  });

  it('addEdge should add directed edges with optional weights', () => {
    graph.addVertex('A');
    graph.addVertex('B');

    graph.addEdge('A', 'B');

    expect(graph.hasEdge('A', 'B')).toBe(true);
    expect(graph.getWeight('A', 'B')).toBeUndefined();

    graph.addEdge('B', 'C', 5);
    expect(graph.hasEdge('B', 'C')).toBe(true);
    expect(graph.getWeight('B', 'C')).toBe(5);
  });

  it('removeVertex should remove a vertex and its associated edges', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'A');

    graph.removeVertex('B');

    expect(graph.hasVertex('B')).toBe(false);
    expect(graph.hasEdge('A', 'B')).toBe(false); // Outgoing edge removed
    expect(graph.hasEdge('B', 'C')).toBe(false); // Incoming edge removed
    expect(graph.hasEdge('C', 'A')).toBe(true); // Other edges remain
  });

  it('removeVertex should do nothing if the vertex to remove does not exist', () => {
    graph.addVertex('A');
    const initialVertices = graph.getAllVertices().length;

    graph.removeVertex('B');

    expect(graph.getAllVertices().length).toBe(initialVertices);
  });

  it('removeEdge should remove an existing edge between two vertices', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addEdge('A', 'B');

    graph.removeEdge('A', 'B');

    expect(graph.hasEdge('A', 'B')).toBe(false);
  });

  it('removeEdge should do nothing if the starting vertex does not exist', () => {
    graph.addVertex('B');

    graph.removeEdge('A', 'B');

    expect(graph.hasEdge('A', 'B')).toBe(false);
  });

  it('removeEdge should do nothing if the ending vertex does not exist for the given starting vertex', () => {
    graph.addVertex('A');

    graph.removeEdge('A', 'B');

    expect(graph.hasEdge('A', 'B')).toBe(false);
  });

  it('getNeighbors should get neighbors of a vertex', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');

    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C', 2);

    expect(graph.getNeighbors('A')).toEqual(['B', 'C']);
    expect(graph.getNeighbors('B')).toEqual([]);
    expect(graph.getNeighbors('D')).toEqual([]); // Non-existent vertex
  });

  it('hasVertex should return true if the vertex exists, false otherwise', () => {
    graph.addVertex('A');

    expect(graph.hasVertex('A')).toBe(true);
    expect(graph.hasVertex('B')).toBe(false);
  });

  it('hasEdge should return true if the edge exists, false otherwise', () => {
    graph.addVertex('A');
    graph.addVertex('B');

    graph.addEdge('A', 'B');

    expect(graph.hasEdge('A', 'B')).toBe(true);
    expect(graph.hasEdge('B', 'A')).toBe(false); // Directed
    expect(graph.hasEdge('A', 'C')).toBe(false); // Non-existent destination
    expect(graph.hasEdge('C', 'A')).toBe(false); // Non-existent source
  });

  it('getNeighbors should return an empty array for a vertex with no neighbors', () => {
    graph.addVertex('A');

    expect(graph.getNeighbors('A')).toEqual([]);
  });

  it('getNeighbors should return an array of neighbors for an existing vertex', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');

    expect(graph.getNeighbors('A')).toEqual(['B', 'C']);
    expect(graph.getNeighbors('A').length).toBe(2);
  });

  it('getNeighbors should return an empty array for a non-existent vertex', () => {
    expect(graph.getNeighbors('A')).toEqual([]);
  });

  it('getWeight should return the weight of an existing edge', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addEdge('A', 'B', 10);

    expect(graph.getWeight('A', 'B')).toBe(10);
  });

  it('getWeight should return undefined for an unweighted edge', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addEdge('A', 'B');

    expect(graph.getWeight('A', 'B')).toBeUndefined();
  });

  it('getWeight should return undefined if the edge does not exist', () => {
    graph.addVertex('A');
    graph.addVertex('B');

    expect(graph.getWeight('A', 'B')).toBeUndefined();
  });

  it('getWeight should return undefined if the starting vertex does not exist', () => {
    graph.addVertex('B');
    graph.addEdge('C', 'B', 5);

    expect(graph.getWeight('D', 'B')).toBeUndefined();
  });

  it('getAllVertices should return an empty array for an empty graph', () => {
    expect(graph.getAllVertices()).toEqual([]);
  });

  it('getAllVertices should return an array of all vertices in the graph', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');

    expect(graph.getAllVertices()).toEqual(['A', 'B', 'C']);
  });

  it('bfs should return an empty array if the start vertex does not exist', () => {
    expect(graph.bfs('F')).toEqual([]);
  });

  it('bfs should perform Breadth-First Search correctly', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.addVertex('E');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    graph.addEdge('C', 'E');

    expect(graph.bfs('A')).toEqual(['A', 'B', 'C', 'D', 'E']);
  });

  it('bfs should handle disconnected components', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.addEdge('A', 'B');
    graph.addEdge('C', 'D');

    expect(graph.bfs('A')).toEqual(['A', 'B']);
    expect(graph.bfs('C')).toEqual(['C', 'D']);
  });

  it('bfs should execute the callback function for each visited vertex', () => {
    const visited: string[] = [];
    const callback = (vertex: string) => visited.push(vertex);

    graph.addVertex('A');
    graph.addVertex('B');
    graph.addEdge('A', 'B');
    graph.bfs('A', callback);

    expect(visited).toEqual(['A', 'B']);
  });

  it('dfs should perform Depth-First Search correctly', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.addVertex('E');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    graph.addEdge('C', 'E');

    expect(graph.dfs('A')).toEqual(['A', 'B', 'D', 'C', 'E']);
  });

  it('dfs should handle disconnected components', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');

    graph.addEdge('A', 'B');
    graph.addEdge('C', 'D');

    expect(graph.dfs('A')).toEqual(['A', 'B']);
    expect(graph.dfs('C')).toEqual(['C', 'D']);
  });

  it('dfs should return an empty array if the start vertex does not exist', () => {
    expect(graph.dfs('F')).toEqual([]);
  });

  it('dfs should execute the callback function for each visited vertex', () => {
    const visited: string[] = [];
    const callback = (vertex: string) => visited.push(vertex);

    graph.addVertex('A');
    graph.addVertex('B');
    graph.addEdge('A', 'B');
    graph.dfs('A', callback);

    expect(visited).toEqual(['A', 'B']); // One possible DFS order
  });

  it('hasCycle should return true if the graph has a cycle', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');

    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'A');

    expect(graph.hasCycle()).toBe(true);
  });

  it('hasCycle should return false if the graph has no cycle', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');

    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');

    expect(graph.hasCycle()).toBe(false);
  });

  it('hasCycle should return false for an empty graph', () => {
    expect(graph.hasCycle()).toBe(false);
  });

  it('hasCycle should handle self-loops as cycles', () => {
    graph.addVertex('A');
    graph.addEdge('A', 'A');

    expect(graph.hasCycle()).toBe(true);
  });

  it('topologicalSort should return a topologically sorted array for a DAG', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.addVertex('E');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    graph.addEdge('C', 'E');

    expect(graph.topologicalSort()).toEqual(['A', 'B', 'C', 'D', 'E']); // One possible sort
  });

  it('topologicalSort should return an empty array if the graph contains a cycle', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');

    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'A');

    expect(graph.topologicalSort()).toEqual([]);
  });

  it('topologicalSort should return an array of all vertices for a graph with no edges', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');

    expect(graph.topologicalSort()).toEqual(['A', 'B', 'C']);
  });

  it('topologicalSort should return an empty array for an empty graph', () => {
    expect(graph.topologicalSort()).toEqual([]);
  });

  it('dijkstra should return correct shortest distances and previous nodes for a simple graph', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addEdge('A', 'B', 4);
    graph.addEdge('A', 'C', 2);
    graph.addEdge('C', 'B', 1);

    const { distances, previous } = graph.dijkstra('A');

    expect(distances.get('A')).toBe(0);
    expect(distances.get('B')).toBe(3);
    expect(distances.get('C')).toBe(2);
    expect(previous.get('A')).toBeNull();
    expect(previous.get('B')).toBe('C');
    expect(previous.get('C')).toBe('A');
  });

  it('dijkstra should handle a graph with disconnected components', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.addEdge('A', 'B', 1);
    graph.addEdge('C', 'D', 1);

    const { distances } = graph.dijkstra('A');

    expect(distances.get('A')).toBe(0);
    expect(distances.get('B')).toBe(1);
    expect(distances.get('C')).toBe(Infinity);
    expect(distances.get('D')).toBe(Infinity);
  });

  it('dijkstra should handle a graph with multiple paths to the same node', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addEdge('A', 'B', 5);
    graph.addEdge('A', 'C', 2);
    graph.addEdge('C', 'B', 1);

    const { distances } = graph.dijkstra('A');

    expect(distances.get('B')).toBe(3); // A -> C -> B is shorter than A -> B
  });

  it('dijkstra should handle a graph with zero-weight edges', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addEdge('A', 'B', 0);
    graph.addEdge('B', 'C', 1);

    const { distances } = graph.dijkstra('A');

    expect(distances.get('A')).toBe(0);
    expect(distances.get('B')).toBe(0);
    expect(distances.get('C')).toBe(1);
  });

  it('dijkstra should throw an error if the start vertex is not in the graph', () => {
    expect(() => graph.dijkstra('X')).toThrowError(
      'Start vertex not found in the graph.',
    );
  });

  it('dijkstra should handle a graph with only one vertex', () => {
    graph.addVertex('A');

    const { distances, previous } = graph.dijkstra('A');

    expect(distances.get('A')).toBe(0);
    expect(previous.get('A')).toBeNull();
    expect(graph.getPath('A', 'A', previous)).toEqual(['A']);
  });

  it('dijkstra - getPath should return an empty path if start or end vertex does not exist in getPath', () => {
    graph.addVertex('A');
    graph.addVertex('B');

    const { previous } = graph.dijkstra('A');

    expect(graph.getPath('A', 'C', previous)).toEqual([]);
    expect(graph.getPath('C', 'B', previous)).toEqual([]);
  });

  it('dijkstra - getPath should return the correct shortest path for a given start and end vertex', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.addVertex('E');
    graph.addEdge('A', 'B', 4);
    graph.addEdge('A', 'C', 2);
    graph.addEdge('B', 'E', 3);
    graph.addEdge('C', 'B', 1);
    graph.addEdge('C', 'D', 5);
    graph.addEdge('D', 'E', 1);

    const { previous } = graph.dijkstra('A');

    expect(graph.getPath('A', 'E', previous)).toEqual(['A', 'C', 'B', 'E']);
  });

  it('bellmanFord should return correct shortest distances and previous nodes for a simple graph', () => {
    graph.addEdge('A', 'B', 4);
    graph.addEdge('A', 'C', 2);
    graph.addEdge('C', 'B', 1);

    const { distances, previous } = graph.bellmanFord('A');

    expect(distances?.get('A')).toBe(0);
    expect(distances?.get('B')).toBe(3);
    expect(distances?.get('C')).toBe(2);

    expect(previous.get('A')).toBeNull();
    expect(previous.get('B')).toBe('C');
    expect(previous.get('C')).toBe('A');
  });

  it('bellmanFord should return Infinity for unreachable vertices', () => {
    graph.addEdge('A', 'B', 5);
    graph.addVertex('C'); // Disconnected

    const { distances, previous } = graph.bellmanFord('A');

    expect(distances?.get('A')).toBe(0);
    expect(distances?.get('B')).toBe(5);
    expect(distances?.get('C')).toBe(Infinity);
    expect(previous?.get('C')).toBeNull();
  });

  it('bellmanFord should handle negative weights correctly without a negative cycle', () => {
    graph.addEdge('A', 'B', 4);
    graph.addEdge('A', 'C', 2);
    graph.addEdge('C', 'B', -2);

    const { distances, previous } = graph.bellmanFord('A');

    expect(distances?.get('A')).toBe(0);
    expect(distances?.get('B')).toBe(0); // 2 + (-2)
    expect(distances?.get('C')).toBe(2);

    expect(previous.get('B')).toBe('C');
    expect(previous.get('C')).toBe('A');
  });

  it('bellmanFord should detect a negative weight cycle and return null distances', () => {
    graph.addEdge('A', 'B', 1);
    graph.addEdge('B', 'C', -2);
    graph.addEdge('C', 'A', -1); // A → B → C → A has negative total weight

    const { distances, previous } = graph.bellmanFord('A');

    expect(distances).toBeNull();
    expect(previous).toEqual(new Map());
  });

  it('bellmanFord should throw an error if the start vertex is not in the graph', () => {
    expect(() => graph.dijkstra('X')).toThrowError(
      'Start vertex not found in the graph.',
    );
  });

  it('bellmanFord - getPath should return the correct shortest path for a given start and end vertex', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.addVertex('E');
    graph.addEdge('A', 'B', 4);
    graph.addEdge('A', 'C', 2);
    graph.addEdge('C', 'B', 1);
    graph.addEdge('C', 'D', 5);
    graph.addEdge('B', 'E', 3);
    graph.addEdge('D', 'E', 1);

    const { distances, previous } = graph.bellmanFord('A');

    expect(distances).not.toBeNull(); // guard check for TS
    if (distances) {
      expect(graph.getPath('A', 'E', previous)).toEqual(['A', 'C', 'B', 'E']);
    }
  });

  it('bellmanFord - getPath should return correct path in graph with negative weights (no negative cycle)', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.addEdge('A', 'B', 1);
    graph.addEdge('B', 'C', -2); // Negative weight
    graph.addEdge('C', 'D', 2);
    graph.addEdge('A', 'D', 10); // Direct path but more expensive

    const { distances, previous } = graph.bellmanFord('A');

    expect(distances).not.toBeNull(); // guard for TS
    if (distances) {
      // Cost: A → B (1) + B → C (-2) + C → D (2) = 1
      expect(distances.get('D')).toBe(1);
      expect(graph.getPath('A', 'D', previous)).toEqual(['A', 'B', 'C', 'D']);
    }
  });

  it('bellmanFord - handles multiple negative edges correctly', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.addVertex('E');

    // Create a graph with multiple negative edges
    graph.addEdge('A', 'B', 6);
    graph.addEdge('A', 'C', 5);
    graph.addEdge('A', 'D', 5);
    graph.addEdge('C', 'B', -2); // Negative edge
    graph.addEdge('D', 'C', -2); // Negative edge
    graph.addEdge('B', 'E', 1);

    const { distances, previous } = graph.bellmanFord('A');

    expect(distances).not.toBeNull();
    if (distances) {
      // Calculate shortest distances
      expect(distances.get('A')).toBe(0);
      expect(distances.get('B')).toBe(1); // A → D → C → B = 5 + (-2) + (-2)
      expect(distances.get('C')).toBe(3); // A → D → C = 5 + (-2)
      expect(distances.get('D')).toBe(5); // A → D = 5
      expect(distances.get('E')).toBe(2); // A → D → C → B → E = 5 + (-2) + (-2) + 1

      // Check correct paths
      expect(graph.getPath('A', 'E', previous)).toEqual([
        'A',
        'D',
        'C',
        'B',
        'E',
      ]);
    }
  });

  it('bellmanFord - handles disconnected nodes correctly', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.addVertex('E'); // Disconnected node
    graph.addVertex('F'); // Disconnected node

    // Some edges between nodes, but not involving E or F
    graph.addEdge('A', 'B', 6);
    graph.addEdge('A', 'C', 5);
    graph.addEdge('A', 'D', 5);
    graph.addEdge('B', 'C', -2);
    graph.addEdge('C', 'D', 3);

    const { distances, previous } = graph.bellmanFord('A');

    expect(distances).not.toBeNull();
    if (distances) {
      expect(distances.get('A')).toBe(0); // Distance to itself is 0
      expect(distances.get('B')).toBe(6); // A → B = 6
      expect(distances.get('C')).toBe(4); // A → C = 5 but path A → D → C = 3 so should be 4
      expect(distances.get('D')).toBe(5); // A → D = 5
      expect(distances.get('E')).toBe(Infinity); // Disconnected node
      expect(distances.get('F')).toBe(Infinity); // Disconnected node

      expect(graph.getPath('A', 'E', previous)).toEqual([]); // No path to E
      expect(graph.getPath('A', 'F', previous)).toEqual([]); // No path to F
    }
  });
});
