import PriorityQueue from '../../data-structures/priority-queue/PriorityQueue';

/**
 * Represents a weighted edge in the graph.
 * T is the type used for node identifiers (e.g., number, string, etc.).
 */
interface Edge<T> {
  to: T;
  weight: number;
}

/**
 * Represents the result of Dijkstra's algorithm.
 * T is the type used for node identifiers.
 */
interface DijkstraResult<T> {
  // Distances map: Node -> total weight from start
  distances: Map<T, number>;
  // Path reconstruction map: Node -> previous node in the shortest path
  previous: Map<T, T | null>;
}

/**
 * Implements Dijkstra's shortest path algorithm using a priority queue.
 *
 * @param graph - Adjacency list representation where graph[node] = array of edges
 * @param start - The starting node
 * @returns Object containing distances and previous nodes
 * @template TNode - The type used for node identifiers.
 */
export function dijkstra<T>(
  graph: Map<T, Edge<T>[]>,
  start: T,
): DijkstraResult<T> {
  //

  const distances = new Map<T, number>();
  const previous = new Map<T, T | null>();
  // PriorityQueue must also be generic over TNode
  const pq = new PriorityQueue<T>();

  // 1. Initialize: start node has distance 0, all others infinity (implicitly)
  distances.set(start, 0);
  previous.set(start, null);
  // Priority queue stores the node and its current known distance (priority)
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    // 2. Extract the node 'current' with the smallest distance
    const current = pq.dequeue()!;
    const currentDist = distances.get(current)!;

    // Get neighbors of current node
    const neighbors = graph.get(current) || [];

    for (const edge of neighbors) {
      const { to, weight } = edge;
      const newDist = currentDist + weight;

      // 3. Relaxation step: If a shorter path is found...
      // Check if distance hasn't been set OR if new path is shorter than current
      if (!distances.has(to) || newDist < distances.get(to)!) {
        // Update distance and previous node
        distances.set(to, newDist);
        previous.set(to, current);

        // Update priority queue (enqueue handles both insert and update)
        pq.enqueue(to, newDist);
      }
    }
  }

  return { distances, previous };
}

/**
 * Helper function to create a graph from an edge list.
 *
 * @param edges - Array of edges [from: T, to: T, weight: number]
 * @returns Adjacency list representation of the graph: Map<T, Edge<T>[]>
 * @template TNode - The type used for node identifiers.
 */
export function createGraph<T>(edges: [T, T, number][]): Map<T, Edge<T>[]> {
  //

  const graph = new Map<T, Edge<T>[]>();

  for (const [from, to, weight] of edges) {
    // 1. Ensure the 'from' node is in the map
    if (!graph.has(from)) {
      graph.set(from, []);
    }

    // 2. Add the edge to the 'from' node's adjacency list
    graph.get(from)!.push({ to, weight });

    // NOTE: This implementation only handles directed graphs.
    // If you need an undirected graph, you would add the reverse edge here:
    /*
    if (!graph.has(to)) {
      graph.set(to, []);
    }
    graph.get(to)!.push({ to: from, weight });
    */
  }

  return graph;
}
