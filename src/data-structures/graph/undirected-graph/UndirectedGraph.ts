import PriorityQueue from '../../priority-queue/PriorityQueue';
import Queue from '../../queue/list-queue/Queue';
import UnionFind from '../../union-find/UnionFind';

/**
 * Represents an edge in the graph with an optional weight.
 */
interface Edge<T> {
  target: T;
  weight?: number;
}

/**
 * Generic undirected graph implementation using adjacency list representation.
 * Supports weighted and unweighted edges, various traversal algorithms, and graph analysis.
 *
 * @template T The type of vertices in the graph
 */
class UndirectedGraph<T> {
  private adjacencyList: Map<T, Edge<T>[]>;
  private _edgeCount: number;

  /**
   * Creates a new empty undirected graph.
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  constructor() {
    this.adjacencyList = new Map();
    this._edgeCount = 0;
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
   * Adds an undirected edge between two vertices with an optional weight.
   * Updates weight if edge already exists.
   *
   * @param vertex1 - First vertex
   * @param vertex2 - Second vertex
   * @param weight - Optional edge weight
   * @throws {Error} If either vertex doesn't exist
   *
   * @timeComplexity O(E) where E is the number of edges from a vertex (due to findIndex)
   * @spaceComplexity O(1)
   */
  addEdge(vertex1: T, vertex2: T, weight?: number): void {
    if (!this.hasVertex(vertex1)) {
      throw new Error(`Vertex "${vertex1}" does not exist. Add it first.`);
    }
    if (!this.hasVertex(vertex2)) {
      throw new Error(`Vertex "${vertex2}" does not exist. Add it first.`);
    }

    // Add edge from vertex1 to vertex2
    const edges1 = this.adjacencyList.get(vertex1)!;
    const existingIndex1 = edges1.findIndex((e) => e.target === vertex2);
    const isNewEdge = existingIndex1 === -1;

    if (existingIndex1 !== -1) {
      edges1[existingIndex1].weight = weight;
    } else {
      edges1.push({ target: vertex2, weight });
    }

    // Add edge from vertex2 to vertex1 (undirected)
    const edges2 = this.adjacencyList.get(vertex2)!;
    const existingIndex2 = edges2.findIndex((e) => e.target === vertex1);

    if (existingIndex2 !== -1) {
      edges2[existingIndex2].weight = weight;
    } else {
      edges2.push({ target: vertex1, weight });
    }

    if (isNewEdge) {
      this._edgeCount++;
    }
  }

  /**
   * Removes a vertex and all its incident edges from the graph.
   *
   * @param vertex - The vertex to remove
   * @returns True if vertex was removed, false if it didn't exist
   *
   * @timeComplexity O(V + E) where V is vertices and E is edges
   * @spaceComplexity O(1)
   */
  removeVertex(vertex: T): boolean {
    if (!this.hasVertex(vertex)) return false;

    // Count edges to be removed
    const edges = this.adjacencyList.get(vertex)!;
    this._edgeCount -= edges.length;

    // Remove the vertex
    this.adjacencyList.delete(vertex);

    // Remove all edges pointing to this vertex
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, edgeList] of this.adjacencyList) {
      const index = edgeList.findIndex((e) => e.target === vertex);
      if (index !== -1) {
        edgeList.splice(index, 1);
      }
    }

    return true;
  }

  /**
   * Removes an undirected edge between two vertices.
   *
   * @param vertex1 - First vertex
   * @param vertex2 - Second vertex
   * @returns True if edge was removed, false if it didn't exist
   *
   * @timeComplexity O(E) where E is the number of edges from a vertex
   * @spaceComplexity O(1)
   */
  removeEdge(vertex1: T, vertex2: T): boolean {
    const edges1 = this.adjacencyList.get(vertex1);
    const edges2 = this.adjacencyList.get(vertex2);

    if (!edges1 || !edges2) return false;

    const index1 = edges1.findIndex((edge) => edge.target === vertex2);
    const index2 = edges2.findIndex((edge) => edge.target === vertex1);

    if (index1 === -1 || index2 === -1) return false;

    edges1.splice(index1, 1);
    edges2.splice(index2, 1);
    this._edgeCount--;

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
   * Checks if an edge exists between two vertices.
   *
   * @param vertex1 - First vertex
   * @param vertex2 - Second vertex
   * @returns True if edge exists
   *
   * @timeComplexity O(E) where E is the number of edges from vertex1
   * @spaceComplexity O(1)
   */
  hasEdge(vertex1: T, vertex2: T): boolean {
    const edges = this.adjacencyList.get(vertex1);

    return edges ? edges.some((edge) => edge.target === vertex2) : false;
  }

  /**
   * Gets all neighbors of a vertex.
   *
   * @param vertex - The vertex to get neighbors for
   * @returns Array of edges to neighboring vertices
   * @throws {Error} If vertex doesn't exist
   *
   * @timeComplexity O(E) where E is the number of edges from the vertex
   * @spaceComplexity O(E)
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
   * @param vertex1 - First vertex
   * @param vertex2 - Second vertex
   * @returns The edge weight, or undefined if edge doesn't exist
   *
   * @timeComplexity O(E) where E is the number of edges from vertex1
   * @spaceComplexity O(1)
   */
  getEdgeWeight(vertex1: T, vertex2: T): number | undefined {
    const edges = this.adjacencyList.get(vertex1);
    const edge = edges?.find((e) => e.target === vertex2);

    return edge?.weight;
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
   * Gets the number of edges in the graph.
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  get edgeCount(): number {
    return this._edgeCount;
  }

  /**
   * Gets all edges in the graph (each edge listed once).
   *
   * @returns Array of edges with from, to, and weight
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(E)
   */
  getAllEdges(): Array<{ from: T; to: T; weight: number }> {
    const edges: Array<{ from: T; to: T; weight: number }> = [];
    const processedPairs = new Set<string>();

    for (const [vertex, edgeList] of this.adjacencyList) {
      for (const { target, weight } of edgeList) {
        const pairKey = this.createEdgeKey(vertex, target);

        if (!processedPairs.has(pairKey)) {
          processedPairs.add(pairKey);
          edges.push({ from: vertex, to: target, weight: weight ?? 1 });
        }
      }
    }

    return edges;
  }

  /**
   * Gets the degree (number of edges) of a vertex.
   *
   * @param vertex - The vertex to check
   * @returns The degree of the vertex
   * @throws {Error} If vertex doesn't exist
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  getDegree(vertex: T): number {
    if (!this.hasVertex(vertex)) {
      throw new Error(`Vertex "${vertex}" does not exist.`);
    }

    return this.adjacencyList.get(vertex)!.length;
  }

  /**
   * Gets the density of the graph (ratio of actual edges to possible edges).
   *
   * @returns Graph density between 0 and 1
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  getDensity(): number {
    const v = this.vertexCount;

    if (v <= 1) return 0;

    const maxEdges = (v * (v - 1)) / 2;

    return this._edgeCount / maxEdges;
  }

  /**
   * Checks if the graph is a tree (connected and acyclic with V-1 edges).
   *
   * @returns True if the graph is a tree
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V)
   */
  isTree(): boolean {
    if (this.vertexCount === 0) return false;
    if (this._edgeCount !== this.vertexCount - 1) return false;

    return this.isConnected() && !this.hasCycle();
  }

  /**
   * Removes all vertices and edges from the graph.
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  clear(): void {
    this.adjacencyList.clear();
    this._edgeCount = 0;
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
   * Detects if the graph contains a cycle.
   *
   * @returns True if graph contains a cycle
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V) for recursion stack and visited set
   */
  hasCycle(): boolean {
    const visited = new Set<T>();

    const dfs = (vertex: T, parent: T | null): boolean => {
      visited.add(vertex);

      const neighbors = this.getNeighbors(vertex);

      for (const { target } of neighbors) {
        if (!visited.has(target)) {
          if (dfs(target, vertex)) return true;
        } else if (target !== parent) {
          return true; // Back edge found - cycle detected
        }
      }

      return false;
    };

    for (const vertex of this.getAllVertices()) {
      if (!visited.has(vertex)) {
        if (dfs(vertex, null)) return true;
      }
    }

    return false;
  }

  /**
   * Checks if a path exists between two vertices.
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
   * Finds the shortest weighted path between two vertices using Dijkstra's algorithm.
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
   * Gets all connected components in the graph.
   *
   * @returns Array of components, where each component is an array of vertices
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V)
   */
  getConnectedComponents(): T[][] {
    const visited = new Set<T>();
    const components: T[][] = [];

    const dfs = (vertex: T, component: T[]): void => {
      visited.add(vertex);
      component.push(vertex);

      const neighbors = this.getNeighbors(vertex);
      for (const { target } of neighbors) {
        if (!visited.has(target)) {
          dfs(target, component);
        }
      }
    };

    for (const vertex of this.getAllVertices()) {
      if (!visited.has(vertex)) {
        const component: T[] = [];
        dfs(vertex, component);
        components.push(component);
      }
    }

    return components;
  }

  /**
   * Checks if the graph is connected (single component).
   *
   * @returns True if graph is connected
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V)
   */
  isConnected(): boolean {
    if (this.vertexCount === 0) return true;
    const components = this.getConnectedComponents();

    return components.length === 1;
  }

  /**
   * Finds a minimum spanning tree using Prim's algorithm.
   *
   * @param startVertex - Optional starting vertex
   * @returns Object with MST edges and total weight, or undefined if graph is disconnected
   * @throws {Error} If specified start vertex doesn't exist
   *
   * @timeComplexity O((V + E) log V)
   * @spaceComplexity O(V)
   */
  findMinimumSpanningTree(
    startVertex?: T,
  ):
    | { edges: Array<{ from: T; to: T; weight: number }>; totalWeight: number }
    | undefined {
    if (this.vertexCount === 0) {
      return { edges: [], totalWeight: 0 };
    }

    const start = startVertex ?? this.getAllVertices()[0];
    if (!this.hasVertex(start)) {
      throw new Error(`Start vertex "${start}" does not exist.`);
    }

    const visited = new Set<T>();
    const mstEdges: Array<{ from: T; to: T; weight: number }> = [];
    const pq = new PriorityQueue<{
      vertex: T;
      from: T | null;
      weight: number;
    }>();
    let totalWeight = 0;

    pq.enqueue({ vertex: start, from: null, weight: 0 }, 0);

    while (!pq.isEmpty()) {
      const { vertex, from, weight } = pq.dequeue()!;

      if (visited.has(vertex)) continue;

      visited.add(vertex);

      if (from !== null) {
        mstEdges.push({ from, to: vertex, weight });
        totalWeight += weight;
      }

      const neighbors = this.getNeighbors(vertex);
      for (const { target, weight: edgeWeight } of neighbors) {
        if (!visited.has(target)) {
          const w = edgeWeight ?? 1;
          pq.enqueue({ vertex: target, from: vertex, weight: w }, w);
        }
      }
    }

    if (visited.size !== this.vertexCount) {
      return undefined;
    }

    return { edges: mstEdges, totalWeight };
  }

  /**
   * Finds a minimum spanning tree using Kruskal's algorithm with Union-Find.
   * More efficient for sparse graphs.
   *
   * @returns Object with MST edges and total weight, or undefined if graph is disconnected
   *
   * @timeComplexity O(E log E) for sorting edges
   * @spaceComplexity O(V + E)
   */
  findMinimumSpanningTreeKruskal():
    | { edges: Array<{ from: T; to: T; weight: number }>; totalWeight: number }
    | undefined {
    if (this.vertexCount === 0) {
      return { edges: [], totalWeight: 0 };
    }

    // Get all edges
    const allEdges = this.getAllEdges();

    // Sort edges by weight
    allEdges.sort((a, b) => a.weight - b.weight);

    // Create vertex-to-index mapping for UnionFind
    const vertices = this.getAllVertices();
    const vertexToIndex = new Map<T, number>();
    const indexToVertex = new Map<number, T>();

    vertices.forEach((vertex, index) => {
      vertexToIndex.set(vertex, index);
      indexToVertex.set(index, vertex);
    });

    // Initialize Union-Find
    const uf = new UnionFind(this.vertexCount);
    const mstEdges: Array<{ from: T; to: T; weight: number }> = [];
    let totalWeight = 0;

    // Process edges in order of weight
    for (const edge of allEdges) {
      const idx1 = vertexToIndex.get(edge.from)!;
      const idx2 = vertexToIndex.get(edge.to)!;

      // If vertices are in different components, add edge to MST
      if (!uf.isConnected(idx1, idx2)) {
        uf.union(idx1, idx2);
        mstEdges.push(edge);
        totalWeight += edge.weight;

        // Early termination when MST is complete
        if (mstEdges.length === this.vertexCount - 1) break;
      }
    }

    // Check if MST is complete (graph was connected)
    if (mstEdges.length !== this.vertexCount - 1) {
      return undefined;
    }

    return { edges: mstEdges, totalWeight };
  }

  /**
   * Checks if the graph is bipartite (2-colorable).
   *
   * @returns Object with two sets if bipartite, undefined if not
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V)
   */
  isBipartite(): { setA: T[]; setB: T[] } | undefined {
    if (this.vertexCount === 0) {
      return { setA: [], setB: [] };
    }

    const color = new Map<T, 0 | 1>();

    const bfs = (start: T): boolean => {
      const queue = new Queue<T>();
      queue.enqueue(start);
      color.set(start, 0);

      while (!queue.isEmpty()) {
        const vertex = queue.dequeue()!;
        const currentColor = color.get(vertex)!;
        const nextColor = (1 - currentColor) as 0 | 1;

        const neighbors = this.getNeighbors(vertex);
        for (const { target } of neighbors) {
          if (!color.has(target)) {
            color.set(target, nextColor);
            queue.enqueue(target);
          } else if (color.get(target) === currentColor) {
            return false; // Adjacent vertices have same color
          }
        }
      }

      return true;
    };

    // Check all components
    for (const vertex of this.getAllVertices()) {
      if (!color.has(vertex)) {
        if (!bfs(vertex)) {
          return undefined;
        }
      }
    }

    // Separate vertices into two sets
    const setA: T[] = [];
    const setB: T[] = [];

    for (const [vertex, c] of color) {
      if (c === 0) {
        setA.push(vertex);
      } else {
        setB.push(vertex);
      }
    }

    return { setA, setB };
  }

  /**
   * Creates a deep copy of the graph.
   *
   * @returns A new graph with the same vertices and edges
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V + E)
   */
  clone(): UndirectedGraph<T> {
    const cloned = new UndirectedGraph<T>();

    for (const vertex of this.getAllVertices()) {
      cloned.addVertex(vertex);
    }

    const processedPairs = new Set<string>();

    for (const [source, edges] of this.adjacencyList) {
      for (const { target, weight } of edges) {
        const pairKey = this.createEdgeKey(source, target);
        if (!processedPairs.has(pairKey)) {
          processedPairs.add(pairKey);
          cloned.addEdge(source, target, weight);
        }
      }
    }

    return cloned;
  }

  /**
   * Returns a string representation of the graph.
   *
   * @returns String showing all vertices and their edges
   *
   * @timeComplexity O(V + E)
   * @spaceComplexity O(V + E)
   */
  toString(): string {
    let result = 'UndirectedGraph:\n';

    for (const [vertex, edges] of this.adjacencyList) {
      const edgeStr = edges
        .map(
          (e) => `${e.target}${e.weight !== undefined ? `(${e.weight})` : ''}`,
        )
        .join(', ');
      result += `  ${vertex} -- [${edgeStr}]\n`;
    }

    return result;
  }

  /**
   * Creates a consistent key for an edge regardless of vertex order.
   *
   * @param v1 - First vertex
   * @param v2 - Second vertex
   * @returns A string key representing the edge
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  private createEdgeKey(v1: T, v2: T): string {
    return [v1, v2].sort().join('|');
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
      yield [vertex, [...edges]];
    }
  }
}

export default UndirectedGraph;
