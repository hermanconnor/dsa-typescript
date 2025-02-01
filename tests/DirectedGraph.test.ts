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
});
