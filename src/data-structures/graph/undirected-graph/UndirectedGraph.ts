import Queue from '../../queue/list-queue/Queue';

class UndirectedGraph<T> {
  private adjList: Map<T, Map<T, number | undefined>>;

  constructor() {
    this.adjList = new Map();
  }

  addVertex(vertex: T): void {
    if (!this.adjList.has(vertex)) {
      this.adjList.set(vertex, new Map());
    }
  }

  addEdge(vertex1: T, vertex2: T, weight?: number): void {
    if (!this.adjList.has(vertex1)) {
      this.addVertex(vertex1);
    }

    if (!this.adjList.has(vertex2)) {
      this.addVertex(vertex2);
    }

    this.adjList.get(vertex1)!.set(vertex2, weight);
    this.adjList.get(vertex2)!.set(vertex1, weight);
  }

  removeVertex(vertex: T): void {
    if (!this.adjList.has(vertex)) return;

    for (const [, neighbors] of this.adjList) {
      if (neighbors.has(vertex)) {
        neighbors.delete(vertex);
      }
    }

    this.adjList.delete(vertex);
  }

  removeEdge(vertex1: T, vertex2: T): void {
    if (!this.adjList.has(vertex1) || !this.adjList.has(vertex2)) return;

    const neighbors1 = this.adjList.get(vertex1)!;
    const neighbors2 = this.adjList.get(vertex2)!;

    if (neighbors1.has(vertex2)) {
      neighbors1.delete(vertex2);
    }

    if (neighbors2.has(vertex1)) {
      neighbors2.delete(vertex1);
    }
  }

  hasVertex(vertex: T): boolean {
    return this.adjList.has(vertex);
  }

  hasEdge(vertex1: T, vertex2: T): boolean {
    const neighbors1 = this.adjList.get(vertex1);
    return !!neighbors1 && neighbors1.has(vertex2);
  }

  getNeighbors(vertex: T): T[] {
    const neighbors = this.adjList.get(vertex);
    return neighbors ? Array.from(neighbors.keys()) : [];
  }

  getWeight(vertex1: T, vertex2: T): number | undefined {
    const neighbors = this.adjList.get(vertex1);
    return neighbors ? neighbors.get(vertex2) : undefined;
  }

  getAllVertices(): T[] {
    return Array.from(this.adjList.keys());
  }

  bfs(startVertex: T, callback?: (vertex: T) => void): T[] {
    if (!this.adjList.has(startVertex)) return [];

    const result: T[] = [];
    const visited = new Set<T>();
    const queue = new Queue<T>();

    queue.enqueue(startVertex);
    visited.add(startVertex);

    while (!queue.isEmpty()) {
      const currentVertex = queue.dequeue()!;

      result.push(currentVertex);

      if (callback) {
        callback(currentVertex);
      }

      const neighbors = this.getNeighbors(currentVertex);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.enqueue(neighbor);
          visited.add(neighbor);
        }
      }
    }

    return result;
  }

  dfs(startVertex: T, callback?: (vertex: T) => void): T[] {
    if (!this.adjList.has(startVertex)) return [];

    const result: T[] = [];
    const visited = new Set<T>();

    const dfsRecursive = (vertex: T) => {
      visited.add(vertex);
      result.push(vertex);

      if (callback) {
        callback(vertex);
      }

      const neighbors = this.getNeighbors(vertex);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfsRecursive(neighbor);
        }
      }
    };

    dfsRecursive(startVertex);

    return result;
  }

  hasCycle(): boolean {
    const visited = new Set<T>();
    const recursionStack = new Set<T>();
    const vertices = this.getAllVertices();

    const isCyclic = (vertex: T, parent: T | null): boolean => {
      visited.add(vertex);
      recursionStack.add(vertex);

      const neighbors = this.getNeighbors(vertex);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (isCyclic(neighbor, vertex)) {
            return true;
          }
        } else if (neighbor !== parent && recursionStack.has(neighbor)) {
          return true;
        }
      }

      recursionStack.delete(vertex);
      return false;
    };

    for (const vertex of vertices) {
      if (!visited.has(vertex)) {
        if (isCyclic(vertex, null)) {
          return true;
        }
      }
    }

    return false;
  }

  bellmanFord(startVertex: T): {
    distances: Map<T, number> | null;
    previous: Map<T, T | null>;
  } {
    if (!this.adjList.has(startVertex)) {
      return {
        distances: new Map<T, number>(),
        previous: new Map<T, T | null>(),
      };
    }

    const distances = new Map<T, number>();
    const previous = new Map<T, T | null>();
    const allVertices = this.getAllVertices();
    const allEdges: { vertex1: T; vertex2: T; weight: number }[] = [];

    for (const vertex of allVertices) {
      distances.set(vertex, Infinity);
      previous.set(vertex, null);
    }

    distances.set(startVertex, 0);

    for (const [vertex1, neighbors] of this.adjList) {
      for (const [vertex2, weight] of neighbors) {
        if (
          weight !== undefined &&
          allEdges.findIndex(
            (edge) =>
              (edge.vertex1 === vertex1 && edge.vertex2 === vertex2) ||
              (edge.vertex1 === vertex2 && edge.vertex2 === vertex1),
          ) === -1
        ) {
          allEdges.push({ vertex1, vertex2, weight });
        }
      }
    }

    for (let i = 0; i < allVertices.length - 1; i++) {
      for (const { vertex1, vertex2, weight } of allEdges) {
        if (
          distances.get(vertex1) !== Infinity &&
          distances.get(vertex1)! + weight < distances.get(vertex2)!
        ) {
          distances.set(vertex2, distances.get(vertex1)! + weight);
          previous.set(vertex2, vertex1);
        }
        if (
          distances.get(vertex2) !== Infinity &&
          distances.get(vertex2)! + weight < distances.get(vertex1)!
        ) {
          distances.set(vertex1, distances.get(vertex2)! + weight);
          previous.set(vertex1, vertex2);
        }
      }
    }

    for (const { vertex1, vertex2, weight } of allEdges) {
      if (
        distances.get(vertex1) !== Infinity &&
        distances.get(vertex1)! + weight < distances.get(vertex2)!
      ) {
        return { distances: null, previous: new Map<T, T | null>() }; // Negative cycle detected
      }
      if (
        distances.get(vertex2) !== Infinity &&
        distances.get(vertex2)! + weight < distances.get(vertex1)!
      ) {
        return { distances: null, previous: new Map<T, T | null>() }; // Negative cycle detected
      }
    }

    return { distances, previous };
  }

  getPath(startVertex: T, endVertex: T, previous: Map<T, T | null>): T[] {
    if (!this.adjList.has(startVertex) || !this.adjList.has(endVertex)) {
      return [];
    }

    const path: T[] = [];
    let current: T | null = endVertex;

    while (current !== null) {
      path.unshift(current);
      current = previous.get(current) ?? null;
    }

    return path[0] === startVertex ? path : [];
  }

  toString(): string {
    let result = '';

    for (const [vertex, neighbors] of this.adjList) {
      result += `${vertex} -- `; // Using '--' to represent an undirected edge

      const neighborList = Array.from(neighbors.entries())
        .map(([neighbor, weight]) =>
          weight !== undefined ? `${neighbor}(${weight})` : neighbor,
        )
        .join(', ');

      result += neighborList + '\n';
    }

    return result;
  }

  printGraph(): void {
    console.log(this.toString());
  }
}

export default UndirectedGraph;
