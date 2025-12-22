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
   * Returns the total number of vertices in the graph.
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  getVertexCount(): number {
    return this.vertices;
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
