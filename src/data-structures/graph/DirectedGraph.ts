import Queue from '../queue/Queue';
import PriorityQueue from '../priority-queue/PriorityQueue';

interface DijkstraResult<T> {
  distances: Map<T, number>;
  previous: Map<T, T | null>;
}

class DirectedGraph<T> {
  private adjList: Map<T, Map<T, number | undefined>>;

  constructor() {
    this.adjList = new Map();
  }

  addVertex(vertex: T): void {
    if (!this.adjList.has(vertex)) {
      this.adjList.set(vertex, new Map());
    }
  }

  addEdge(from: T, to: T, weight?: number): void {
    if (!this.adjList.has(from)) {
      this.addVertex(from);
    }

    if (!this.adjList.has(to)) {
      this.addVertex(to);
    }

    this.adjList.get(from)!.set(to, weight);
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

  removeEdge(from: T, to: T): void {
    if (!this.adjList.has(from)) return;

    const neighbors = this.adjList.get(from)!;

    if (neighbors.has(to)) {
      neighbors.delete(to);
    }
  }

  hasVertex(vertex: T): boolean {
    return this.adjList.has(vertex);
  }

  hasEdge(from: T, to: T): boolean {
    const neighbors = this.adjList.get(from);

    return !!neighbors && neighbors.has(to);
  }

  getNeighbors(vertex: T): T[] {
    const neighbors = this.adjList.get(vertex);

    return neighbors ? Array.from(neighbors.keys()) : [];
  }

  getWeight(from: T, to: T): number | undefined {
    const neighbors = this.adjList.get(from);

    return neighbors ? neighbors.get(to) : undefined;
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

    const isCyclic = (vertex: T): boolean => {
      visited.add(vertex);
      recursionStack.add(vertex);

      const neighbors = this.adjList.get(vertex);

      if (neighbors) {
        for (const neighbor of neighbors.keys()) {
          if (!visited.has(neighbor)) {
            if (isCyclic(neighbor)) {
              return true;
            }
          } else if (recursionStack.has(neighbor)) {
            return true;
          }
        }
      }

      recursionStack.delete(vertex);
      return false;
    };

    for (const vertex of vertices) {
      if (!visited.has(vertex)) {
        if (isCyclic(vertex)) {
          return true;
        }
      }
    }

    return false;
  }

  topologicalSort(): T[] {
    const inDegree = new Map<T, number>();
    const queue = new Queue<T>();
    const result: T[] = [];
    const vertices = this.getAllVertices();

    // 1. Initialize in-degrees of all vertices to 0
    for (const vertex of vertices) {
      inDegree.set(vertex, 0);
    }

    // 2. Calculate the in-degrees of each vertex by iterating through the adjacency list.
    for (const vertex of vertices) {
      const neighbors = this.getNeighbors(vertex);

      for (const neighbor of neighbors) {
        inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
      }
    }

    // 3. Enqueue all vertices with an in-degree of 0.
    for (const [vertex, degree] of inDegree) {
      if (degree === 0) {
        queue.enqueue(vertex);
      }
    }

    // 4. Process the queue.
    while (!queue.isEmpty()) {
      const currentVertex = queue.dequeue()!;
      result.push(currentVertex);

      const neighbors = this.getNeighbors(currentVertex);

      for (const neighbor of neighbors) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);

        if (inDegree.get(neighbor) === 0) {
          queue.enqueue(neighbor);
        }
      }
    }

    // 5. Check for cycles. If the sorted list size is not equal to the number of vertices, a cycle exists.
    if (result.length !== vertices.length) {
      return [];
    }

    return result;
  }

  dijkstra(startVertex: T): DijkstraResult<T> {
    if (!this.adjList.has(startVertex)) {
      throw new Error('Start vertex not found in the graph.');
    }

    const distances = new Map<T, number>();
    const previous = new Map<T, T | null>();
    const pq = new PriorityQueue<{ vertex: T; distance: number }>(
      (a, b) => a.distance - b.distance,
    );
    const vertices = this.getAllVertices();

    // Initialize distances to infinity for all vertices except the start vertex
    for (const vertex of vertices) {
      distances.set(vertex, Infinity);
      previous.set(vertex, null);
    }

    distances.set(startVertex, 0);

    // Add the start vertex to the priority queue
    pq.enqueue({ vertex: startVertex, distance: 0 });

    while (!pq.isEmpty()) {
      const { vertex: currentVertex, distance: currentDistance } =
        pq.dequeue()!;

      // If the current distance is greater than the known distance, skip
      if (currentDistance > distances.get(currentVertex)!) {
        continue;
      }

      const neighbors = this.getNeighbors(currentVertex);

      for (const neighbor of neighbors) {
        const weight = this.getWeight(currentVertex, neighbor);

        if (weight) {
          const newDistance = currentDistance + weight;

          if (newDistance < distances.get(neighbor)!) {
            distances.set(neighbor, newDistance);
            previous.set(neighbor, currentVertex);
            pq.enqueue({ vertex: neighbor, distance: newDistance });
          }
        }
      }
    }

    return { distances, previous };
  }

  toString(): string {
    let result = '';

    for (const [vertex, neighbors] of this.adjList) {
      result += `${vertex} -> `;

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

export default DirectedGraph;
