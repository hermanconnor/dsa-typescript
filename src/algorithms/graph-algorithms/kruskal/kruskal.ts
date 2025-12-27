import UnionFind from '../../../data-structures/union-find/UnionFind';

/**
 * Represents an edge in a weighted graph.
 * @template T The type of the vertex identifier (default: number).
 */
export interface Edge<T = number> {
  from: T;
  to: T;
  weight: number;
}

/**
 * Represents the result of Kruskal's algorithm.
 */
interface MSTResult<T = number> {
  edges: Edge<T>[];
  totalWeight: number;
  isFullyConnected: boolean;
}

/**
 * Kruskal's Algorithm: Finds the Minimum Spanning Tree (MST) or Forest (MSF).
 * * This algorithm is "greedy"—it sorts edges by weight and adds them if they
 * don't form a cycle. It uses a Union-Find data structure for efficient cycle detection.
 *
 * @template T The type of vertex identifier.
 * @param edges - An array of all edges in the graph.
 * @param vertices - Either the total number of vertices (assumed 0 to n-1) or an array of vertex identifiers.
 * @returns An object containing the MST edges, total weight, and connection status.
 * @timeComplexity O(E log E) - Dominated by sorting edges
 * @spaceComplexity O(V + E) - Store vertices mapping and edges
 */
export function kruskal<T = number>(
  edges: Edge<T>[],
  vertices: T[] | number,
): MSTResult<T> {
  // 1. INPUT VALIDATION & INITIALIZATION
  // We determine how many vertices we are working with to initialize Union-Find.
  const vertexCount = typeof vertices === 'number' ? vertices : vertices.length;

  if (vertexCount < 0) throw new Error('Vertex count cannot be negative');
  if (vertexCount === 0) throw new Error('Graph must have at least one vertex');

  // If there are no edges, we can stop early.
  // A graph with no edges is only "connected" if it has exactly one vertex.
  if (edges.length === 0) {
    return {
      edges: [],
      totalWeight: 0,
      isFullyConnected: vertexCount === 1,
    };
  }

  // 2. VERTEX MAPPING
  // Union-Find works with integer indices (0 to n-1).
  // We map generic vertex identifiers (like strings or objects) to these indices.
  let vertexArray: T[];
  if (typeof vertices === 'number') {
    vertexArray = Array.from({ length: vertices }, (_, i) => i as T);
  } else {
    vertexArray = vertices;
  }

  const vertexToIndex = new Map(vertexArray.map((v, i) => [v, i]));
  const n = vertexArray.length;
  const uf = new UnionFind(n);

  // 3. PREPARATION
  // Kruskal's requires edges to be processed from smallest weight to largest.
  // We create a shallow copy ([...edges]) to avoid mutating the original input array.
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

  const mstEdges: Edge<T>[] = [];
  let totalWeight = 0;

  // 4. THE CORE LOOP (Greedy Selection)
  for (const edge of sortedEdges) {
    // Optimization: An edge connecting a node to itself is useless for a tree.
    if (edge.from === edge.to) continue;

    const fromIdx = vertexToIndex.get(edge.from);
    const toIdx = vertexToIndex.get(edge.to);

    // Safety check: ensure the vertices in the edge actually exist in our graph.
    if (fromIdx === undefined || toIdx === undefined) {
      throw new Error(
        `Invalid edge: vertex ${edge.from} or ${edge.to} not found`,
      );
    }

    /**
     * uf.union(x, y) does two things:
     * 1. It checks if x and y are already in the same component (Cycle Detection).
     * 2. If they aren't, it merges them and returns true.
     */
    if (uf.union(fromIdx, toIdx)) {
      mstEdges.push(edge);
      totalWeight += edge.weight;

      // Optimization: A spanning tree on N vertices always has exactly N-1 edges.
      // Once we hit that number, we can stop searching.
      if (mstEdges.length === n - 1) break;
    }
  }

  // 5. FINAL RESULT
  // If we couldn't find n-1 edges, it means the input graph was disconnected.
  return {
    edges: mstEdges,
    totalWeight,
    isFullyConnected: mstEdges.length === n - 1 || n === 1,
  };
}
