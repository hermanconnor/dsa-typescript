import Queue from '../queue/Queue';

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
