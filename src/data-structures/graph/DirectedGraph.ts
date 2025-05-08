import Queue from '../queue/Queue';

class DirectedGraph<T> {
  private adjList: Map<T, Map<T, number | undefined>>;

  constructor() {
    this.adjList = new Map();
  }

  public addVertex(vertex: T): void {
    if (!this.adjList.has(vertex)) {
      this.adjList.set(vertex, new Map());
    }
  }

  public addEdge(from: T, to: T, weight?: number): void {
    if (!this.adjList.has(from)) {
      this.addVertex(from);
    }

    if (!this.adjList.has(to)) {
      this.addVertex(to);
    }

    this.adjList.get(from)!.set(to, weight);
  }

  public removeVertex(vertex: T): void {
    if (!this.adjList.has(vertex)) return;

    for (const [, neighbors] of this.adjList) {
      if (neighbors.has(vertex)) {
        neighbors.delete(vertex);
      }
    }

    this.adjList.delete(vertex);
  }

  public removeEdge(from: T, to: T): void {
    if (!this.adjList.has(from)) return;

    const neighbors = this.adjList.get(from)!;

    if (neighbors.has(to)) {
      neighbors.delete(to);
    }
  }

  public hasVertex(vertex: T): boolean {
    return this.adjList.has(vertex);
  }

  public hasEdge(from: T, to: T): boolean {
    const neighbors = this.adjList.get(from);

    return !!neighbors && neighbors.has(to);
  }

  public getNeighbors(vertex: T): T[] {
    const neighbors = this.adjList.get(vertex);

    return neighbors ? Array.from(neighbors.keys()) : [];
  }

  public getWeight(from: T, to: T): number | undefined {
    const neighbors = this.adjList.get(from);

    return neighbors ? neighbors.get(to) : undefined;
  }

  public getAllVertices(): T[] {
    return Array.from(this.adjList.keys());
  }

  public bfs(startVertex: T, callback?: (vertex: T) => void): T[] {
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
}

export default DirectedGraph;
