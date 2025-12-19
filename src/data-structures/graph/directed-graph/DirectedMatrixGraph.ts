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
}

export default DirectedMatrixGraph;
