import Queue from '../queue/Queue';

class UndirectedGraph<T> {
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
    if (vertex1 === vertex2) {
      console.error('Cannot add an edge from a vertex to itself (self-loop).');
      return false;
    }

    this.addVertex(vertex1);
    this.addVertex(vertex2);

    const vertex1Array = this.adjList.get(vertex1)!;
    const vertex2Array = this.adjList.get(vertex2)!;

    const edgeExists = vertex1Array.includes(vertex2);
    if (edgeExists) return false;

    // Undirected, so we add both directions
    vertex1Array.push(vertex2);
    vertex2Array.push(vertex1);

    return true;
  }

  removeVertex(vertex: T): boolean {
    if (!this.adjList.has(vertex)) {
      console.error(`Vertex: ${vertex}, does not exist.`);
      return false;
    }

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
    if (!this.adjList.has(vertex1) || !this.adjList.has(vertex2)) {
      console.error(
        `One or both vertices (${vertex1}, ${vertex2}) do not exist.`,
      );
      return false;
    }

    const edges1 = this.adjList.get(vertex1)!;
    const edges2 = this.adjList.get(vertex2)!;

    if (!edges1.includes(vertex2) || !edges2.includes(vertex1)) {
      console.error(`Edge between ${vertex1} and ${vertex2} does not exist.`);
      return false;
    }

    this.adjList.set(
      vertex1,
      edges1.filter((neighbor) => neighbor !== vertex2),
    );
    this.adjList.set(
      vertex2,
      edges2.filter((neighbor) => neighbor !== vertex1),
    );

    return true;
  }

  hasEdge(vertex1: T, vertex2: T): boolean {
    if (!this.adjList.has(vertex1) || !this.adjList.has(vertex2)) {
      console.error(
        `One or both vertices (${vertex1}, ${vertex2}) do not exist.`,
      );

      return false;
    }

    return (
      this.adjList.get(vertex1)!.includes(vertex2) &&
      this.adjList.get(vertex2)!.includes(vertex1)
    );
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

export default UndirectedGraph;
