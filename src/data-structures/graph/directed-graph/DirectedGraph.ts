import { BaseDirectedGraph } from '../base-graphs';

interface Edge<T> {
  target: T;
  weight?: number;
}

class DirectedGraph<T> extends BaseDirectedGraph<T> {
  private adjacencyList: Map<T, Edge<T>[]>;

  constructor() {
    super();
    this.adjacencyList = new Map();
  }

  /**
   * Adds a vertex to the graph.
   *
   * @param vertex - The vertex to add
   * @complexity O(1)
   */
  public addVertex(vertex: T): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  /**
   * Adds a directed edge from source to target vertex.
   * If an edge already exists, updates its weight.
   * Both vertices must exist before adding an edge.
   *
   * @param from - Source vertex
   * @param to - Target vertex
   * @param weight - Optional edge weight
   * @throws {Error} If either vertex doesn't exist
   * @complexity O(E) where E is the number of edges from the source vertex
   */
  public addEdge(from: T, to: T, weight?: number): void {
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
   * Removes a vertex and all edges connected to it (both incoming and outgoing).
   *
   * @param vertex - The vertex to remove
   * @returns true if the vertex was removed, false if it didn't exist
   * @complexity O(V + E) where V is vertices and E is total edges
   */
  public removeVertex(vertex: T): boolean {
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
   * Removes the directed edge from source to target.
   * Does not affect the edge from target to source (if it exists).
   *
   * @param from - Source vertex
   * @param to - Target vertex
   * @returns true if the edge was removed, false if it didn't exist
   * @complexity O(E) where E is the number of edges from the source vertex
   */
  public removeEdge(from: T, to: T): boolean {
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
   * @returns true if the vertex exists
   * @complexity O(1)
   */
  public hasVertex(vertex: T): boolean {
    return this.adjacencyList.has(vertex);
  }

  /**
   * Checks if a directed edge exists from source to target.
   *
   * @param from - Source vertex
   * @param to - Target vertex
   * @returns true if the edge exists
   * @complexity O(E) where E is the number of edges from the source vertex
   */
  public hasEdge(from: T, to: T): boolean {
    const edges = this.adjacencyList.get(from);

    return edges ? edges.some((edge) => edge.target === to) : false;
  }

  /**
   * Returns all neighbors (outgoing edges) of a vertex.
   * Returns a copy to prevent external mutation.
   *
   * @param vertex - The vertex to get neighbors for
   * @returns Array of neighbor objects with target vertex and optional weight
   * @throws {Error} If the vertex doesn't exist
   * @complexity O(E) where E is the number of edges from this vertex
   */
  public getNeighbors(vertex: T): Edge<T>[] {
    if (!this.hasVertex(vertex)) {
      throw new Error(`Vertex "${vertex}" does not exist.`);
    }

    return [...this.adjacencyList.get(vertex)!];
  }

  /**
   * Gets the weight of the edge from source to target.
   *
   * @param from - Source vertex
   * @param to - Target vertex
   * @returns The edge weight, or undefined if the edge doesn't exist
   * @complexity O(E) where E is the number of edges from the source vertex
   */
  public getEdgeWeight(from: T, to: T): number | undefined {
    const edges = this.adjacencyList.get(from);

    const edge = edges?.find((e) => e.target === to);
    return edge?.weight;
  }

  /**
   * Gets the total number of vertices in the graph.
   *
   * @returns The vertex count
   * @complexity O(1)
   */
  public get vertexCount(): number {
    return this.adjacencyList.size;
  }

  /**
   * Returns all vertices in the graph.
   *
   * @returns Array of all vertices
   * @complexity O(V) where V is the number of vertices
   */
  public getAllVertices(): T[] {
    return Array.from(this.adjacencyList.keys());
  }

  /**
   * Gets the total number of edges in the graph.
   *
   * @returns The edge count
   * @complexity O(V) where V is the number of vertices
   */
  public get edgeCount(): number {
    let count = 0;

    for (const edges of this.adjacencyList.values()) {
      count += edges.length;
    }

    return count;
  }

  /**
   * Returns the out-degree of a vertex (number of outgoing edges).
   *
   * @param vertex - The vertex to check
   * @returns The out-degree
   * @throws {Error} If the vertex doesn't exist
   * @complexity O(1)
   */
  public getOutDegree(vertex: T): number {
    if (!this.hasVertex(vertex)) {
      throw new Error(`Vertex "${vertex}" does not exist.`);
    }

    return this.adjacencyList.get(vertex)!.length;
  }

  /**
   * Returns the in-degree of a vertex (number of incoming edges).
   *
   * @param vertex - The vertex to check
   * @returns The in-degree
   * @throws {Error} If the vertex doesn't exist
   * @complexity O(V + E) where V is vertices and E is total edges
   */
  public getInDegree(vertex: T): number {
    if (!this.hasVertex(vertex)) {
      throw new Error(`Vertex "${vertex}" does not exist.`);
    }

    let count = 0;
    for (const edges of this.adjacencyList.values()) {
      if (edges.some((e) => e.target === vertex)) {
        count += edges.filter((e) => e.target === vertex).length;
      }
    }
    return count;
  }
}

export default DirectedGraph;
