import { describe, it, expect } from 'vitest';
import { kruskal, Edge } from './kruskal';

describe('Kruskal Algorithm', () => {
  it('should find the MST of a simple connected graph', () => {
    const vertices = [0, 1, 2];
    const edges: Edge[] = [
      { from: 0, to: 1, weight: 10 },
      { from: 1, to: 2, weight: 5 },
      { from: 0, to: 2, weight: 1 },
    ];

    const result = kruskal(edges, vertices);

    expect(result.isFullyConnected).toBe(true);
    expect(result.totalWeight).toBe(6); // Edges (0,2) and (1,2)
    expect(result.edges).toHaveLength(2);
  });

  it('should handle a disconnected graph (Minimum Spanning Forest)', () => {
    // Two separate components: (0-1) and (2-3)
    const vertices = [0, 1, 2, 3];
    const edges: Edge[] = [
      { from: 0, to: 1, weight: 5 },
      { from: 2, to: 3, weight: 10 },
    ];

    const result = kruskal(edges, vertices);

    expect(result.isFullyConnected).toBe(false);
    expect(result.totalWeight).toBe(15);
    expect(result.edges).toHaveLength(2); // One edge for each component
  });

  it('should ignore self-loops and multi-edges', () => {
    const vertices = [0, 1];
    const edges: Edge[] = [
      { from: 0, to: 0, weight: 1 }, // Self-loop
      { from: 0, to: 1, weight: 10 },
      { from: 0, to: 1, weight: 5 }, // Cheaper multi-edge
    ];

    const result = kruskal(edges, vertices);

    expect(result.totalWeight).toBe(5);
    expect(result.edges).toHaveLength(1);
    expect(result.edges[0].weight).toBe(5);
  });

  it('should handle string-based vertex names', () => {
    const vertices = ['A', 'B', 'C'];
    const edges: Edge<string>[] = [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'A', to: 'C', weight: 3 },
    ];

    const result = kruskal(edges, vertices);

    expect(result.isFullyConnected).toBe(true);
    expect(result.totalWeight).toBe(3);
    expect(result.edges[0].from).toBe('A');
  });

  it('should throw an error if a vertex in an edge is missing from the vertex list', () => {
    const vertices = [0, 1];
    const edges: Edge[] = [{ from: 0, to: 99, weight: 5 }];

    expect(() => kruskal(edges, vertices)).toThrow(/not found/);
  });

  it('should handle single vertex graph', () => {
    const result = kruskal([], 1);

    expect(result.isFullyConnected).toBe(true);
    expect(result.edges).toHaveLength(0);
    expect(result.totalWeight).toBe(0);
  });

  it('should handle empty graph', () => {
    // Note: Based on guard, this should throw
    expect(() => kruskal([], 0)).toThrow('Graph must have at least one vertex');
  });

  it('should handle single edge graph', () => {
    const edges: Edge[] = [{ from: 0, to: 1, weight: 5 }];

    const result = kruskal(edges, 2);

    expect(result.isFullyConnected).toBe(true);
    expect(result.edges).toHaveLength(1);
    expect(result.totalWeight).toBe(5);
  });

  it('should handle linear graph', () => {
    // 0-1-2-3 (3 edges)
    const edges: Edge[] = [
      { from: 0, to: 1, weight: 1 },
      { from: 1, to: 2, weight: 1 },
      { from: 2, to: 3, weight: 1 },
    ];
    const result = kruskal(edges, 4);
    expect(result.isFullyConnected).toBe(true);
    expect(result.edges).toHaveLength(3);
  });

  it('should handle star graph', () => {
    // Center node 0 connected to 1, 2, 3
    const edges: Edge[] = [
      { from: 0, to: 1, weight: 1 },
      { from: 0, to: 2, weight: 1 },
      { from: 0, to: 3, weight: 1 },
    ];
    const result = kruskal(edges, 4);
    expect(result.isFullyConnected).toBe(true);
    expect(result.edges).toHaveLength(3);
  });

  it('should handle complete graph', () => {
    const edges: Edge[] = [
      { from: 0, to: 1, weight: 10 },
      { from: 0, to: 2, weight: 10 },
      { from: 0, to: 3, weight: 1 }, // Edge A (Weight 1) - Connects 0 to 3
      { from: 1, to: 2, weight: 1 }, // Edge B (Weight 1) - Connects 1 to 2
      { from: 1, to: 3, weight: 1 }, // Edge C (Weight 1) - Connects 1 to 3
      { from: 2, to: 3, weight: 10 },
    ];

    const result = kruskal(edges, 4);
    // To connect 0, 1, 2, 3:
    // 1. Pick (0,3) weight 1
    // 2. Pick (1,2) weight 1
    // 3. Pick (1,3) weight 1
    // Total edges: 3. Total weight: 3.
    expect(result.edges).toHaveLength(3);
    expect(result.totalWeight).toBe(3);
    expect(result.isFullyConnected).toBe(true);
  });

  it('should work with negative weights', () => {
    const edges: Edge[] = [
      { from: 0, to: 1, weight: -5 },
      { from: 1, to: 2, weight: -10 },
      { from: 0, to: 2, weight: 2 },
    ];

    const result = kruskal(edges, 3);

    expect(result.totalWeight).toBe(-15);
    expect(result.isFullyConnected).toBe(true);
  });

  it('should handle graph with equal weight edges', () => {
    const edges: Edge[] = [
      { from: 0, to: 1, weight: 5 },
      { from: 1, to: 2, weight: 5 },
      { from: 0, to: 2, weight: 5 },
    ];
    const result = kruskal(edges, 3);
    // Any two edges will work
    expect(result.edges).toHaveLength(2);
    expect(result.totalWeight).toBe(10);
  });

  it('should select edges in order of increasing weight', () => {
    const edges: Edge[] = [
      { from: 0, to: 1, weight: 100 },
      { from: 0, to: 1, weight: 10 }, // cheaper path
      { from: 0, to: 1, weight: 50 },
    ];

    const result = kruskal(edges, 2);

    expect(result.edges[0].weight).toBe(10);
    expect(result.totalWeight).toBe(10);
  });
});

describe('Stress Test', () => {
  it('should handle a large dense graph efficiently', () => {
    const numVertices = 1000;
    const numEdges = 10000;
    const edges = [];

    // Generate random edges
    for (let i = 0; i < numEdges; i++) {
      edges.push({
        from: Math.floor(Math.random() * numVertices),
        to: Math.floor(Math.random() * numVertices),
        weight: Math.random() * 100,
      });
    }

    const start = performance.now();
    const result = kruskal(edges, numVertices);
    const end = performance.now();

    console.log(
      `Kruskal took ${(end - start).toFixed(2)}ms for ${numEdges} edges`,
    );

    // In a random graph this large, it's statistically
    // almost certain to be connected, but we check logic regardless
    expect(result.edges.length).toBeLessThanOrEqual(numVertices - 1);
    expect(typeof result.totalWeight).toBe('number');
    expect(end - start).toBeLessThan(100); // Should easily run under 100ms
  });

  it('should correctly identify a single vertex as fully connected', () => {
    const result = kruskal([], 1);

    expect(result.isFullyConnected).toBe(true);
    expect(result.edges).toHaveLength(0);
  });

  it('should correctly identify two isolated vertices as NOT fully connected', () => {
    const result = kruskal([], 2);

    expect(result.isFullyConnected).toBe(false);
    expect(result.totalWeight).toBe(0);
  });
});
