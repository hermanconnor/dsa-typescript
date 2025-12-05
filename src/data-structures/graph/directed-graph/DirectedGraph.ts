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
}

export default DirectedGraph;
