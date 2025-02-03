class UndirectedGraph<T> {
  adjList: Map<T, T[]>;

  constructor() {
    this.adjList = new Map();
  }
}

export default UndirectedGraph;
