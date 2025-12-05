import PriorityQueue from '../../priority-queue/PriorityQueue';
import Queue from '../../queue/Queue';

interface Edge<T> {
  target: T;
  weight?: number;
}

class DirectedGraph<T> {
  private adjacencyList: Map<T, Edge<T>[]>;

  constructor() {
    this.adjacencyList = new Map();
  }

  /**
   * Adds a vertex to the graph.
   *
   * @param vertex - The vertex to add
   * @complexity O(1)
   */
  addVertex(vertex: T): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  /**
   * Adds a directed edge from one vertex to another with an optional weight.
   * If the edge already exists, updates its weight.
   *
   * @param from - The source vertex
   * @param to - The target vertex
   * @param weight - Optional edge weight (defaults to undefined)
   * @throws Error if either vertex doesn't exist
   * @complexity O(E_out) where E_out is the out-degree of the source vertex
   */
  addEdge(from: T, to: T, weight?: number): void {
    if (!this.hasVertex(from)) {
      throw new Error(`Source vertex "${from}" does not exist. Add it first.`);
    }
    if (!this.hasVertex(to)) {
      throw new Error(`Target vertex "${to}" does not exist. Add it first.`);
    }

    const edges = this.adjacencyList.get(from)!;
    const existingIndex = edges.findIndex((e) => e.target === to);

    if (existingIndex !== -1) {
      edges[existingIndex].weight = weight;
      return;
    }

    edges.push({ target: to, weight });
  }

  /**
   * Removes a vertex and all edges connected to it.
   *
   * @param vertex - The vertex to remove
   * @returns true if the vertex was removed, false if it didn't exist
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  removeVertex(vertex: T): boolean {
    if (!this.hasVertex(vertex)) {
      return false;
    }

    this.adjacencyList.delete(vertex);

    for (const edges of this.adjacencyList.values()) {
      const index = edges.findIndex((e) => e.target === vertex);
      if (index !== -1) {
        edges.splice(index, 1);
      }
    }

    return true;
  }

  /**
   * Removes a directed edge between two vertices.
   *
   * @param from - The source vertex
   * @param to - The target vertex
   * @returns true if the edge was removed, false if it didn't exist
   * @complexity O(E_out) where E_out is the out-degree of the source vertex
   */
  removeEdge(from: T, to: T): boolean {
    const edges = this.adjacencyList.get(from);
    if (!edges) {
      return false;
    }

    const index = edges.findIndex((edge) => edge.target === to);
    if (index === -1) {
      return false;
    }

    edges.splice(index, 1);
    return true;
  }

  /**
   * Checks if a vertex exists in the graph.
   *
   * @param vertex - The vertex to check
   * @returns true if the vertex exists, false otherwise
   * @complexity O(1)
   */
  hasVertex(vertex: T): boolean {
    return this.adjacencyList.has(vertex);
  }

  /**
   * Checks if a directed edge exists between two vertices.
   *
   * @param from - The source vertex
   * @param to - The target vertex
   * @returns true if the edge exists, false otherwise
   * @complexity O(E_out) where E_out is the out-degree of the source vertex
   */
  hasEdge(from: T, to: T): boolean {
    const edges = this.adjacencyList.get(from);

    return edges ? edges.some((edge) => edge.target === to) : false;
  }

  /**
   * Gets all outgoing edges from a vertex.
   * Returns a copy to prevent external modification.
   *
   * @param vertex - The vertex to get neighbors for
   * @returns An array of edges with their targets and optional weights
   * @throws Error if the vertex doesn't exist
   * @complexity O(E_out) where E_out is the out-degree of the vertex
   */
  getNeighbors(vertex: T): Edge<T>[] {
    if (!this.hasVertex(vertex)) {
      throw new Error(`Vertex "${vertex}" does not exist.`);
    }

    return [...this.adjacencyList.get(vertex)!];
  }

  /**
   * Gets the weight of an edge between two vertices.
   *
   * @param from - The source vertex
   * @param to - The target vertex
   * @returns The edge weight, or undefined if the edge doesn't exist
   * @complexity O(E_out) where E_out is the out-degree of the source vertex
   */
  getEdgeWeight(from: T, to: T): number | undefined {
    const edges = this.adjacencyList.get(from);

    const edge = edges?.find((e) => e.target === to);
    return edge?.weight;
  }

  /**
   * Gets all vertices in the graph.
   *
   * @returns An array of all vertices
   * @complexity O(V) where V is the number of vertices
   */
  getAllVertices(): T[] {
    return Array.from(this.adjacencyList.keys());
  }

  /**
   * Gets the total number of vertices in the graph.
   *
   * @complexity O(1)
   */
  get vertexCount(): number {
    return this.adjacencyList.size;
  }

  /**
   * Gets the total number of edges in the graph.
   *
   * @complexity O(V) where V is the number of vertices
   */
  get edgeCount(): number {
    let count = 0;

    for (const edges of this.adjacencyList.values()) {
      count += edges.length;
    }

    return count;
  }

  /**
   * Gets the out-degree of a vertex (number of outgoing edges).
   *
   * @param vertex - The vertex to check
   * @returns The number of outgoing edges
   * @throws Error if the vertex doesn't exist
   * @complexity O(1)
   */
  getOutDegree(vertex: T): number {
    if (!this.hasVertex(vertex)) {
      throw new Error(`Vertex "${vertex}" does not exist.`);
    }

    return this.adjacencyList.get(vertex)!.length;
  }

  /**
   * Gets the in-degree of a vertex (number of incoming edges).
   *
   * @param vertex - The vertex to check
   * @returns The number of incoming edges
   * @throws Error if the vertex doesn't exist
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  getInDegree(vertex: T): number {
    if (!this.hasVertex(vertex)) {
      throw new Error(`Vertex "${vertex}" does not exist.`);
    }

    let count = 0;
    for (const edges of this.adjacencyList.values()) {
      count += edges.filter((e) => e.target === vertex).length;
    }
    return count;
  }

  /**
   * Gets all source vertices (vertices with in-degree of 0).
   * Optimized to compute all in-degrees in a single pass.
   *
   * @returns An array of all source vertices
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  getSources(): T[] {
    const sources: T[] = [];
    const vertices = this.getAllVertices();

    // Calculate all in-degrees in one pass
    const inDegrees = new Map<T, number>();
    for (const vertex of vertices) {
      inDegrees.set(vertex, 0);
    }

    for (const edges of this.adjacencyList.values()) {
      for (const { target } of edges) {
        inDegrees.set(target, inDegrees.get(target)! + 1);
      }
    }

    for (const [vertex, degree] of inDegrees) {
      if (degree === 0) {
        sources.push(vertex);
      }
    }

    return sources;
  }

  /**
   * Gets all sink vertices (vertices with out-degree of 0).
   *
   * @returns An array of all sink vertices
   * @complexity O(V) where V is the number of vertices
   */
  getSinks(): T[] {
    const sinks: T[] = [];

    for (const vertex of this.getAllVertices()) {
      if (this.adjacencyList.get(vertex)!.length === 0) {
        sinks.push(vertex);
      }
    }

    return sinks;
  }

  /**
   * Removes all vertices and edges from the graph.
   *
   * @complexity O(1)
   */
  clear(): void {
    this.adjacencyList.clear();
  }

  /**
   * Performs a breadth-first search traversal starting from a given vertex.
   * Returns the vertices in the order they were visited.
   *
   * @param startVertex - The vertex to start the traversal from
   * @returns An array of vertices in BFS order
   * @throws Error if the start vertex doesn't exist
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  getBFSOrder(startVertex: T): T[] {
    if (!this.hasVertex(startVertex)) {
      throw new Error(`Start vertex "${startVertex}" not found for BFS.`);
    }

    const traversalOrder: T[] = [];
    const visited = new Set<T>();
    const queue = new Queue<T>();

    queue.enqueue(startVertex);
    visited.add(startVertex);

    while (!queue.isEmpty()) {
      const currentVertex = queue.dequeue()!;
      traversalOrder.push(currentVertex);

      const neighbors = this.getNeighbors(currentVertex);
      for (const { target } of neighbors) {
        if (!visited.has(target)) {
          visited.add(target);
          queue.enqueue(target);
        }
      }
    }

    return traversalOrder;
  }

  /**
   * Performs a depth-first search traversal starting from a given vertex.
   * Returns the vertices in the order they were visited.
   * Uses an iterative approach with a stack.
   *
   * @param startVertex - The vertex to start the traversal from
   * @returns An array of vertices in DFS order
   * @throws Error if the start vertex doesn't exist
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  getDFSOrder(startVertex: T): T[] {
    if (!this.hasVertex(startVertex)) {
      throw new Error(`Start vertex "${startVertex}" not found for DFS.`);
    }

    const visited = new Set<T>();
    const stack: T[] = [startVertex];
    const traversalOrder: T[] = [];

    while (stack.length > 0) {
      const vertex = stack.pop()!;

      if (!visited.has(vertex)) {
        visited.add(vertex);
        traversalOrder.push(vertex);

        const neighbors = this.getNeighbors(vertex);
        // Push in reverse order so we visit in natural order
        for (let i = neighbors.length - 1; i >= 0; i--) {
          const target = neighbors[i].target;
          if (!visited.has(target)) {
            stack.push(target);
          }
        }
      }
    }

    return traversalOrder;
  }

  /**
   * Performs a breadth-first search traversal, calling a callback for each vertex visited.
   * More memory-efficient than getBFSOrder() as it doesn't store all vertices.
   *
   * @param startVertex - The vertex to start the traversal from
   * @param callback - Function to call for each visited vertex
   * @throws Error if the start vertex doesn't exist
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  traverseBFS(startVertex: T, callback: (vertex: T) => void): void {
    if (!this.hasVertex(startVertex)) {
      throw new Error(`Start vertex "${startVertex}" not found for BFS.`);
    }

    const visited = new Set<T>();
    const queue = new Queue<T>();

    queue.enqueue(startVertex);
    visited.add(startVertex);

    while (!queue.isEmpty()) {
      const currentVertex = queue.dequeue()!;
      callback(currentVertex);

      const neighbors = this.getNeighbors(currentVertex);
      for (const { target } of neighbors) {
        if (!visited.has(target)) {
          visited.add(target);
          queue.enqueue(target);
        }
      }
    }
  }

  /**
   * Performs a depth-first search traversal, calling a callback for each vertex visited.
   * More memory-efficient than getDFSOrder() as it doesn't store all vertices.
   *
   * @param startVertex - The vertex to start the traversal from
   * @param callback - Function to call for each visited vertex
   * @throws Error if the start vertex doesn't exist
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  traverseDFS(startVertex: T, callback: (vertex: T) => void): void {
    if (!this.hasVertex(startVertex)) {
      throw new Error(`Start vertex "${startVertex}" not found for DFS.`);
    }

    const visited = new Set<T>();
    const stack: T[] = [startVertex];

    while (stack.length > 0) {
      const vertex = stack.pop()!;

      if (!visited.has(vertex)) {
        visited.add(vertex);
        callback(vertex);

        const neighbors = this.getNeighbors(vertex);
        // Push in reverse order so we visit in natural order
        for (let i = neighbors.length - 1; i >= 0; i--) {
          const target = neighbors[i].target;
          if (!visited.has(target)) {
            stack.push(target);
          }
        }
      }
    }
  }

  /**
   * Detects if the graph contains a cycle using DFS with color marking.
   * Uses white (unvisited), gray (in progress), and black (finished) marking.
   *
   * @returns true if the graph contains a cycle, false otherwise
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  hasCycle(): boolean {
    const white = new Set<T>(this.getAllVertices());
    const gray = new Set<T>();
    const black = new Set<T>();

    const dfs = (vertex: T): boolean => {
      white.delete(vertex);
      gray.add(vertex);

      const neighbors = this.getNeighbors(vertex);

      for (const { target } of neighbors) {
        if (black.has(target)) continue;
        if (gray.has(target)) return true;
        if (dfs(target)) return true;
      }

      gray.delete(vertex);
      black.add(vertex);

      return false;
    };

    for (const vertex of white) {
      if (dfs(vertex)) return true;
    }

    return false;
  }

  /**
   * Checks if the graph is a Directed Acyclic Graph (DAG).
   *
   * @returns true if the graph has no cycles, false otherwise
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  isDAG(): boolean {
    return !this.hasCycle();
  }

  /**
   * Performs topological sort using Kahn's algorithm (BFS-based).
   * Returns vertices in topologically sorted order, or undefined if the graph has a cycle.
   *
   * @returns An array of vertices in topological order, or undefined if a cycle exists
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  topologicalSort(): T[] | undefined {
    const inDegree = new Map<T, number>();

    // Initialize all vertices with 0
    for (const vertex of this.getAllVertices()) {
      inDegree.set(vertex, 0);
    }

    // Count in-degrees in one pass
    for (const edges of this.adjacencyList.values()) {
      for (const { target } of edges) {
        inDegree.set(target, inDegree.get(target)! + 1);
      }
    }

    const queue = new Queue<T>();

    for (const [vertex, degree] of inDegree) {
      if (degree === 0) {
        queue.enqueue(vertex);
      }
    }

    const result: T[] = [];

    while (!queue.isEmpty()) {
      const vertex = queue.dequeue()!;

      result.push(vertex);
      const neighbors = this.getNeighbors(vertex);

      for (const { target } of neighbors) {
        const newDegree = inDegree.get(target)! - 1;
        inDegree.set(target, newDegree);

        if (newDegree === 0) {
          queue.enqueue(target);
        }
      }
    }

    return result.length === this.vertexCount ? result : undefined;
  }

  /**
   * Performs topological sort using DFS.
   * Returns vertices in topologically sorted order, or undefined if the graph has a cycle.
   *
   * @returns An array of vertices in topological order, or undefined if a cycle exists
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  topologicalSortDFS(): T[] | undefined {
    if (this.hasCycle()) return undefined;

    const visited = new Set<T>();
    const stack: T[] = [];

    const dfs = (vertex: T): void => {
      visited.add(vertex);

      const neighbors = this.getNeighbors(vertex);

      for (const { target } of neighbors) {
        if (!visited.has(target)) {
          dfs(target);
        }
      }

      stack.push(vertex);
    };

    for (const vertex of this.getAllVertices()) {
      if (!visited.has(vertex)) {
        dfs(vertex);
      }
    }

    return stack.reverse();
  }

  /**
   * Creates a transposed graph where all edge directions are reversed.
   *
   * @returns A new graph with all edges reversed
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  transpose(): DirectedGraph<T> {
    const transposed = new DirectedGraph<T>();

    for (const vertex of this.getAllVertices()) {
      transposed.addVertex(vertex);
    }

    for (const [source, edges] of this.adjacencyList) {
      for (const { target, weight } of edges) {
        transposed.addEdge(target, source, weight);
      }
    }

    return transposed;
  }

  /**
   * Finds all strongly connected components using Kosaraju's algorithm.
   * A strongly connected component is a maximal set of vertices where every vertex
   * is reachable from every other vertex in the set.
   *
   * @returns An array of components, where each component is an array of vertices
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  getStronglyConnectedComponents(): T[][] {
    // Kosaraju's algorithm
    const visited = new Set<T>();
    const stack: T[] = [];

    // First DFS to fill the stack
    const dfs1 = (vertex: T): void => {
      visited.add(vertex);
      const neighbors = this.getNeighbors(vertex);
      for (const { target } of neighbors) {
        if (!visited.has(target)) {
          dfs1(target);
        }
      }
      stack.push(vertex);
    };

    for (const vertex of this.getAllVertices()) {
      if (!visited.has(vertex)) {
        dfs1(vertex);
      }
    }

    // Get transposed graph
    const transposed = this.transpose();

    // Second DFS on transposed graph
    visited.clear();
    const components: T[][] = [];

    const dfs2 = (vertex: T, component: T[]): void => {
      visited.add(vertex);
      component.push(vertex);
      const neighbors = transposed.getNeighbors(vertex);
      for (const { target } of neighbors) {
        if (!visited.has(target)) {
          dfs2(target, component);
        }
      }
    };

    while (stack.length > 0) {
      const vertex = stack.pop()!;
      if (!visited.has(vertex)) {
        const component: T[] = [];
        dfs2(vertex, component);
        components.push(component);
      }
    }

    return components;
  }

  /**
   * Checks if a path exists between two vertices using BFS.
   *
   * @param from - The source vertex
   * @param to - The target vertex
   * @returns true if a path exists, false otherwise
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  hasPath(from: T, to: T): boolean {
    if (!this.hasVertex(from) || !this.hasVertex(to)) {
      return false;
    }

    if (from === to) {
      return true;
    }

    const visited = new Set<T>();
    const queue = new Queue<T>();

    queue.enqueue(from);
    visited.add(from);

    while (!queue.isEmpty()) {
      const vertex = queue.dequeue()!;
      const neighbors = this.getNeighbors(vertex);

      for (const { target } of neighbors) {
        if (target === to) {
          return true;
        }
        if (!visited.has(target)) {
          visited.add(target);
          queue.enqueue(target);
        }
      }
    }

    return false;
  }

  /**
   * Finds the shortest path between two vertices in an unweighted graph using BFS.
   * For weighted graphs, use findShortestPathWeighted() instead.
   *
   * @param from - The source vertex
   * @param to - The target vertex
   * @returns An array representing the shortest path, or undefined if no path exists
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  findShortestPath(from: T, to: T): T[] | undefined {
    if (!this.hasVertex(from) || !this.hasVertex(to)) {
      return undefined;
    }

    if (from === to) {
      return [from];
    }

    const visited = new Set<T>();
    const queue = new Queue<T>();
    queue.enqueue(from);
    const parent = new Map<T, T>();
    visited.add(from);

    while (!queue.isEmpty()) {
      const vertex = queue.dequeue()!;
      const neighbors = this.getNeighbors(vertex);

      for (const { target } of neighbors) {
        if (!visited.has(target)) {
          visited.add(target);
          parent.set(target, vertex);
          queue.enqueue(target);

          if (target === to) {
            const path: T[] = [];
            let current: T | undefined = to;
            while (current !== undefined) {
              path.unshift(current);
              current = parent.get(current);
            }
            return path;
          }
        }
      }
    }

    return undefined;
  }

  /**
   * Finds the shortest weighted path between two vertices using Dijkstra's algorithm.
   * Edge weights default to 1 if not specified. Does not work with negative weights.
   *
   * @param from - The source vertex
   * @param to - The target vertex
   * @returns An object with the path and total distance, or undefined if no path exists
   * @complexity O((V + E) log V) using a priority queue
   */
  findShortestPathWeighted(
    from: T,
    to: T,
  ): { path: T[]; distance: number } | undefined {
    if (!this.hasVertex(from) || !this.hasVertex(to)) {
      return undefined;
    }

    if (from === to) {
      return { path: [from], distance: 0 };
    }

    // Dijkstra's algorithm with priority queue
    const distances = new Map<T, number>();
    const previous = new Map<T, T | undefined>();
    const pq = new PriorityQueue<T>();

    // Initialize distances
    for (const vertex of this.getAllVertices()) {
      const distance = vertex === from ? 0 : Infinity;
      distances.set(vertex, distance);
      previous.set(vertex, undefined);
      pq.enqueue(vertex, distance);
    }

    while (!pq.isEmpty()) {
      const current = pq.dequeue()!;
      const currentDist = distances.get(current)!;

      // If we reached the target, we can stop
      if (current === to) {
        break;
      }

      // Skip if we've already found a better path
      if (currentDist === Infinity) {
        break;
      }

      // Update distances to neighbors
      const neighbors = this.getNeighbors(current);
      for (const { target, weight } of neighbors) {
        const edgeWeight = weight ?? 1; // Default weight is 1
        const newDistance = currentDist + edgeWeight;
        const oldDistance = distances.get(target)!;

        if (newDistance < oldDistance) {
          distances.set(target, newDistance);
          previous.set(target, current);
          pq.updatePriority(target, newDistance);
        }
      }
    }

    // Check if path exists
    const finalDistance = distances.get(to)!;
    if (finalDistance === Infinity) {
      return undefined;
    }

    // Reconstruct path
    const path: T[] = [];
    let current: T | undefined = to;
    while (current !== undefined) {
      path.unshift(current);
      current = previous.get(current);
    }

    return { path, distance: finalDistance };
  }

  /**
   * Finds the shortest weighted path using Bellman-Ford algorithm.
   * Works with negative edge weights and can detect negative cycles.
   *
   * @param from - The source vertex
   * @param to - The target vertex
   * @returns Object with path and distance, undefined if no path exists, or object indicating negative cycle
   * @complexity O(V * E) where V is the number of vertices and E is the number of edges
   */
  findShortestPathBellmanFord(
    from: T,
    to: T,
  ):
    | { path: T[]; distance: number; hasNegativeCycle: false }
    | { hasNegativeCycle: true }
    | undefined {
    if (!this.hasVertex(from) || !this.hasVertex(to)) {
      return undefined;
    }

    if (from === to) {
      return { path: [from], distance: 0, hasNegativeCycle: false };
    }

    const vertices = this.getAllVertices();
    const distances = new Map<T, number>();
    const previous = new Map<T, T | undefined>();

    // Initialize distances
    for (const vertex of vertices) {
      distances.set(vertex, vertex === from ? 0 : Infinity);
      previous.set(vertex, undefined);
    }

    // Relax edges V-1 times
    for (let i = 0; i < vertices.length - 1; i++) {
      let updated = false;

      for (const [source, edges] of this.adjacencyList) {
        const sourceDist = distances.get(source)!;

        // Skip if source is unreachable
        if (sourceDist === Infinity) continue;

        for (const { target, weight } of edges) {
          const edgeWeight = weight ?? 1;
          const newDistance = sourceDist + edgeWeight;

          if (newDistance < distances.get(target)!) {
            distances.set(target, newDistance);
            previous.set(target, source);
            updated = true;
          }
        }
      }

      // Early termination if no updates in this iteration
      if (!updated) break;
    }

    // Check for negative cycles
    for (const [source, edges] of this.adjacencyList) {
      const sourceDist = distances.get(source)!;

      if (sourceDist === Infinity) continue;

      for (const { target, weight } of edges) {
        const edgeWeight = weight ?? 1;
        const newDistance = sourceDist + edgeWeight;

        if (newDistance < distances.get(target)!) {
          // Negative cycle detected
          return { hasNegativeCycle: true };
        }
      }
    }

    // Check if path exists to target
    const finalDistance = distances.get(to)!;
    if (finalDistance === Infinity) {
      return undefined;
    }

    // Reconstruct path
    const path: T[] = [];
    let current: T | undefined = to;
    while (current !== undefined) {
      path.unshift(current);
      current = previous.get(current);
    }

    return { path, distance: finalDistance, hasNegativeCycle: false };
  }

  /**
   * Computes shortest paths between all pairs of vertices using Floyd-Warshall algorithm.
   * Handles weighted edges (defaults to 1 if not specified).
   *
   * @returns A map where distances.get(u).get(v) gives the shortest distance from u to v
   * @complexity O(V³) where V is the number of vertices
   */
  getAllPairsShortestPaths(): Map<T, Map<T, number>> {
    // Floyd-Warshall algorithm
    const vertices = this.getAllVertices();
    const dist = new Map<T, Map<T, number>>();

    // Initialize distances
    for (const u of vertices) {
      const row = new Map<T, number>();

      for (const v of vertices) {
        if (u === v) {
          row.set(v, 0);
        } else {
          row.set(v, Infinity);
        }
      }

      dist.set(u, row);
    }

    // Set edge weights
    for (const [u, edges] of this.adjacencyList) {
      for (const { target: v, weight } of edges) {
        dist.get(u)!.set(v, weight ?? 1);
      }
    }

    // Floyd-Warshall main loop
    for (const k of vertices) {
      for (const i of vertices) {
        for (const j of vertices) {
          const distIK = dist.get(i)!.get(k)!;
          const distKJ = dist.get(k)!.get(j)!;
          const distIJ = dist.get(i)!.get(j)!;

          if (distIK + distKJ < distIJ) {
            dist.get(i)!.set(j, distIK + distKJ);
          }
        }
      }
    }

    return dist;
  }

  /**
   * Creates a deep copy of the graph with all vertices, edges, and weights.
   *
   * @returns A new DirectedGraph instance with the same structure
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  clone(): DirectedGraph<T> {
    const cloned = new DirectedGraph<T>();

    // Add all vertices
    for (const vertex of this.getAllVertices()) {
      cloned.addVertex(vertex);
    }

    // Add all edges with weights
    for (const [source, edges] of this.adjacencyList) {
      for (const { target, weight } of edges) {
        cloned.addEdge(source, target, weight);
      }
    }

    return cloned;
  }

  /**
   * Returns a string representation of the graph showing all vertices and their edges.
   *
   * @returns A formatted string representation
   * @complexity O(V + E) where V is the number of vertices and E is the number of edges
   */
  toString(): string {
    let result = 'DirectedGraph:\n';
    for (const [vertex, edges] of this.adjacencyList) {
      const edgeStr = edges
        .map(
          (e) => `${e.target}${e.weight !== undefined ? `(${e.weight})` : ''}`,
        )
        .join(', ');
      result += `  ${vertex} -> [${edgeStr}]\n`;
    }
    return result;
  }

  /**
   * Makes the graph iterable using for...of loops.
   * Each iteration yields a tuple of [vertex, edges] where edges is a copy of the edge array.
   *
   * @example
   * for (const [vertex, edges] of graph) {
   *   console.log(`${vertex} has ${edges.length} outgoing edges`);
   * }
   *
   * @complexity O(1) per iteration, O(V) for complete iteration
   */
  *[Symbol.iterator](): Iterator<[T, Edge<T>[]]> {
    for (const [vertex, edges] of this.adjacencyList) {
      // Return a copy of edges to prevent external modification
      yield [vertex, [...edges]];
    }
  }
}

export default DirectedGraph;
