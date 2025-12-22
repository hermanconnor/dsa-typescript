import Queue from '../../queue/list-queue/Queue';

/**
 * An undirected graph implementation using an adjacency matrix representation.
 * In an undirected graph, edges are bidirectional - if there's an edge between
 * vertices u and v, you can traverse from u to v and from v to u.
 * @example
 * ```typescript
 * const graph = new UndirectedGraph(4);
 * graph.addEdge(0, 1, 5);  // Creates edge in both directions
 * graph.addEdge(1, 2, 3);
 * console.log(graph.bfs(0)); // [0, 1, 2]
 * console.log(graph.hasEdge(1, 0)); // true (bidirectional)
 * ```
 */
class UndirectedMatrixGraph {
  private matrix: number[][];
  private vertices: number;

  /**
   * Creates a new undirected graph with the specified number of vertices.
   *
   * @param numVertices - The number of vertices in the graph (must be positive)
   * @throws {Error} If numVertices is not a positive integer
   *
   * @timeComplexity O(V²) where V is the number of vertices
   * @spaceComplexity O(V²) for the adjacency matrix
   */
  constructor(numVertices: number) {
    this.vertices = numVertices;
    this.matrix = Array.from({ length: numVertices }, () =>
      Array(numVertices).fill(0),
    );
  }

  /**
   * Validates if a vertex index is within the valid range.
   */
  private isValidVertex(vertex: number): boolean {
    return vertex >= 0 && vertex < this.vertices;
  }

  /**
   * Adds an undirected edge between two vertices with an optional weight.
   * The edge is added in both directions (u -> v and v -> u).
   * If an edge already exists, it will be overwritten with the new weight.
   *
   * @param u - The first vertex index
   * @param v - The second vertex index
   * @param weight - The weight of the edge (default: 1)
   * @throws {Error} If u or v are invalid vertex indices
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  addEdge(u: number, v: number, weight: number = 1): void {
    if (this.isValidVertex(u) && this.isValidVertex(v)) {
      this.matrix[u][v] = weight;
      this.matrix[v][u] = weight; // Undirected: add edge in both directions
    } else {
      throw new Error('Invalid vertex index');
    }
  }

  /**
   * Removes the undirected edge between two vertices.
   * The edge is removed in both directions.
   *
   * @param u - The first vertex index
   * @param v - The second vertex index
   * @throws {Error} If u or v are invalid vertex indices
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  removeEdge(u: number, v: number): void {
    if (this.isValidVertex(u) && this.isValidVertex(v)) {
      this.matrix[u][v] = 0;
      this.matrix[v][u] = 0; // Undirected: remove edge in both directions
    } else {
      throw new Error('Invalid vertex index');
    }
  }

  /**
   * Checks if an edge exists between two vertices.
   * Since the graph is undirected, hasEdge(u, v) === hasEdge(v, u).
   *
   * @param u - The first vertex index
   * @param v - The second vertex index
   * @returns True if an edge exists, false otherwise
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  hasEdge(u: number, v: number): boolean {
    if (this.isValidVertex(u) && this.isValidVertex(v)) {
      return this.matrix[u][v] !== 0;
    }

    return false;
  }

  /**
   * Returns the weight of the edge between two vertices.
   *
   * @param u - The first vertex index
   * @param v - The second vertex index
   * @returns The weight of the edge (0 if no edge exists)
   * @throws {Error} If u or v are invalid vertex indices
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  getWeight(u: number, v: number): number {
    if (this.isValidVertex(u) && this.isValidVertex(v)) {
      return this.matrix[u][v];
    }
    throw new Error('Invalid vertex index');
  }

  /**
   * Returns all vertices adjacent to the given vertex.
   *
   * @param vertex - The vertex index to get neighbors for
   * @returns An array of neighbor vertex indices
   * @throws {Error} If vertex is an invalid index
   *
   * @timeComplexity O(V) where V is the number of vertices
   * @spaceComplexity O(V) in worst case when vertex connects to all other vertices
   */
  getNeighbors(vertex: number): number[] {
    if (!this.isValidVertex(vertex)) {
      throw new Error('Invalid vertex index');
    }

    const neighbors: number[] = [];
    for (let i = 0; i < this.vertices; i++) {
      if (this.matrix[vertex][i] !== 0) {
        neighbors.push(i);
      }
    }

    return neighbors;
  }

  /**
   * Calculates the degree of a vertex (number of edges connected to it).
   * In an undirected graph, in-degree equals out-degree, so we just have "degree".
   *
   * @param vertex - The vertex index
   * @returns The number of edges connected to this vertex
   * @throws {Error} If vertex is an invalid index
   *
   * @timeComplexity O(V) where V is the number of vertices
   * @spaceComplexity O(1)
   *
   * @remarks
   * For self-loops (edge from vertex to itself), it counts as degree 2
   * in graph theory, but this implementation counts it as 1.
   */
  getDegree(vertex: number): number {
    if (!this.isValidVertex(vertex)) {
      throw new Error('Invalid vertex index');
    }

    let count = 0;
    for (let i = 0; i < this.vertices; i++) {
      if (this.matrix[vertex][i] !== 0) {
        count++;
      }
    }

    return count;
  }

  /**
   * Returns the total number of vertices in the graph.
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  getVertexCount(): number {
    return this.vertices;
  }

  /**
   * Returns the number of edges in the graph.
   * In an undirected graph, we count each edge once (not twice).
   *
   * @returns The number of edges
   *
   * @timeComplexity O(V²)
   * @spaceComplexity O(1)
   */
  getEdgeCount(): number {
    let count = 0;

    for (let i = 0; i < this.vertices; i++) {
      for (let j = i; j < this.vertices; j++) {
        if (this.matrix[i][j] !== 0) {
          count++;
        }
      }
    }

    return count;
  }

  /**
   * Performs a breadth-first search traversal starting from the given vertex.
   * Uses a dedicated Queue class for true O(1) enqueue/dequeue operations.
   *
   * @param start - The starting vertex index for BFS
   * @returns An array of vertices in the order they were visited
   * @throws {Error} If start is an invalid vertex index
   *
   * @timeComplexity O(V²) where V is the number of vertices
   * @spaceComplexity O(V) for the visited array and queue
   *
   * @remarks
   * Time complexity is O(V²) for adjacency matrix because we check
   * all V vertices for each of the V vertices we visit.
   * For adjacency list, this would be O(V + E).
   */
  bfs(start: number): number[] {
    if (!this.isValidVertex(start)) {
      throw new Error('Invalid vertex index');
    }

    const visited = new Array(this.vertices).fill(false);
    const result: number[] = [];
    const queue = new Queue<number>();

    queue.enqueue(start);
    visited[start] = true;

    while (!queue.isEmpty()) {
      const vertex = queue.dequeue()!;
      result.push(vertex);

      for (let i = 0; i < this.vertices; i++) {
        if (this.matrix[vertex][i] !== 0 && !visited[i]) {
          visited[i] = true;
          queue.enqueue(i);
        }
      }
    }

    return result;
  }

  /**
   * Performs a depth-first search traversal starting from the given vertex.
   * Uses an iterative approach with a stack.
   *
   * @param start - The starting vertex index for DFS
   * @returns An array of vertices in the order they were visited
   * @throws {Error} If start is an invalid vertex index
   *
   * @timeComplexity O(V²) where V is the number of vertices
   * @spaceComplexity O(V) for the visited array and stack
   */
  dfs(start: number): number[] {
    if (!this.isValidVertex(start)) {
      throw new Error('Invalid vertex index');
    }

    const visited = new Array(this.vertices).fill(false);
    const result: number[] = [];
    const stack: number[] = [start];

    while (stack.length > 0) {
      const vertex = stack.pop()!;

      if (!visited[vertex]) {
        visited[vertex] = true;
        result.push(vertex);

        for (let i = this.vertices - 1; i >= 0; i--) {
          if (this.matrix[vertex][i] !== 0 && !visited[i]) {
            stack.push(i);
          }
        }
      }
    }

    return result;
  }

  /**
   * Performs a depth-first search traversal using recursion.
   *
   * @param start - The starting vertex index for DFS
   * @returns An array of vertices in the order they were visited
   * @throws {Error} If start is an invalid vertex index
   *
   * @timeComplexity O(V²) where V is the number of vertices
   * @spaceComplexity O(V) for the visited array and recursion call stack
   */
  dfsRecursive(start: number): number[] {
    if (!this.isValidVertex(start)) {
      throw new Error('Invalid vertex index');
    }

    const visited = new Array(this.vertices).fill(false);
    const result: number[] = [];

    const dfsHelper = (vertex: number) => {
      visited[vertex] = true;
      result.push(vertex);

      for (let i = 0; i < this.vertices; i++) {
        if (this.matrix[vertex][i] !== 0 && !visited[i]) {
          dfsHelper(i);
        }
      }
    };

    dfsHelper(start);

    return result;
  }

  /**
   * Checks if there exists a path between two vertices.
   * In an undirected graph, if there's a path from u to v,
   * there's also a path from v to u.
   *
   * @param u - The first vertex index
   * @param v - The second vertex index
   * @returns True if a path exists, false otherwise
   *
   * @timeComplexity O(V²) where V is the number of vertices
   * @spaceComplexity O(V) for the visited array and queue
   */
  hasPath(u: number, v: number): boolean {
    if (!this.isValidVertex(u) || !this.isValidVertex(v)) {
      return false;
    }

    if (u === v) return true;

    const visited = new Array(this.vertices).fill(false);
    const queue = new Queue<number>();

    queue.enqueue(u);
    visited[u] = true;

    while (!queue.isEmpty()) {
      const vertex = queue.dequeue()!;

      for (let i = 0; i < this.vertices; i++) {
        if (this.matrix[vertex][i] !== 0) {
          if (i === v) return true;

          if (!visited[i]) {
            visited[i] = true;
            queue.enqueue(i);
          }
        }
      }
    }

    return false;
  }

  /**
   * Finds all connected components in the graph.
   * A connected component is a maximal set of vertices where each vertex
   * is reachable from every other vertex in the set.
   *
   * @returns An array of arrays, where each inner array contains the vertices
   *          in one connected component
   *
   * @timeComplexity O(V³) - performs BFS for each unvisited vertex
   * @spaceComplexity O(V) for tracking visited vertices
   *
   * @example
   * ```typescript
   * // Graph with two components: {0,1,2} and {3,4}
   * const result = graph.findConnectedComponents();
   * // result: [[0, 1, 2], [3, 4]]
   * ```
   */
  findConnectedComponents(): number[][] {
    const visited = new Array(this.vertices).fill(false);
    const components: number[][] = [];

    for (let v = 0; v < this.vertices; v++) {
      if (!visited[v]) {
        const component = this.bfs(v);
        component.forEach((vertex) => (visited[vertex] = true));
        components.push(component);
      }
    }

    return components;
  }

  /**
   * Checks if the graph is connected (all vertices are reachable from any vertex).
   *
   * @returns True if the graph is connected, false otherwise
   *
   * @timeComplexity O(V²)
   * @spaceComplexity O(V)
   */
  isConnected(): boolean {
    if (this.vertices === 0) return true;

    return this.bfs(0).length === this.vertices;
  }

  /**
   * Detects if the graph contains a cycle.
   * Uses DFS-based cycle detection.
   *
   * @returns True if the graph contains at least one cycle, false otherwise
   *
   * @timeComplexity O(V²)
   * @spaceComplexity O(V) for visited array and recursion stack
   */
  hasCycle(): boolean {
    const visited = new Array(this.vertices).fill(false);

    const dfsCheckCycle = (vertex: number, parent: number): boolean => {
      visited[vertex] = true;

      for (let i = 0; i < this.vertices; i++) {
        if (this.matrix[vertex][i] !== 0) {
          if (!visited[i]) {
            if (dfsCheckCycle(i, vertex)) return true;
          } else if (i !== parent) {
            // Found a back edge (visited vertex that's not the parent)
            return true;
          }
        }
      }

      return false;
    };

    // Check all components
    for (let v = 0; v < this.vertices; v++) {
      if (!visited[v]) {
        if (dfsCheckCycle(v, -1)) return true;
      }
    }

    return false;
  }

  /**
   * Returns a deep copy of the adjacency matrix.
   *
   * @timeComplexity O(V²) where V is the number of vertices
   * @spaceComplexity O(V²) for the copied matrix
   */
  getMatrix(): number[][] {
    return this.matrix.map((row) => [...row]);
  }

  /**
   * Displays the adjacency matrix to the console.
   * The matrix is symmetric for undirected graphs.
   *
   * @timeComplexity O(V²) where V is the number of vertices
   * @spaceComplexity O(1)
   */
  display(): void {
    console.log('Adjacency Matrix (Undirected):');
    for (let i = 0; i < this.vertices; i++) {
      console.log(this.matrix[i].join(' '));
    }
  }
}

export default UndirectedMatrixGraph;
