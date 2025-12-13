import Queue from '../../../data-structures/queue/list-queue/Queue';

/**
 * Graph representation using an adjacency list.
 * The key is the node/vertex, and the value is an array of its neighbors.
 * @template T The type of the nodes/vertices in the graph.
 * @typedef {Map<T, T[]>} Graph
 */
export type Graph<T> = Map<T, T[]>;

/**
 * Performs a Breadth-First Search (BFS) on a graph starting from a given node.
 * BFS explores all the neighbor nodes at the present depth level before moving on to the nodes at the next depth level.
 *
 * @template T The type of the nodes/vertices in the graph.
 * @param {Graph<T>} graph The adjacency list representation of the graph.
 * @param {T} start The starting node for the traversal.
 * @returns {T[]} An array of nodes in the order they were visited (traversal order).
 *
 * @complexity
 * - **Time Complexity:** O(V + E), where V is the number of vertices (nodes) and E is the number of edges.
 * - Every vertex is enqueued and dequeued once.
 * - Every edge is checked once (for a directed graph) or twice (for an undirected graph).
 * - **Space Complexity:** O(V), where V is the number of vertices.
 * - The `visited` Set stores up to V nodes.
 * - The `queue` stores up to V nodes in the worst case (e.g., a star graph).
 */
export function bfs<T>(graph: Graph<T>, start: T): T[] {
  // A Set to keep track of visited nodes to prevent cycles and re-processing.
  const visited = new Set<T>();
  // A Queue is essential for BFS to process nodes in a FIFO (First-In, First-Out) manner.
  // It starts with the initial node.
  const queue = new Queue<T>([start]);
  // The array to store the nodes in the order of traversal.
  const result: T[] = [];

  // Mark the starting node as visited.
  visited.add(start);

  // Continue the search as long as there are nodes to visit in the queue.
  while (!queue.isEmpty()) {
    // Dequeue the next node to visit (FIFO). The `!` asserts it's not null/undefined.
    const node = queue.dequeue()!;
    // Add the visited node to the result array.
    result.push(node);

    // Get the neighbors (the nodes connected to the current node). Defaults to an empty array if the node has no entry.
    const neighbors = graph.get(node) || [];

    // Iterate over all neighbors of the current node.
    for (const neighbor of neighbors) {
      // Check if the neighbor has not been visited yet.
      if (!visited.has(neighbor)) {
        // Mark the new neighbor as visited.
        visited.add(neighbor);
        // Enqueue the neighbor to be processed in a future iteration.
        queue.enqueue(neighbor);
      }
    }
  }

  // Return the final list of nodes in BFS order.
  return result;
}

/**
 * Performs a Breadth-First Search (BFS) using a standard JavaScript array as the queue (alternative).
 * **NOTE:** Using `Array.prototype.shift()` to dequeue is generally less performant than a dedicated Queue data structure
 * because `shift()` causes the entire array to be re-indexed (Time Complexity: O(N) where N is the array size).
 *
 * @template T The type of the nodes/vertices in the graph.
 * @param {Graph<T>} graph The adjacency list representation of the graph.
 * @param {T} start The starting node for the traversal.
 * @returns {T[]} An array of nodes in the order they were visited (traversal order).
 *
 * @complexity
 * - **Time Complexity:** O(V^2), in the worst case, due to the O(V) time complexity of `queue.shift()` inside the main loop.
 * - If the internal array shifting overhead is ignored (assuming an ideal queue implementation), the complexity would be O(V + E).
 * - Using a real queue (like the one in `bfs` above) is the standard and preferred O(V + E) approach.
 * - **Space Complexity:** O(V), where V is the number of vertices (same as the dedicated Queue implementation).
 */
export function bfsWithArray<T>(graph: Graph<T>, start: T): T[] {
  // Set to track visited nodes.
  const visited = new Set<T>();
  // Using a standard array as the queue, initialized with the starting node.
  const queue: T[] = [start];
  // Array to store the traversal result.
  const result: T[] = [];

  // Mark the starting node as visited.
  visited.add(start);

  // Continue while the queue is not empty.
  while (queue.length > 0) {
    // Dequeue: use `shift()` to remove the first element (FIFO), which is O(N) for arrays.
    const node = queue.shift()!;
    // Record the visited node.
    result.push(node);

    // Get neighbors.
    const neighbors = graph.get(node) || [];

    // Process all neighbors.
    for (const neighbor of neighbors) {
      // If the neighbor is new/unvisited.
      if (!visited.has(neighbor)) {
        // Mark as visited.
        visited.add(neighbor);
        // Enqueue: use `push()` to add to the end of the array, which is O(1).
        queue.push(neighbor);
      }
    }
  }

  // Return the traversal result.
  return result;
}

/**
 * Creates a graph representation (Adjacency List) from a list of edges.
 *
 * @template T The type of the nodes/vertices in the graph.
 * @param {[T, T][]} edges An array of tuples, where each tuple represents an edge [NodeA, NodeB].
 * @param {boolean} [directed=false] If true, creates a directed graph (edge A->B but not B->A). If false, creates an undirected graph (edge A->B and B->A).
 * @returns {Graph<T>} The adjacency list representation of the graph.
 *
 * @complexity
 * - **Time Complexity:** O(V + E), where V is the number of vertices and $E$ is the number of edges. The loop runs E times.
 * - **Space Complexity:** O(V + E), to store the graph structure (Map keys for vertices and Map values for edges).
 */
export function createGraph<T>(edges: [T, T][], directed = false): Graph<T> {
  // Initialize an empty Map to serve as the adjacency list.
  const graph: Graph<T> = new Map();

  // Iterate over every edge [u, v] in the input list.
  for (const [u, v] of edges) {
    // Ensure both nodes of the edge exist as keys in the graph, initializing their neighbor list to empty if they don't.
    if (!graph.has(u)) graph.set(u, []);
    if (!graph.has(v)) graph.set(v, []);

    // Add a directed edge from u to v.
    graph.get(u)!.push(v);

    // If the graph is undirected, add the reverse edge from v to u.
    if (!directed) {
      graph.get(v)!.push(u);
    }
  }

  // Return the constructed graph.
  return graph;
}
