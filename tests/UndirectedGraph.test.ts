import { beforeEach, describe, expect, it, vi } from 'vitest';
import UndirectedGraph from '../src/data-structures/graph/UndirectedGraph';

describe('UndirectedGraph', () => {
  let graph: UndirectedGraph<string>;

  beforeEach(() => {
    graph = new UndirectedGraph();
  });

  it('graph should initialize with an empty adjacency list', () => {
    expect(graph.adjList.size).toBe(0);
  });

  it('addVertex should add a vertex to the graph', () => {
    graph.addVertex('A');

    expect(graph.adjList.has('A')).toBe(true);
    expect(graph.adjList.get('A')).toEqual([]);
  });

  it('addVertex should not add duplicate vertices', () => {
    graph.addVertex('A');
    graph.addVertex('A');

    expect(graph.adjList.size).toBe(1);
  });

  it('addEdge should add an edge correctly between existing vertices', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addEdge('A', 'B');

    expect(graph.adjList.get('A')).toEqual(['B']);
    expect(graph.adjList.get('B')).toEqual(['A']);
  });

  it('addEdge should add an edge between a new vertex and an existing one', () => {
    graph.addVertex('A');
    graph.addEdge('A', 'B');

    expect(graph.adjList.get('A')).toEqual(['B']);
    expect(graph.adjList.get('B')).toEqual(['A']);
  });

  it('addEdge should automatically add vertices when adding an edge', () => {
    graph.addEdge('A', 'B');

    expect(graph.adjList.has('A')).toBe(true);
    expect(graph.adjList.has('B')).toBe(true);
    expect(graph.adjList.get('A')).toEqual(['B']);
    expect(graph.adjList.get('B')).toEqual(['A']);
  });

  it('removeVertex should return false when removing a non-existent vertex', () => {
    graph.addVertex('A');

    const removed = graph.removeVertex('B');

    expect(removed).toBe(false);
    expect(graph.adjList.has('A')).toBe(true);
  });

  it('removeVertex should remove a vertex and its edges', () => {
    graph.addEdge('A', 'B');
    graph.removeVertex('A');

    expect(graph.adjList.has('A')).toBe(false);
    expect(graph.adjList.get('B')).toEqual([]);
  });

  it('removeEdge should not remove edges from non-existing vertices', () => {
    graph.addEdge('A', 'B');

    const removed = graph.removeEdge('A', 'C');

    expect(removed).toBe(false);
    expect(graph.adjList.get('A')).toEqual(['B']);
    expect(graph.adjList.get('B')).toEqual(['A']);
  });

  it('removeEdge should remove an existing edge between two vertices', () => {
    graph.addEdge('A', 'B');
    graph.removeEdge('A', 'B');

    expect(graph.adjList.get('A')).toEqual([]);
    expect(graph.adjList.get('B')).toEqual([]);
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
    const logSpy = vi.spyOn(console, 'log');

    graph.dfs('A');

    expect(logSpy).toHaveBeenCalledWith('A');
    expect(logSpy).toHaveBeenCalledWith('B');
    expect(logSpy).toHaveBeenCalledWith('C');
  });

  it('bfs should perform breadth-first search visiting all vertices', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    const logSpy = vi.spyOn(console, 'log');

    graph.bfs('A');

    expect(logSpy).toHaveBeenCalledWith('A');
    expect(logSpy).toHaveBeenCalledWith('B');
    expect(logSpy).toHaveBeenCalledWith('C');
    expect(logSpy).toHaveBeenCalledWith('D');
  });

  it('printGraph should print the correct adjacency list', () => {
    graph.addEdge('A', 'B');
    const logSpy = vi.spyOn(console, 'log');

    graph.printGraph();

    expect(logSpy).toHaveBeenCalledWith('A: B');
    expect(logSpy).toHaveBeenCalledWith('B: A');
  });
});
