import { beforeEach, describe, expect, it, vi } from 'vitest';
import DirectedGraph from '../src/data-structures/graph/DirectedGraph';

describe('DirectedGraph', () => {
  let graph: DirectedGraph<string>;

  beforeEach(() => {
    graph = new DirectedGraph();
  });

  it('graph should initialize with an empty adjacency list', () => {
    expect(graph.adjList.size).toBe(0);
  });

  it('addVertex should add a vertex to the graph', () => {
    graph.addVertex('A');

    expect(graph.adjList.has('A')).toBe(true);
  });

  it('addVertex should not add duplicate vertices', () => {
    graph.addVertex('A');
    graph.addVertex('A');

    expect(graph.adjList.size).toBe(1);
  });

  it('addEdge should add an edge between two vertices', () => {
    graph.addEdge('A', 'B');

    expect(graph.hasEdge('A', 'B')).toBe(true);
  });

  it('addEdge should automatically add vertices when adding an edge', () => {
    graph.addEdge('A', 'B');

    expect(graph.adjList.has('A')).toBe(true);
    expect(graph.adjList.has('B')).toBe(true);
  });

  it('addEdge should not add duplicate edges', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'B');

    expect(graph.adjList.get('A')?.length).toBe(1);
  });

  it('removeVertex should remove a vertex and its edges', () => {
    graph.addEdge('A', 'B');
    graph.removeVertex('A');

    expect(graph.adjList.has('A')).toBe(false);
    expect(graph.hasEdge('A', 'B')).toBe(false);
  });

  it("removeVertex should remove the vertex from other vertices' adjacency lists", () => {
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.removeVertex('B');

    expect(graph.hasEdge('A', 'B')).toBe(false);
    expect(graph.hasEdge('B', 'C')).toBe(false);
  });

  it('removeEdge should not remove edges from non-existing vertices', () => {
    graph.addEdge('A', 'B');

    const removed = graph.removeEdge('A', 'C');

    expect(removed).toBe(false);
    expect(graph.hasEdge('A', 'B')).toBe(true); // Edge 'A' -> 'B' should remain intact
  });

  it('removeEdge should remove an edge between two vertices', () => {
    graph.addEdge('A', 'B');
    graph.removeEdge('A', 'B');

    expect(graph.hasEdge('A', 'B')).toBe(false);
  });

  it('hasEdge should return false if an edge does not exist', () => {
    expect(graph.hasEdge('A', 'B')).toBe(false);
  });

  it('hasEdge should return true if an edge exists', () => {
    graph.addEdge('A', 'B');

    expect(graph.hasEdge('A', 'B')).toBe(true);
  });

  it('dfs should perform depth-first search and visit all vertices', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    graph.dfs('A');

    expect(logSpy).toHaveBeenCalledWith('A');
    expect(logSpy).toHaveBeenCalledWith('B');
    expect(logSpy).toHaveBeenCalledWith('C');

    logSpy.mockRestore();
  });

  it('bfs should perform breadth-first search visiting all vertices', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    graph.bfs('A');

    expect(logSpy).toHaveBeenCalledWith('A');
    expect(logSpy).toHaveBeenCalledWith('B');
    expect(logSpy).toHaveBeenCalledWith('C');
    expect(logSpy).toHaveBeenCalledWith('D');

    logSpy.mockRestore();
  });

  it('printGraph should print the correct adjacency list', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    graph.printGraph();

    expect(logSpy).toHaveBeenCalledWith('A: B, C');
    expect(logSpy).toHaveBeenCalledWith('B: ');
    expect(logSpy).toHaveBeenCalledWith('C: ');
  });
});
