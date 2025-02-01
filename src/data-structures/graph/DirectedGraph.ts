class DirectedGraph<T> {
  // private  adjList: Map<T, T[]>;
  adjList: Map<T, T[]>; // Easier for testing purposes without private modifier

  constructor() {
    this.adjList = new Map();
  }

  addVertex(vertex: T): void {
    if (!this.adjList.has(vertex)) {
      this.adjList.set(vertex, []);
    }
  }
}

export default DirectedGraph;
