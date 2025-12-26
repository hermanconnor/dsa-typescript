import PriorityQueue from '../../data-structures/priority-queue/PriorityQueue';

/**
 * Represents a weighted edge in the graph.
 */
export interface Edge<T> {
  from: T;
  to: T;
  weight: number;
}

/**
 * Represents an adjacency list entry.
 */
interface Neighbor<T> {
  to: T;
  weight: number;
}

/**
 * Represents the result of Prim's algorithm.
 */
interface PrimResult<T> {
  mst: Edge<T>[];
  totalWeight: number;
  isConnected: boolean;
  visited: Set<T>;
}

/**
 * Computes the Minimum Spanning Tree (MST) of a graph using the Eager version of Prim's Algorithm.
 * * @template T - The type of the vertex identifier (e.g., string, number).
 * @param graph - An adjacency list representing the graph. For Prim's to work correctly,
 * this should represent an undirected graph.
 * @param start - The vertex to start the traversal from. Defaults to the first vertex in the graph.
 * * @returns An object containing the MST edges, total weight, and connectivity status.
 * * @complexity
 * Time Complexity: O(E log V)
 * - Each edge is explored once (E).
 * - Priority Queue operations (enqueue/update) take O(log V) time because the queue
 * size is limited to the number of vertices (V).
 * * Space Complexity: O(V)
 * - The Priority Queue and the auxiliary Maps (visited, edgeTo) store at most V elements.
 */
export function prim<T>(
  graph: Map<T, Neighbor<T>[]>,
  start?: T,
): PrimResult<T> {
  // 1. Handle edge case: Empty graphs have no MST
  if (graph.size === 0) {
    return { mst: [], totalWeight: 0, isConnected: true, visited: new Set() };
  }

  // 2. Determine starting point. If not provided, pick the first available vertex.
  const startVertex = start ?? graph.keys().next().value;
  if (startVertex === undefined || !graph.has(startVertex)) {
    throw new Error(`Starting vertex not found in graph`);
  }

  const mst: Edge<T>[] = [];
  const visited = new Set<T>();

  /** * Tracks the "best" (cheapest) edge found so far that connects an
   * unvisited vertex to the growing MST.
   */
  const edgeTo = new Map<T, Edge<T>>();

  /** * The Priority Queue stores vertices we can reach.
   * Priority is determined by the weight of the edge used to reach that vertex.
   */
  const pq = new PriorityQueue<T>();

  // 3. Initialize: The first vertex is reached with 0 cost.
  pq.enqueue(startVertex, 0);

  while (!pq.isEmpty()) {
    // 4. Greedily pick the vertex with the smallest incoming edge weight.
    const current = pq.dequeue()!;

    // If we have already processed this vertex, skip it (standard safety check).
    if (visited.has(current)) continue;

    // 5. Finalize the vertex. It is now part of our MST.
    visited.add(current);

    // 6. Record the edge that brought us here into our MST result.
    const connection = edgeTo.get(current);
    if (connection) {
      mst.push(connection);
    }

    // 7. Explore all outgoing edges from the current vertex.
    const neighbors = graph.get(current) || [];
    for (const neighbor of neighbors) {
      const { to, weight } = neighbor;

      // Ignore vertices already finalized in the MST.
      if (visited.has(to)) continue;

      /**
       * EAGER LOGIC:
       * Instead of just adding the edge to the PQ, we check if this new edge
       * is cheaper than any previously discovered edge leading to the same vertex.
       */
      const currentBestWeight = pq.getPriority(to) ?? Infinity;

      if (weight < currentBestWeight) {
        // Update our record of the best edge to reach 'to'.
        edgeTo.set(to, { from: current, to, weight });

        /**
         * Update the Priority Queue.
         * Because our PQ's .enqueue() handles existing values by removing/re-inserting,
         * we ensure the PQ size stays O(V).
         */
        pq.enqueue(to, weight);
      }
    }
  }

  // 8. Final calculations.
  const totalWeight = mst.reduce((acc, edge) => acc + edge.weight, 0);

  /**
   * If the number of visited nodes equals the graph size, the graph is connected.
   * If not, the result represents the MST of just one "island" (connected component).
   */
  const isConnected = visited.size === graph.size;

  return { mst, totalWeight, isConnected, visited };
}

/**
 * Helper function
 * Creates an adjacency list graph from an edge list.
 * For undirected graphs, adds edges in both directions.
 *
 * @param edges - Array of edges
 * @param directed - Whether the graph is directed (default: false)
 * @returns Adjacency list representation
 */
export function createGraphFromEdges<T>(
  edges: Edge<T>[],
  directed: boolean = false,
): Map<T, Neighbor<T>[]> {
  const graph = new Map<T, Neighbor<T>[]>();

  for (const edge of edges) {
    const { from, to, weight } = edge;

    // Initialize arrays if they don't exist
    if (!graph.has(from)) graph.set(from, []);
    if (!graph.has(to)) graph.set(to, []);

    // Add forward edge
    graph.get(from)!.push({ to, weight });

    // For undirected graphs (required for Prim's), add the reverse edge
    if (!directed) {
      graph.get(to)!.push({ to: from, weight });
    }
  }

  return graph;
}
