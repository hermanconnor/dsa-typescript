import Queue from '../../queue/list-queue/Queue';

/**
 * A directed graph implementation using an adjacency matrix representation.
 * Supports weighted edges and provides efficient edge lookup operations.
 *
 * @example
 * ```typescript
 * const graph = new DirectedGraph(4);
 * graph.addEdge(0, 1, 5);
 * graph.addEdge(1, 2, 3);
 * console.log(graph.bfs(0)); // [0, 1, 2]
 * ```
 */
class DirectedMatrixGraph {
  private matrix: number[][];
  private vertices: number;

  /**
   * Creates a new directed graph with the specified number of vertices.
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
   *
   * @param vertex - The vertex index to validate
   * @returns True if valid (0 <= vertex < number of vertices), false otherwise
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  private isValidVertex(vertex: number): boolean {
    return vertex >= 0 && vertex < this.vertices;
  }

  /**
   * Adds a directed edge from source to destination vertex with an optional weight.
   * If an edge already exists, it will be overwritten with the new weight.
   *
   * @param src - The source vertex index
   * @param dest - The destination vertex index
   * @param weight - The weight of the edge (default: 1)
   * @throws {Error} If src or dest are invalid vertex indices
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  addEdge(src: number, dest: number, weight: number = 1): void {
    if (this.isValidVertex(src) && this.isValidVertex(dest)) {
      this.matrix[src][dest] = weight;
    } else {
      throw new Error('Invalid vertex index');
    }
  }

  /**
   * Removes the directed edge from source to destination vertex.
   *
   * @param src - The source vertex index
   * @param dest - The destination vertex index
   * @throws {Error} If src or dest are invalid vertex indices
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  removeEdge(src: number, dest: number): void {
    if (this.isValidVertex(src) && this.isValidVertex(dest)) {
      this.matrix[src][dest] = 0;
    } else {
      throw new Error('Invalid vertex index');
    }
  }

  /**
   * Checks if a directed edge exists from source to destination vertex.
   *
   * @param src - The source vertex index
   * @param dest - The destination vertex index
   * @returns True if an edge exists, false otherwise
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  hasEdge(src: number, dest: number): boolean {
    if (this.isValidVertex(src) && this.isValidVertex(dest)) {
      return this.matrix[src][dest] !== 0;
    }

    return false;
  }

  /**
   * Returns the weight of the edge from source to destination vertex.
   *
   * @param src - The source vertex index
   * @param dest - The destination vertex index
   * @returns The weight of the edge (0 if no edge exists)
   * @throws {Error} If src or dest are invalid vertex indices
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  getWeight(src: number, dest: number): number {
    if (this.isValidVertex(src) && this.isValidVertex(dest)) {
      return this.matrix[src][dest];
    }

    throw new Error('Invalid vertex index');
  }

  /**
   * Returns all vertices that have incoming edges from the given vertex.
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
   * Calculates the in-degree of a vertex (number of incoming edges).
   *
   * @param vertex - The vertex index
   * @returns The number of edges pointing to this vertex
   * @throws {Error} If vertex is an invalid index
   *
   * @timeComplexity O(V) where V is the number of vertices
   * @spaceComplexity O(1)
   */
  getInDegree(vertex: number): number {
    if (!this.isValidVertex(vertex)) {
      throw new Error('Invalid vertex index');
    }

    let count = 0;
    for (let i = 0; i < this.vertices; i++) {
      if (this.matrix[i][vertex] !== 0) {
        count++;
      }
    }

    return count;
  }

  /**
   * Calculates the out-degree of a vertex (number of outgoing edges).
   *
   * @param vertex - The vertex index
   * @returns The number of edges originating from this vertex
   * @throws {Error} If vertex is an invalid index
   *
   * @timeComplexity O(V) where V is the number of vertices
   * @spaceComplexity O(1)
   */
  getOutDegree(vertex: number): number {
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
   * @returns The number of vertices
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  getVertexCount(): number {
    return this.vertices;
  }

  /**
   * Performs a breadth-first search traversal starting from the given vertex.
   * Uses a queue to visit vertices level by level.
   *
   * @param start - The starting vertex index for BFS
   * @returns An array of vertices in the order they were visited
   * @throws {Error} If start is an invalid vertex index
   *
   * @timeComplexity O(V²) where V is the number of vertices
   * @spaceComplexity O(V) for the visited array and queue
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

        // Push neighbors in reverse order for left-to-right traversal
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
   * Checks if there exists a directed path from source to destination vertex.
   * Uses BFS to explore all reachable vertices from the source.
   *
   * @param src - The source vertex index
   * @param dest - The destination vertex index
   * @returns True if a path exists, false otherwise
   *
   * @timeComplexity O(V²) where V is the number of vertices
   * @spaceComplexity O(V) for the visited array and queue
   */
  hasPath(src: number, dest: number): boolean {
    if (!this.isValidVertex(src) || !this.isValidVertex(dest)) {
      return false;
    }

    if (src === dest) return true;

    const visited = new Array(this.vertices).fill(false);

    const queue = new Queue<number>();
    queue.enqueue(src);
    visited[src] = true;

    while (!queue.isEmpty()) {
      const vertex = queue.dequeue()!;

      for (let i = 0; i < this.vertices; i++) {
        if (this.matrix[vertex][i] !== 0) {
          if (i === dest) return true;

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
   * Returns a deep copy of the adjacency matrix.
   * Useful for advanced graph algorithms that need direct matrix access.
   *
   * @returns A 2D array representing the adjacency matrix
   *
   * @timeComplexity O(V²) where V is the number of vertices
   * @spaceComplexity O(V²) for the copied matrix
   */
  getMatrix(): number[][] {
    return this.matrix.map((row) => [...row]);
  }

  /**
   * Displays the adjacency matrix to the console.
   * Useful for debugging and visualization of small graphs.
   *
   * @timeComplexity O(V²) where V is the number of vertices
   * @spaceComplexity O(1)
   */
  display(): void {
    console.log('Adjacency Matrix:');
    for (let i = 0; i < this.vertices; i++) {
      console.log(this.matrix[i].join(' '));
    }
  }
}

export default DirectedMatrixGraph;
