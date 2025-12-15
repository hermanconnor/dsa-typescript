/**
 * Graph represented as an adjacency list.
 * Key: node identifier, Value: array of neighboring nodes.
 */
export type Graph<T> = Map<T, T[]>;

/**
 * @function depthFirstSearch
 * @template T The type of the node identifiers.
 * @description Performs a Depth-First Search (DFS) traversal on a graph using recursion.
 * DFS explores as far as possible along each branch before backtracking.
 *
 * @param {Graph<T>} graph The graph represented as an adjacency list.
 * @param {T} startNode The node to start the traversal from.
 * @returns {T[]} An array containing the nodes in the order they were visited.
 *
 * @complexity
 * **Time Complexity:** O(V + E), where V is the number of vertices and E is the number of edges.
 * Each vertex is visited once, and each edge is explored once.
 * **Space Complexity:** O(V), where V is the number of vertices. This is due to the recursion stack
 * and the visited set, both of which can hold up to V elements.
 */
export function depthFirstSearch<T>(graph: Graph<T>, startNode: T): T[] {
  // Array to store the result of the traversal.
  const result: T[] = [];

  // Set to keep track of visited nodes (prevents cycles and revisiting).
  const visited = new Set<T>();

  /**
   * Helper function to recursively traverse the graph.
   * @param {T} node The current node being processed.
   */
  const dfs = (node: T): void => {
    // If the node has already been visited, return early.
    if (visited.has(node)) return;

    // Mark the current node as visited.
    visited.add(node);

    // Add the current node to the result array.
    result.push(node);

    // Get the neighbors of the current node (or empty array if node not in graph).
    const neighbors = graph.get(node) || [];

    // Recursively visit all unvisited neighbors.
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  };

  // Start the DFS from the given start node.
  dfs(startNode);

  // Return the array of nodes visited in DFS order.
  return result;
}

/**
 * @function depthFirstSearchIterative
 * @template T The type of the node identifiers.
 * @description Performs a Depth-First Search (DFS) traversal on a graph using an iterative approach with a stack.
 * DFS explores as far as possible along each branch before backtracking.
 *
 * @param {Graph<T>} graph The graph represented as an adjacency list.
 * @param {T} startNode The node to start the traversal from.
 * @returns {T[]} An array containing the nodes in the order they were visited.
 *
 * @complexity
 * **Time Complexity:** O(V + E), where V is the number of vertices and E is the number of edges.
 * Each vertex is visited once, and each edge is explored once.
 * **Space Complexity:** O(V), where V is the number of vertices. The stack and visited set
 * can each hold up to V elements.
 */
export function depthFirstSearchIterative<T>(
  graph: Graph<T>,
  startNode: T,
): T[] {
  // Array to store the result of the traversal.
  const result: T[] = [];

  // Set to keep track of visited nodes.
  const visited = new Set<T>();

  // Stack to manage the nodes to be visited. Initialize with the start node.
  const stack: T[] = [startNode];

  // Continue the loop as long as there are nodes in the stack.
  while (stack.length > 0) {
    // Pop the top node from the stack.
    const current = stack.pop()!;

    // If the node has already been visited, skip it.
    if (visited.has(current)) continue;

    // Mark the current node as visited.
    visited.add(current);

    // Add the current node to the result array.
    result.push(current);

    // Get the neighbors of the current node (or empty array if node not in graph).
    const neighbors = graph.get(current) || [];

    // Push unvisited neighbors onto the stack.
    // Note: We push in reverse order to maintain a similar traversal order to recursive DFS
    // (since stack is LIFO, reversing ensures we process neighbors in original order).
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }

  // Return the array of nodes visited in DFS order.
  return result;
}

/**
 * @function createGraph
 * @template T The type of the node identifiers.
 * @description Helper function to create a graph from an edge list.
 *
 * @param {Array<[T, T]>} edges Array of edges, where each edge is [from, to].
 * @param {boolean} directed Whether the graph is directed (default: false for undirected).
 * @returns {Graph<T>} The constructed graph as an adjacency list.
 */
export function createGraph<T>(
  edges: Array<[T, T]>,
  directed: boolean = false,
): Graph<T> {
  const graph: Graph<T> = new Map();

  // Add all edges to the graph.
  for (const [from, to] of edges) {
    // Ensure 'from' node exists in the graph.
    if (!graph.has(from)) {
      graph.set(from, []);
    }
    // Add 'to' as a neighbor of 'from'.
    graph.get(from)!.push(to);

    // For undirected graphs, add the reverse edge as well.
    if (!directed) {
      if (!graph.has(to)) {
        graph.set(to, []);
      }
      graph.get(to)!.push(from);
    } else {
      // For directed graphs, ensure 'to' node exists even if it has no outgoing edges.
      if (!graph.has(to)) {
        graph.set(to, []);
      }
    }
  }

  return graph;
}
