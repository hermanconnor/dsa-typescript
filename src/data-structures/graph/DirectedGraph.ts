import Queue from '../queue/Queue';

class DirectedGraph<T> {
  adjList: Map<T, T[]>;

  constructor() {
    this.adjList = new Map();
  }

  addVertex(vertex: T): boolean {
    if (!this.adjList.has(vertex)) {
      this.adjList.set(vertex, []);
      return true;
    }

    return false;
  }

  addEdge(vertex1: T, vertex2: T): boolean {
    if (vertex1 === vertex2) return false;

    this.addVertex(vertex1);
    this.addVertex(vertex2);

    const vertex1Array = this.adjList.get(vertex1)!;
    const edgeAdded = !vertex1Array.includes(vertex2);

    if (edgeAdded) {
      vertex1Array.push(vertex2);
    }

    return edgeAdded;
  }

  removeVertex(vertex: T): boolean {
    if (!this.adjList.has(vertex)) return false;

    this.adjList.delete(vertex);

    this.adjList.forEach((edges, key) => {
      this.adjList.set(
        key,
        edges.filter((neighbor) => neighbor !== vertex),
      );
    });

    return true;
  }

  removeEdge(vertex1: T, vertex2: T): boolean {
    if (!this.adjList.has(vertex1)) return false;

    const vertex1Edges = this.adjList.get(vertex1)!;

    if (!vertex1Edges.includes(vertex2)) return false;

    this.adjList.set(
      vertex1,
      vertex1Edges.filter((neighbor) => neighbor !== vertex2),
    );

    return true;
  }

  hasEdge(vertex1: T, vertex2: T): boolean {
    if (!this.adjList.has(vertex1) || !this.adjList.has(vertex2)) return false;

    return this.adjList.get(vertex1)!.includes(vertex2);
  }

  dfs(start: T): void {
    if (!this.adjList.has(start)) {
      console.error(`Start vertex: ${start}, not found.`);
      return;
    }

    const visited = new Set<T>();

    const dfsHelper = (vertex: T) => {
      if (!visited.has(vertex)) {
        console.log(vertex); // Visit the vertex

        visited.add(vertex);

        const neighbors = this.adjList.get(vertex);

        if (neighbors) {
          for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
              dfsHelper(neighbor);
            }
          }
        }
      }
    };

    dfsHelper(start);
  }

  bfs(start: T): void {
    if (!this.adjList.has(start)) {
      console.error(`Start vertex: ${start}, not found.`);
      return;
    }

    const visited = new Set<T>();
    const queue = new Queue<T>();

    queue.enqueue(start);
    visited.add(start);

    while (!queue.isEmpty()) {
      const vertex = queue.dequeue();
      if (!vertex) continue;

      console.log(vertex); // Visit the vertex

      const neighbors = this.adjList.get(vertex);

      if (neighbors) {
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.enqueue(neighbor);
            visited.add(neighbor);
          }
        }
      }
    }
  }

  printGraph(): void {
    this.adjList.forEach((edges, vertex) => {
      console.log(`${vertex}: ${edges.join(', ')}`);
    });
  }
}

export default DirectedGraph;
