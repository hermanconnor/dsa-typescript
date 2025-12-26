/**
 * Represents a weighted edge in the graph.
 */
export interface Edge<T> {
  from: T;
  to: T;
  weight: number;
}

/**
 * Represents the result of Bellman-Ford algorithm.
 */
interface BellmanFordResult<T> {
  distances: Map<T, number>;
  previous: Map<T, T | null>;
  hasNegativeCycle: boolean;
  negativeCycleNodes?: Set<T>;
}

/**
 * Implements the Bellman-Ford shortest path algorithm.
 * Unlike Dijkstra, this algorithm can handle negative edge weights and detect negative cycles.
 * Time Complexity: O(V * E) where V is vertices and E is edges.
 * Space Complexity: O(V) for distances and previous maps.
 *
 * @template T - The type of the vertex identifier.
 * @param edges - An array of directed edges with weights.
 * @param vertices - An iterable of all unique vertices in the graph.
 * @param start - The starting source vertex.
 * @returns An object containing distances, previous nodes, and cycle information.
 */
export function bellmanFord<T>(
  edges: Edge<T>[],
  vertices: Iterable<T>,
  start: T,
): BellmanFordResult<T> {
  const distances = new Map<T, number>();
  const previous = new Map<T, T | null>();
  const vertexSet = new Set(vertices);

  /** * STEP 1: Initialization
   * We set the distance to the start node to 0 and all other nodes to Infinity.
   */
  for (const vertex of vertexSet) {
    distances.set(vertex, vertex === start ? 0 : Infinity);
    previous.set(vertex, null);
  }

  const V = vertexSet.size;

  /**
   * STEP 2: Edge Relaxation
   * A shortest path between two nodes can have at most V-1 edges.
   * By relaxing all edges V-1 times, we guarantee that the shortest
   * paths are found if no negative cycles exist.
   */
  for (let i = 0; i < V - 1; i++) {
    let updated = false;

    for (const { from, to, weight } of edges) {
      const distFrom = distances.get(from);
      // Use Infinity if the destination hasn't been reached yet
      const distTo = distances.get(to) ?? Infinity;

      // If the source of this edge is reachable...
      if (distFrom !== undefined && distFrom !== Infinity) {
        const newDist = distFrom + weight;

        // ...and this path is shorter than the currently known path to 'to'
        if (newDist < distTo) {
          distances.set(to, newDist);
          previous.set(to, from);
          updated = true;
        }
      }
    }

    // Optimization: If no distances changed during an entire pass,
    // we have already found the shortest paths.
    if (!updated) break;
  }

  /**
   * STEP 3: Negative Cycle Detection
   * If we can still "relax" an edge after V-1 iterations, it means
   * there is a cycle where the total weight is negative.
   */
  const negativeCycleNodes = new Set<T>();
  let hasNegativeCycle = false;

  for (const { from, to, weight } of edges) {
    const distFrom = distances.get(from);
    const distTo = distances.get(to) ?? Infinity;

    if (distFrom !== undefined && distFrom !== Infinity) {
      if (distFrom + weight < distTo) {
        hasNegativeCycle = true;
        negativeCycleNodes.add(to);
      }
    }
  }

  /**
   * STEP 4: Negative Cycle Propagation
   * Any node reachable from a negative cycle also has an "undefined"
   * shortest path (effectively -Infinity). We propagate that status here.
   */
  if (hasNegativeCycle) {
    for (let i = 0; i < V; i++) {
      let changed = false;

      for (const { from, to } of edges) {
        if (negativeCycleNodes.has(from) && !negativeCycleNodes.has(to)) {
          negativeCycleNodes.add(to);
          changed = true;
        }
      }

      if (!changed) break;
    }
  }

  return {
    distances,
    previous,
    hasNegativeCycle,
    negativeCycleNodes: hasNegativeCycle ? negativeCycleNodes : undefined,
  };
}

// ::::::::::::::::::::::::::
//     HELPER FUNCTIONS
// ::::::::::::::::::::::::::

/**
 * Reconstructs the shortest path from the 'previous' map.
 */
export function reconstructPath<T>(
  previous: Map<T, T | null>,
  start: T,
  end: T,
): T[] | null {
  // If the end node was never reached
  if (!previous.has(end)) return null;

  const path: T[] = [];
  let current: T | null = end;
  const visited = new Set<T>();

  while (current !== null) {
    // Safety check: Detect infinite loops if there's a cycle in the 'previous' pointers
    if (visited.has(current)) return null;
    visited.add(current);

    path.push(current);

    // If we've reached the start, we can stop early
    if (current === start) break;

    current = previous.get(current) ?? null;
  }

  path.reverse();

  // Validate that the path actually begins at our intended start
  return path[0] === start ? path : null;
}

/**
 * Extracts a unique set of all vertices from an edge list.
 */
export function getVertices<T>(edges: Edge<T>[]): Set<T> {
  const vertices = new Set<T>();

  for (const edge of edges) {
    vertices.add(edge.from);
    vertices.add(edge.to);
  }

  return vertices;
}

/**
 * Converts an Adjacency List (Map) to an Edge List.
 */
export function graphToEdges<T>(
  graph: Map<T, Array<{ to: T; weight: number }>>,
): Edge<T>[] {
  const edges: Edge<T>[] = [];

  for (const [from, neighbors] of graph) {
    for (const neighbor of neighbors) {
      edges.push({
        from,
        to: neighbor.to,
        weight: neighbor.weight,
      });
    }
  }

  return edges;
}
