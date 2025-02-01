class DirectedGraph<T> {
  // private  adjList: Map<T, T[]>;
  adjList: Map<T, T[]>; // Easier for testing purposes without private modifier

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

    // const vertexArray = this.adjList.get(vertex)!;

    // for (const adjacentVertex of vertexArray) {
    //   const adjacentArray = this.adjList.get(adjacentVertex)!;

    //   adjacentArray.filter((neighbor) => neighbor !== vertex);
    // }

    // this.adjList.delete(vertex);

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

  printGraph(): void {
    this.adjList.forEach((edges, vertex) => {
      console.log(`${vertex}: ${edges.join(', ')}`);
    });
  }
}

export default DirectedGraph;
