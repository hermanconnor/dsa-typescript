import { beforeEach, describe, expect, it } from 'vitest';
import UndirectedGraph from '../src/data-structures/graph/UndirectedGraph';

describe('UndirectedGraph', () => {
  let graph: UndirectedGraph<string>;

  beforeEach(() => {
    graph = new UndirectedGraph();
  });

  it('should create an empty graph', () => {
    expect(graph.getAllVertices()).toEqual([]);
  });

  it('addVertex should add a new vertex to the graph', () => {
    graph.addVertex('A');

    expect(graph.hasVertex('A')).toBe(true);
  });

  it('addVertex should not add a vertex if it already exists', () => {
    graph.addVertex('A');
    graph.addVertex('A');

    expect(graph.getAllVertices().length).toBe(1);
  });

  it('addEdge should add an undirected edge between two vertices', () => {
    graph.addVertex('A');
    graph.addVertex('B');

    graph.addEdge('A', 'B');

    expect(graph.hasEdge('A', 'B')).toBe(true);
    expect(graph.hasEdge('B', 'A')).toBe(true); // Check both directions for undirected
    expect(graph.getNeighbors('A')).toContain('B');
    expect(graph.getNeighbors('B')).toContain('A');
  });

  it('addEdge should add vertices if they do not exist before adding an edge', () => {
    graph.addEdge('A', 'B');

    expect(graph.hasVertex('A')).toBe(true);
    expect(graph.hasVertex('B')).toBe(true);
    expect(graph.hasEdge('A', 'B')).toBe(true);
    expect(graph.hasEdge('B', 'A')).toBe(true);
  });

  it('addEdge should add an edge with a specified weight', () => {
    graph.addEdge('A', 'B', 5);

    expect(graph.getWeight('A', 'B')).toBe(5);
    expect(graph.getWeight('B', 'A')).toBe(5);
  });

  it('addEdge should handle adding an edge between the same vertex (self-loop)', () => {
    graph.addVertex('A');
    graph.addEdge('A', 'A');

    expect(graph.hasEdge('A', 'A')).toBe(true);
    expect(graph.getNeighbors('A')).toContain('A');
  });

  it('removeVertex should remove an existing vertex and its associated edges', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');

    graph.removeVertex('A');

    expect(graph.hasVertex('A')).toBe(false);
    expect(graph.hasEdge('A', 'B')).toBe(false);
    expect(graph.hasEdge('B', 'A')).toBe(false);
    expect(graph.hasEdge('A', 'C')).toBe(false);
    expect(graph.hasEdge('C', 'A')).toBe(false);
    expect(graph.getNeighbors('B')).not.toContain('A');
    expect(graph.getNeighbors('C')).not.toContain('A');
  });

  it('removeVertex should not do anything if the vertex does not exist', () => {
    graph.addEdge('A', 'B');

    graph.removeVertex('C');

    expect(graph.hasVertex('A')).toBe(true);
    expect(graph.hasVertex('B')).toBe(true);
    expect(graph.getAllVertices().length).toBe(2);
  });

  it('removeEdge should remove an existing undirected edge between two vertices', () => {
    graph.addEdge('A', 'B', 5);

    graph.removeEdge('A', 'B');

    expect(graph.hasEdge('A', 'B')).toBe(false);
    expect(graph.hasEdge('B', 'A')).toBe(false);
    expect(graph.getWeight('A', 'B')).toBeUndefined();
    expect(graph.getWeight('B', 'A')).toBeUndefined();
    expect(graph.getNeighbors('A')).not.toContain('B');
    expect(graph.getNeighbors('B')).not.toContain('A');
  });

  it('removeEdge should not do anything if the edge does not exist', () => {
    graph.addVertex('A');
    graph.addVertex('B');

    graph.removeEdge('A', 'C');

    expect(graph.hasVertex('A')).toBe(true);
    expect(graph.hasVertex('B')).toBe(true);
    expect(graph.hasEdge('A', 'B')).toBe(false); // Edge was never added
  });

  it('hasVertex should return true if the vertex exists, false otherwise', () => {
    graph.addVertex('A');

    expect(graph.hasVertex('A')).toBe(true);
    expect(graph.hasVertex('B')).toBe(false);
  });

  it('hasEdge should return true if an undirected edge exists, false otherwise', () => {
    graph.addEdge('A', 'B');

    expect(graph.hasEdge('A', 'B')).toBe(true);
    expect(graph.hasEdge('B', 'A')).toBe(true);
    expect(graph.hasEdge('A', 'C')).toBe(false);
  });

  it('getNeighbors should return an array of neighbors for a given vertex', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');

    expect(graph.getNeighbors('A').sort()).toEqual(['B', 'C'].sort());
    expect(graph.getNeighbors('B').sort()).toEqual(['A', 'D'].sort());
    expect(graph.getNeighbors('C')).toEqual(['A']);
    expect(graph.getNeighbors('D')).toEqual(['B']);
  });

  it('getNeighbors should return an empty array for a vertex with no neighbors', () => {
    graph.addVertex('A');

    expect(graph.getNeighbors('A')).toEqual([]);
  });

  it('getNeighbors should return an empty array for a non-existent vertex', () => {
    expect(graph.getNeighbors('Z')).toEqual([]);
  });

  it('getWeight should return the weight of an existing undirected edge', () => {
    graph.addEdge('A', 'B', 5);

    expect(graph.getWeight('A', 'B')).toBe(5);
    expect(graph.getWeight('B', 'A')).toBe(5);
  });

  it('getWeight should return undefined for a non-existent edge', () => {
    graph.addVertex('A');
    graph.addVertex('B');

    expect(graph.getWeight('A', 'B')).toBeUndefined();
    expect(graph.getWeight('B', 'A')).toBeUndefined();
  });

  it('getWeight should return undefined for a non-existent vertex', () => {
    graph.addEdge('A', 'B', 5);

    expect(graph.getWeight('A', 'C')).toBeUndefined();
  });

  it('getAllVertices should return an array of all vertices in the graph', () => {
    graph.addVertex('A');
    graph.addEdge('B', 'C');
    graph.addVertex('D');

    expect(graph.getAllVertices().sort()).toEqual(['A', 'B', 'C', 'D'].sort());
  });

  it('getAllVertices should return an empty array for an empty graph', () => {
    expect(graph.getAllVertices()).toEqual([]);
  });

  it('bfs should perform Breadth-First Search correctly', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    graph.addEdge('C', 'E');
    graph.addEdge('D', 'F');

    expect(graph.bfs('A')).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
  });

  it('bfs should handle disconnected components', () => {
    graph.addEdge('A', 'B');
    graph.addVertex('C');

    expect(graph.bfs('A')).toEqual(['A', 'B']);
    expect(graph.bfs('C')).toEqual(['C']);
  });

  it('bfs should return an empty array for a non-existent start vertex', () => {
    expect(graph.bfs('Z')).toEqual([]);
  });

  it('bfs should execute the callback function for each visited vertex', () => {
    const visited: string[] = [];
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');

    graph.bfs('A', (vertex) => visited.push(vertex));

    expect(visited).toEqual(['A', 'B', 'C']);
  });

  it('dfs should perform Depth-First Search correctly', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    graph.addEdge('C', 'E');
    graph.addEdge('D', 'F');

    // Possible DFS traversals, the order might vary based on neighbor retrieval
    const result = graph.dfs('A');

    expect(result).toContain('A');
    expect(result).toContain('B');
    expect(result).toContain('C');
    expect(result).toContain('D');
    expect(result).toContain('E');
    expect(result).toContain('F');
    expect(result.length).toBe(6);
  });

  it('dfs should handle disconnected components', () => {
    graph.addEdge('A', 'B');
    graph.addVertex('C');

    expect(graph.dfs('A')).toEqual(['A', 'B']);
    expect(graph.dfs('C')).toEqual(['C']);
  });

  it('dfs should return an empty array for a non-existent start vertex', () => {
    expect(graph.dfs('Z')).toEqual([]);
  });

  it('dfs should execute the callback function for each visited vertex', () => {
    const visited: string[] = [];
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');

    graph.dfs('A', (vertex) => visited.push(vertex));

    expect(visited).toContain('A');
    expect(visited).toContain('B');
    expect(visited).toContain('C');
    expect(visited.length).toBe(3);
  });

  it('hasCycle should return false for a graph with no cycles', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'D');

    expect(graph.hasCycle()).toBe(false);
  });

  it('hasCycle should return true for a graph with a cycle', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'A');

    expect(graph.hasCycle()).toBe(true);
  });

  it('hasCycle should return true for a graph with a self-loop', () => {
    graph.addVertex('A');
    graph.addEdge('A', 'A');

    expect(graph.hasCycle()).toBe(true);
  });

  it('hasCycle should return false for an empty graph', () => {
    expect(graph.hasCycle()).toBe(false);
  });

  it('hasCycle should return false for a graph with a single vertex', () => {
    graph.addVertex('A');

    expect(graph.hasCycle()).toBe(false);
  });

  it('bellmanFord should return the correct shortest distances and previous nodes for a simple graph', () => {
    graph.addEdge('A', 'B', 1);
    graph.addEdge('A', 'C', 4);
    graph.addEdge('B', 'C', 2);
    graph.addEdge('B', 'D', 5);
    graph.addEdge('C', 'D', 1);

    const { distances, previous } = graph.bellmanFord('A');

    expect(distances).toEqual(
      new Map([
        ['A', 0],
        ['B', 1],
        ['C', 3],
        ['D', 4],
      ]),
    );
    expect(previous).toEqual(
      new Map([
        ['A', null],
        ['B', 'A'],
        ['C', 'B'],
        ['D', 'C'],
      ]),
    );
  });

  it('bellmanFord should handle graphs with disconnected components', () => {
    graph.addEdge('A', 'B', 1);
    graph.addEdge('C', 'D', 1);

    const { distances, previous } = graph.bellmanFord('A');

    expect(distances).toEqual(
      new Map([
        ['A', 0],
        ['B', 1],
        ['C', Infinity],
        ['D', Infinity],
      ]),
    );
    expect(previous).toEqual(
      new Map([
        ['A', null],
        ['B', 'A'],
        ['C', null],
        ['D', null],
      ]),
    );
  });

  it('bellmanFord should handle graphs with zero-weight edges', () => {
    graph.addEdge('A', 'B', 0);
    graph.addEdge('B', 'C', 2);

    const { distances, previous } = graph.bellmanFord('A');

    expect(distances).toEqual(
      new Map([
        ['A', 0],
        ['B', 0],
        ['C', 2],
      ]),
    );
    expect(previous).toEqual(
      new Map([
        ['A', null],
        ['B', 'A'],
        ['C', 'B'],
      ]),
    );
  });

  it('bellmanFord should return initial distances and previous nodes for a graph with a single vertex', () => {
    graph.addVertex('A');

    const { distances, previous } = graph.bellmanFord('A');

    expect(distances).toEqual(new Map([['A', 0]]));
    expect(previous).toEqual(new Map([['A', null]]));
  });

  it('bellmanFord should return empty distances and previous nodes if the start vertex is not in the graph', () => {
    graph.addEdge('A', 'B', 1);

    const { distances, previous } = graph.bellmanFord('C');

    expect(distances).toEqual(new Map());
    expect(previous).toEqual(new Map());
  });

  it('bellmanFord should detect negative cycles and return null distances', () => {
    const graph = new UndirectedGraph<string>();
    graph.addEdge('A', 'B', 1);
    graph.addEdge('B', 'C', -2);
    graph.addEdge('C', 'A', -1);

    const { distances, previous } = graph.bellmanFord('A');

    expect(distances).toBeNull();
    expect(previous).toEqual(new Map());
  });

  it('bellmanFord should detect a negative cycle in an undirected graph with a negative edge', () => {
    graph.addEdge('A', 'B', 5);
    graph.addEdge('A', 'C', 8);
    graph.addEdge('B', 'D', -4);
    graph.addEdge('C', 'B', -3); // This edge creates a B-C-B cycle of weight -6
    graph.addEdge('C', 'E', 9);
    graph.addEdge('D', 'E', 5);

    const { distances } = graph.bellmanFord('A');
    expect(distances).toBeNull();
  });
});
