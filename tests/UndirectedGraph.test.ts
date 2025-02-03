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
});
