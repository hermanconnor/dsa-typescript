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

  hasEdge(vertex1: T, vertex2: T): boolean {
    if (!this.adjList.has(vertex1) || !this.adjList.has(vertex2)) return false;

    return this.adjList.get(vertex1)!.includes(vertex2);
  }
}

export default DirectedGraph;
