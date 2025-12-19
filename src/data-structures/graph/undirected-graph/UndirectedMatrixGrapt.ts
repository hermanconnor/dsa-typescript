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

  addEdge(u: number, v: number, weight: number = 1): void {}

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
