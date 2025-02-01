import { beforeEach, describe, expect, it } from 'vitest';
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

  it('hasEdge should return false if an edge does not exist', () => {
    expect(graph.hasEdge('A', 'B')).toBe(false);
  });

  it('hasEdge should return true if an edge exists', () => {
    graph.addEdge('A', 'B');

    expect(graph.hasEdge('A', 'B')).toBe(true);
  });
});
