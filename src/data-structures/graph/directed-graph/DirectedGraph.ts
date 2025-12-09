import PriorityQueue from '../../priority-queue/PriorityQueue';
import Queue from '../../queue/list-queue/Queue';

/**
 * Represents a directed edge in the graph with an optional weight.
 */
interface Edge<T> {
  target: T;
  weight?: number;
}

/**
 * Generic directed graph implementation using adjacency list representation.
 * Supports weighted and unweighted edges, various traversal algorithms, and graph analysis.
 *
 * @template T The type of vertices in the graph
 */
class DirectedGraph<T> {
  private adjacencyList: Map<T, Edge<T>[]>;

  /**
   * Creates a new empty directed graph.
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  constructor() {
    this.adjacencyList = new Map();
  }

  /**
   * Adds a vertex to the graph if it doesn't already exist.
   *
   * @param vertex - The vertex to add
   *
   * @timeComplexity O(1) average case for Map operations
   * @spaceComplexity O(1)
   */
  addVertex(vertex: T): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  /**
   * Adds a directed edge from one vertex to another with an optional weight.
   * Updates weight if edge already exists.
   *
   * @param from - Source vertex
   * @param to - Target vertex
   * @param weight - Optional edge weight
   * @throws {Error} If either vertex doesn't exist
   *
   * @timeComplexity O(E) where E is the number of edges from source vertex (due to findIndex)
   * @spaceComplexity O(1)
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
   * Removes a vertex and all edges connected to it (incoming and outgoing).
   *
   * @param vertex - The vertex to remove
   * @returns True if vertex was removed, false if it didn't exist
   * @timeComplexity O(V + E) where V is vertices and E is total edges
   * @spaceComplexity O(E) in worst case
   */
  removeVertex(vertex: T): boolean {
    if (!this.hasVertex(vertex)) return false;

    this.adjacencyList.delete(vertex);

    for (const [v, edges] of this.adjacencyList) {
      const filtered = edges.filter((e) => e.target !== vertex);
      // Only update if something was actually removed
      if (filtered.length !== edges.length) {
        this.adjacencyList.set(v, filtered);
      }
    }

    return true;
  }

  /**
   * Removes a directed edge from one vertex to another.
   *
   * @param from - Source vertex
   * @param to - Target vertex
   * @returns True if edge was removed, false if it didn't exist
   *
   * @timeComplexity O(E) where E is the number of edges from source vertex
   * @spaceComplexity O(1)
   */
  removeEdge(from: T, to: T): boolean {
    const edges = this.adjacencyList.get(from);
    if (!edges) return false;

    const index = edges.findIndex((edge) => edge.target === to);
    if (index === -1) return false;

    edges.splice(index, 1);

    return true;
  }

  /**
   * Checks if a vertex exists in the graph.
   *
   * @param vertex - The vertex to check
   * @returns True if vertex exists
   *
   * @timeComplexity O(1) average case
   * @spaceComplexity O(1)
   */
  hasVertex(vertex: T): boolean {
    return this.adjacencyList.has(vertex);
  }

  /**
   * Checks if a directed edge exists from one vertex to another.
   *
   * @param from - Source vertex
   * @param to - Target vertex
   * @returns True if edge exists
   *
   * @timeComplexity O(E) where E is the number of edges from source vertex
   * @spaceComplexity O(1)
   */
  hasEdge(from: T, to: T): boolean {
    const edges = this.adjacencyList.get(from);

    return edges ? edges.some((edge) => edge.target === to) : false;
  }

  /**
   * Gets all outgoing neighbors of a vertex.
   *
   * @param vertex - The vertex to get neighbors for
   * @returns Array of edges to neighboring vertices
   * @throws {Error} If vertex doesn't exist
   *
   * @timeComplexity O(E) where E is the number of outgoing edges from the vertex
   * @spaceComplexity O(E)
   */
  getNeighbors(vertex: T): Edge<T>[] {
    if (!this.hasVertex(vertex)) {
      throw new Error(`Vertex "${vertex}" does not exist.`);
    }

    return [...this.adjacencyList.get(vertex)!];
  }

  /**
   * Gets the weight of a directed edge between two vertices.
   *
   * @param from - Source vertex
   * @param to - Target vertex
   * @returns The edge weight, or undefined if edge doesn't exist
   *
   * @timeComplexity O(E) where E is the number of edges from source vertex
   * @spaceComplexity O(1)
   */
  getEdgeWeight(from: T, to: T): number | undefined {
    const edges = this.adjacencyList.get(from);
    const edge = edges?.find((e) => e.target === to);

    return edge?.weight;
  }

  /**
   * Gets all vertices in the graph.
   *
   * @returns Array of all vertices
   *
   * @timeComplexity O(V) where V is the number of vertices
   * @spaceComplexity O(V)
   */
  getAllVertices(): T[] {
    return Array.from(this.adjacencyList.keys());
  }

  /**
   * Gets the number of vertices in the graph.
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  get vertexCount(): number {
    return this.adjacencyList.size;
  }

  /**
   * Gets the total number of directed edges in the graph.
   *
   * @timeComplexity O(V) where V is the number of vertices
   * @spaceComplexity O(1)
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
   * @returns The out-degree of the vertex
   * @throws {Error} If vertex doesn't exist
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
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
   * @returns The in-degree of the vertex
   * @throws {Error} If vertex doesn't exist
   *
   * @timeComplexity O(V + E) where V is vertices and E is total edges
   * @spaceComplexity O(1)
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
   * Gets all source vertices (vertices with no incoming edges).
   *
   * @returns Array of source vertices
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V)
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
   * Gets all sink vertices (vertices with no outgoing edges).
   *
   * @returns Array of sink vertices
   *
   * @timeComplexity O(V)
   * @spaceComplexity O(V) for result array
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
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  clear(): void {
    this.adjacencyList.clear();
  }

  /**
   * Performs breadth-first search and returns vertices in BFS order.
   *
   * @param startVertex - The vertex to start BFS from
   * @returns Array of vertices in BFS order
   * @throws {Error} If start vertex doesn't exist
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V)
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
   * Performs depth-first search and returns vertices in DFS order.
   *
   * @param startVertex - The vertex to start DFS from
   * @returns Array of vertices in DFS order
   * @throws {Error} If start vertex doesn't exist
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V)
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
   * Traverses the graph using BFS and calls a callback for each vertex.
   *
   * @param startVertex - The vertex to start from
   * @param callback - Function to call for each visited vertex
   * @throws {Error} If start vertex doesn't exist
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V)
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
   * Traverses the graph using DFS and calls a callback for each vertex.
   *
   * @param startVertex - The vertex to start from
   * @param callback - Function to call for each visited vertex
   * @throws {Error} If start vertex doesn't exist
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V)
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
   * Detects if the directed graph contains a cycle using DFS with color marking.
   *
   * @returns True if graph contains a cycle
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V) for recursion stack and color sets
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
        if (gray.has(target)) return true; // Back edge found
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
   * @returns True if graph has no cycles
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V)
   */
  isDAG(): boolean {
    return !this.hasCycle();
  }

  /**
   * Performs topological sort using Kahn's algorithm (BFS-based).
   * Only works on DAGs.
   *
   * @returns Array of vertices in topological order, or undefined if graph has cycles
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V)
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
   * Performs topological sort using DFS-based algorithm.
   * Only works on DAGs.
   *
   * @returns Array of vertices in topological order, or undefined if graph has cycles
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V) for recursion stack and visited set
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
   * Creates a transposed graph (all edges reversed).
   *
   * @returns New graph with all edge directions reversed
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V + E)
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
   * A strongly connected component is a maximal set of vertices where every
   * vertex is reachable from every other vertex.
   *
   * @returns Array of components, where each component is an array of vertices
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V + E) for transposed graph and auxiliary structures
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
   * Checks if a directed path exists between two vertices.
   *
   * @param from - Starting vertex
   * @param to - Target vertex
   * @returns True if path exists
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V)
   */
  hasPath(from: T, to: T): boolean {
    if (!this.hasVertex(from) || !this.hasVertex(to)) {
      return false;
    }

    if (from === to) return true;

    const visited = new Set<T>();
    const queue = new Queue<T>();

    queue.enqueue(from);
    visited.add(from);

    while (!queue.isEmpty()) {
      const vertex = queue.dequeue()!;

      if (vertex === to) return true;

      const neighbors = this.getNeighbors(vertex);

      for (const { target } of neighbors) {
        if (!visited.has(target)) {
          visited.add(target);
          queue.enqueue(target);
        }
      }
    }

    return false;
  }

  /**
   * Finds the shortest path between two vertices (unweighted - minimum hops).
   *
   * @param from - Starting vertex
   * @param to - Target vertex
   * @returns Array of vertices in the path, or undefined if no path exists
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V)
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
   * Finds the shortest weighted path using Dijkstra's algorithm.
   * Works only with non-negative edge weights.
   *
   * @param from - Starting vertex
   * @param to - Target vertex
   * @returns Object with path and distance, or undefined if no path exists
   *
   * @timeComplexity O((V + E) log V) with priority queue
   * @spaceComplexity O(V)
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

      if (current === to) break;

      if (currentDist === Infinity) break;

      const neighbors = this.getNeighbors(current);
      for (const { target, weight } of neighbors) {
        const edgeWeight = weight ?? 1;
        const newDistance = currentDist + edgeWeight;
        const oldDistance = distances.get(target)!;

        if (newDistance < oldDistance) {
          distances.set(target, newDistance);
          previous.set(target, current);
          pq.updatePriority(target, newDistance);
        }
      }
    }

    const finalDistance = distances.get(to)!;
    if (finalDistance === Infinity) return undefined;

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
   * Works with negative edge weights and detects negative cycles.
   *
   * @param from - Starting vertex
   * @param to - Target vertex
   * @returns Object with path and distance, or indication of negative cycle, or undefined if no path
   *
   * @timeComplexity O(V * E)
   * @spaceComplexity O(V)
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
          return { hasNegativeCycle: true };
        }
      }
    }

    const finalDistance = distances.get(to)!;
    if (finalDistance === Infinity) {
      return undefined;
    }

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
   *
   * @returns Map where distances[u][v] is the shortest distance from u to v
   *
   * @timeComplexity O(V³)
   * @spaceComplexity O(V²)
   */
  getAllPairsShortestPaths(): Map<T, Map<T, number>> {
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
   * Creates a deep copy of the directed graph.
   *
   * @returns A new graph with the same vertices and edges
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V + E)
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
   * Returns a string representation of the directed graph.
   *
   * @returns String showing all vertices and their outgoing edges
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V + E)
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
   * Allows iteration over the graph using for...of loops.
   *
   * @yields Tuples of [vertex, edges[]]
   *
   * @timeComplexity O(1) per iteration
   * @spaceComplexity O(E) for copying edge arrays
   */
  *[Symbol.iterator](): Iterator<[T, Edge<T>[]]> {
    for (const [vertex, edges] of this.adjacencyList) {
      // Return a copy of edges to prevent external modification
      yield [vertex, [...edges]];
    }
  }
}

export default DirectedGraph;
