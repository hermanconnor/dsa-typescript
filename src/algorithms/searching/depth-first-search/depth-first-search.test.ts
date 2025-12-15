import { describe, it, expect } from 'vitest';
import {
  Graph,
  depthFirstSearch,
  depthFirstSearchIterative,
  createGraph,
} from './depth-first-search';

// Helper function to create a simple graph
function createSimpleGraph(): Graph<number> {
  //     1
  //    / \
  //   2   3
  //  / \
  // 4   5
  return createGraph([
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
  ]);
}

// Helper function to create a graph with a cycle
function createCyclicGraph(): Graph<number> {
  //   1 - 2
  //   |   |
  //   4 - 3
  return createGraph([
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 1],
  ]);
}

// Helper function to create a disconnected graph
function createDisconnectedGraph(): Graph<number> {
  //   1 - 2    5 - 6
  //   |        |
  //   3 - 4    7
  return createGraph([
    [1, 2],
    [1, 3],
    [3, 4],
    [5, 6],
    [5, 7],
  ]);
}

// Helper function to create a directed graph
function createDirectedGraph(): Graph<string> {
  //   A → B → D
  //   ↓   ↓
  //   C → E
  return createGraph(
    [
      ['A', 'B'],
      ['A', 'C'],
      ['B', 'D'],
      ['B', 'E'],
      ['C', 'E'],
    ],
    true, // directed
  );
}

describe('createGraph Helper', () => {
  it('should create an undirected graph correctly', () => {
    const graph = createGraph([
      [1, 2],
      [2, 3],
    ]);

    expect(graph.get(1)).toEqual([2]);
    expect(graph.get(2)).toEqual([1, 3]);
    expect(graph.get(3)).toEqual([2]);
  });

  it('should create a directed graph correctly', () => {
    const graph = createGraph(
      [
        [1, 2],
        [2, 3],
      ],
      true,
    );

    expect(graph.get(1)).toEqual([2]);
    expect(graph.get(2)).toEqual([3]);
    expect(graph.get(3)).toEqual([]);
  });

  it('should handle self-loops', () => {
    const graph = createGraph([[1, 1]], true);
    expect(graph.get(1)).toEqual([1]);
  });

  it('should handle isolated nodes correctly', () => {
    const graph = createGraph([[1, 2]], true);
    expect(graph.has(1)).toBe(true);
    expect(graph.has(2)).toBe(true);
    expect(graph.get(2)).toEqual([]);
  });
});

describe('depthFirstSearch (Recursive)', () => {
  it('should traverse a simple graph starting from the root', () => {
    const graph = createSimpleGraph();
    const result = depthFirstSearch(graph, 1);

    // Should visit all nodes starting from 1
    expect(result).toHaveLength(5);
    expect(result[0]).toBe(1); // Start node should be first
    expect(result).toContain(2);
    expect(result).toContain(3);
    expect(result).toContain(4);
    expect(result).toContain(5);
  });

  it('should handle a graph with cycles without infinite loop', () => {
    const graph = createCyclicGraph();
    const result = depthFirstSearch(graph, 1);

    // Should visit all 4 nodes exactly once
    expect(result).toHaveLength(4);
    expect(new Set(result).size).toBe(4); // All unique
  });

  it('should only visit reachable nodes from start', () => {
    const graph = createDisconnectedGraph();
    const result = depthFirstSearch(graph, 1);

    // Starting from 1, should reach 1, 2, 3, 4 but not 5, 6, 7
    expect(result).toHaveLength(4);
    expect(result).toContain(1);
    expect(result).toContain(2);
    expect(result).toContain(3);
    expect(result).toContain(4);
    expect(result).not.toContain(5);
  });

  it('should work with a single node graph', () => {
    const graph = createGraph<number>([]);
    graph.set(1, []);
    const result = depthFirstSearch(graph, 1);

    expect(result).toEqual([1]);
  });

  it('should work with string nodes', () => {
    const graph = createDirectedGraph();
    const result = depthFirstSearch(graph, 'A');

    expect(result[0]).toBe('A');
    expect(result).toContain('B');
    expect(result).toContain('C');
  });

  it('should handle linear chain correctly', () => {
    const graph = createGraph(
      [
        [1, 2],
        [2, 3],
        [3, 4],
      ],
      true,
    );
    const result = depthFirstSearch(graph, 1);

    expect(result).toEqual([1, 2, 3, 4]);
  });
});

describe('depthFirstSearchIterative', () => {
  it('should traverse a simple graph starting from the root', () => {
    const graph = createSimpleGraph();
    const result = depthFirstSearchIterative(graph, 1);

    // Should visit all nodes starting from 1
    expect(result).toHaveLength(5);
    expect(result[0]).toBe(1); // Start node should be first
    expect(result).toContain(2);
    expect(result).toContain(3);
    expect(result).toContain(4);
    expect(result).toContain(5);
  });

  it('should handle a graph with cycles without infinite loop', () => {
    const graph = createCyclicGraph();
    const result = depthFirstSearchIterative(graph, 1);

    // Should visit all 4 nodes exactly once
    expect(result).toHaveLength(4);
    expect(new Set(result).size).toBe(4); // All unique
  });

  it('should only visit reachable nodes from start', () => {
    const graph = createDisconnectedGraph();
    const result = depthFirstSearchIterative(graph, 1);

    // Starting from 1, should reach 1, 2, 3, 4 but not 5, 6, 7
    expect(result).toHaveLength(4);
    expect(result).toContain(1);
    expect(result).toContain(2);
    expect(result).toContain(3);
    expect(result).toContain(4);
    expect(result).not.toContain(5);
  });

  it('should work with a single node graph', () => {
    const graph = createGraph<number>([]);
    graph.set(1, []);
    const result = depthFirstSearchIterative(graph, 1);

    expect(result).toEqual([1]);
  });

  it('should work with string nodes', () => {
    const graph = createDirectedGraph();
    const result = depthFirstSearchIterative(graph, 'A');

    expect(result[0]).toBe('A');
    expect(result).toContain('B');
    expect(result).toContain('C');
  });

  it('should handle linear chain correctly', () => {
    const graph = createGraph(
      [
        [1, 2],
        [2, 3],
        [3, 4],
      ],
      true,
    );
    const result = depthFirstSearchIterative(graph, 1);

    expect(result).toEqual([1, 2, 3, 4]);
  });
});

describe('Recursive vs Iterative Consistency', () => {
  it('should produce same visited nodes for simple graph', () => {
    const graph = createSimpleGraph();
    const recursiveResult = depthFirstSearch(graph, 1);
    const iterativeResult = depthFirstSearchIterative(graph, 1);

    // Same nodes should be visited (order might differ slightly)
    expect(new Set(recursiveResult)).toEqual(new Set(iterativeResult));
    expect(recursiveResult).toHaveLength(iterativeResult.length);
  });

  it('should produce same visited nodes for cyclic graph', () => {
    const graph = createCyclicGraph();
    const recursiveResult = depthFirstSearch(graph, 1);
    const iterativeResult = depthFirstSearchIterative(graph, 1);

    expect(new Set(recursiveResult)).toEqual(new Set(iterativeResult));
    expect(recursiveResult).toHaveLength(iterativeResult.length);
  });

  it('should both start with the same node', () => {
    const graph = createSimpleGraph();
    const recursiveResult = depthFirstSearch(graph, 1);
    const iterativeResult = depthFirstSearchIterative(graph, 1);

    expect(recursiveResult[0]).toBe(1);
    expect(iterativeResult[0]).toBe(1);
  });
});

describe('Edge Cases', () => {
  it('should handle empty neighbor lists', () => {
    const graph: Graph<number> = new Map();
    graph.set(1, []);

    expect(depthFirstSearch(graph, 1)).toEqual([1]);
    expect(depthFirstSearchIterative(graph, 1)).toEqual([1]);
  });

  it('should handle node not in graph gracefully', () => {
    const graph = createSimpleGraph();
    const result = depthFirstSearch(graph, 999);

    // Should return just the start node
    expect(result).toEqual([999]);
  });

  it('should handle self-loop in directed graph', () => {
    const graph = createGraph(
      [
        [1, 1],
        [1, 2],
      ],
      true,
    );
    const result = depthFirstSearch(graph, 1);

    // Should visit 1 and 2, self-loop shouldn't cause issues
    expect(result).toHaveLength(2);
    expect(result).toContain(1);
    expect(result).toContain(2);
  });

  it('should handle complex interconnected graph', () => {
    //     1 - 2
    //    /|\ /|
    //   3 4 5 6
    const graph = createGraph([
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [2, 5],
      [2, 6],
    ]);

    const result = depthFirstSearch(graph, 1);

    expect(result).toHaveLength(6);
    expect(result[0]).toBe(1);
  });
});
