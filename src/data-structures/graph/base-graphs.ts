import Queue from '../queue/Queue';
import { IGraph, IDirectedGraph, IUndirectedGraph } from './interfaces';

// =========================================================================
// BASE GRAPH
// =========================================================================

/**
 * Abstract base class implementing common graph traversal algorithms.
 *
 * Provides concrete implementations of BFS and DFS that work for both
 * directed and undirected graphs, as these algorithms only depend on
 * the getNeighbors() and hasVertex() methods.
 *
 * @template T - The type of values stored in vertices
 */
abstract class BaseGraph<T> implements IGraph<T> {
  // ABSTRACT METHODS - Must be implemented by subclasses

  public abstract addVertex(vertex: T): void;
  public abstract removeVertex(vertex: T): boolean;
  public abstract addEdge(from: T, to: T, weight?: number): void;
  public abstract removeEdge(from: T, to: T): boolean;
  public abstract hasEdge(from: T, to: T): boolean;
  public abstract hasVertex(vertex: T): boolean;
  public abstract getEdgeWeight(from: T, to: T): number | undefined;
  public abstract getNeighbors(vertex: T): { target: T; weight?: number }[];
  public abstract getAllVertices(): T[];
  public abstract get vertexCount(): number;
  public abstract get edgeCount(): number;
  public abstract getDegree(vertex: T): number;
  public abstract hasCycle(): boolean;
  public abstract getConnectedComponents(): T[][];
  public abstract hasPath(from: T, to: T): boolean;
  public abstract findShortestPath(from: T, to: T): T[] | undefined;
  public abstract clear(): void;
  public abstract toString(): string;

  // CONCRETE IMPLEMENTATIONS - Provided by base class

  /**
   * Performs breadth-first search and returns vertices in visited order.
   *
   * @param startVertex - The vertex to start BFS from
   * @returns Array of vertices in the order they were visited
   * @throws {Error} If the start vertex doesn't exist
   * @complexity O(V + E) where V is vertices and E is edges
   */
  public getBFSOrder(startVertex: T): T[] {
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
   * Performs depth-first search (iterative) and returns vertices in visited order.
   *
   * @param startVertex - The vertex to start DFS from
   * @returns Array of vertices in the order they were visited
   * @throws {Error} If the start vertex doesn't exist
   * @complexity O(V + E) where V is vertices and E is edges
   */
  public getDFSOrder(startVertex: T): T[] {
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
   * Performs BFS and executes a callback function on each visited vertex.
   *
   * @param startVertex - The vertex to start BFS from
   * @param callback - Function to execute on each vertex during traversal
   * @throws {Error} If the start vertex doesn't exist
   * @complexity O(V + E) where V is vertices and E is edges
   */
  public traverseBFS(startVertex: T, callback: (vertex: T) => void): void {
    const order = this.getBFSOrder(startVertex);
    for (const vertex of order) {
      callback(vertex);
    }
  }

  /**
   * Performs DFS and executes a callback function on each visited vertex.
   *
   * @param startVertex - The vertex to start DFS from
   * @param callback - Function to execute on each vertex during traversal
   * @throws {Error} If the start vertex doesn't exist
   * @complexity O(V + E) where V is vertices and E is edges
   */
  public traverseDFS(startVertex: T, callback: (vertex: T) => void): void {
    const order = this.getDFSOrder(startVertex);
    for (const vertex of order) {
      callback(vertex);
    }
  }
}

// =========================================================================
// DIRECTED BASE GRAPH
// =========================================================================

/**
 * Abstract base class for directed graphs.
 * Extends BaseGraph with directed-graph-specific abstract methods.
 *
 * @template T - The type of values stored in vertices
 */
abstract class BaseDirectedGraph<T>
  extends BaseGraph<T>
  implements IDirectedGraph<T>
{
  public abstract getOutDegree(vertex: T): number;
  public abstract getInDegree(vertex: T): number;
  public abstract getPredecessors(vertex: T): T[];
  public abstract topologicalSort(): T[] | undefined;
  public abstract topologicalSortDFS(): T[] | undefined;
  public abstract getStronglyConnectedComponents(): T[][];
  public abstract transpose(): IDirectedGraph<T>;
  public abstract isDAG(): boolean;
  public abstract getSources(): T[];
  public abstract getSinks(): T[];

  /**
   * For directed graphs, getDegree returns out-degree by default.
   * This maintains compatibility with the base IGraph interface.
   */
  public getDegree(vertex: T): number {
    return this.getOutDegree(vertex);
  }

  /**
   * Alias for getStronglyConnectedComponents to satisfy IGraph interface.
   */
  public getConnectedComponents(): T[][] {
    return this.getStronglyConnectedComponents();
  }
}

// =========================================================================
// UNDIRECTED BASE GRAPH
// =========================================================================

/**
 * Abstract base class for undirected graphs.
 * Extends BaseGraph with undirected-graph-specific abstract methods.
 *
 * @template T - The type of values stored in vertices
 */
abstract class BaseUndirectedGraph<T>
  extends BaseGraph<T>
  implements IUndirectedGraph<T>
{
  public abstract isTree(): boolean;
  public abstract isConnected(): boolean;
  public abstract isBipartite(): boolean;
  public abstract getBipartiteSets(): [T[], T[]] | undefined;

  /**
   * For undirected graphs, degree is simply the number of edges.
   * Can be overridden by subclasses for optimization.
   */
  public getDegree(vertex: T): number {
    if (!this.hasVertex(vertex)) {
      throw new Error(`Vertex "${vertex}" does not exist.`);
    }
    return this.getNeighbors(vertex).length;
  }
}

export { BaseGraph, BaseDirectedGraph, BaseUndirectedGraph };
