class DirectedGraph<T> {
  private adjList: Map<T, T[]>;

  constructor() {
    this.adjList = new Map();
  }
}

export default DirectedGraph;
