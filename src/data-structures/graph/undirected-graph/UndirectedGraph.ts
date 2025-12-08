import PriorityQueue from '../../priority-queue/PriorityQueue';
import Queue from '../../queue/list-queue/Queue';
import UnionFind from '../../union-find/UnionFind';

interface Edge<T> {
  target: T;
  weight?: number;
}

class UndirectedGraph<T> {
  private adjacencyList: Map<T, Edge<T>[]>;

  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex: T): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(vertex1: T, vertex2: T, weight?: number): void {
    if (!this.hasVertex(vertex1)) {
      throw new Error(`Vertex "${vertex1}" does not exist. Add it first.`);
    }
    if (!this.hasVertex(vertex2)) {
      throw new Error(`Vertex "${vertex2}" does not exist. Add it first.`);
    }

    // Add edge from vertex1 to vertex2
    const edges1 = this.adjacencyList.get(vertex1)!;
    const existingIndex1 = edges1.findIndex((e) => e.target === vertex2);

    if (existingIndex1 !== -1) {
      edges1[existingIndex1].weight = weight;
    } else {
      edges1.push({ target: vertex2, weight });
    }

    // Add edge from vertex2 to vertex1 (undirected)
    const edges2 = this.adjacencyList.get(vertex2)!;
    const existingIndex2 = edges2.findIndex((e) => e.target === vertex1);

    if (existingIndex2 !== -1) {
      edges2[existingIndex2].weight = weight;
    } else {
      edges2.push({ target: vertex1, weight });
    }
  }

  removeVertex(vertex: T): boolean {
    if (!this.hasVertex(vertex)) {
      return false;
    }

    this.adjacencyList.delete(vertex);

    for (const edges of this.adjacencyList.values()) {
      const index = edges.findIndex((e) => e.target === vertex);
      if (index !== -1) {
        edges.splice(index, 1);
      }
    }

    return true;
  }

  removeEdge(vertex1: T, vertex2: T): boolean {
    const edges1 = this.adjacencyList.get(vertex1);
    const edges2 = this.adjacencyList.get(vertex2);

    if (!edges1 || !edges2) {
      return false;
    }

    const index1 = edges1.findIndex((edge) => edge.target === vertex2);
    const index2 = edges2.findIndex((edge) => edge.target === vertex1);

    if (index1 === -1 || index2 === -1) {
      return false;
    }

    edges1.splice(index1, 1);
    edges2.splice(index2, 1);
    return true;
  }

  hasVertex(vertex: T): boolean {
    return this.adjacencyList.has(vertex);
  }

  hasEdge(vertex1: T, vertex2: T): boolean {
    const edges = this.adjacencyList.get(vertex1);
    return edges ? edges.some((edge) => edge.target === vertex2) : false;
  }

  getNeighbors(vertex: T): Edge<T>[] {
    if (!this.hasVertex(vertex)) {
      throw new Error(`Vertex "${vertex}" does not exist.`);
    }

    return [...this.adjacencyList.get(vertex)!];
  }

  getEdgeWeight(vertex1: T, vertex2: T): number | undefined {
    const edges = this.adjacencyList.get(vertex1);
    const edge = edges?.find((e) => e.target === vertex2);
    return edge?.weight;
  }

  get vertexCount(): number {
    return this.adjacencyList.size;
  }

  getAllVertices(): T[] {
    return Array.from(this.adjacencyList.keys());
  }

  get edgeCount(): number {
    let count = 0;

    for (const edges of this.adjacencyList.values()) {
      count += edges.length;
    }

    return count / 2; // Divide by 2 because each edge is stored twice
  }

  getDegree(vertex: T): number {
    if (!this.hasVertex(vertex)) {
      throw new Error(`Vertex "${vertex}" does not exist.`);
    }

    return this.adjacencyList.get(vertex)!.length;
  }

  clear(): void {
    this.adjacencyList.clear();
  }

  getBFSOrder(startVertex: T): T[] {
    if (!this.hasVertex(startVertex)) {
      throw new Error(`Start vertex "${startVertex}" not found for BFS.`);
    }

    const traversalOrder: T[] = [];
    const visited = new Set<T>();
    const queue = new Queue<T>();

    queue.enqueue(startVertex);
    visited.add(startVertex);

    while (!queue.isEmpty()) {
      const currentVertex = queue.dequeue()!;
      traversalOrder.push(currentVertex);

      const neighbors = this.getNeighbors(currentVertex);
      for (const { target } of neighbors) {
        if (!visited.has(target)) {
          visited.add(target);
          queue.enqueue(target);
        }
      }
    }

    return traversalOrder;
  }

  getDFSOrder(startVertex: T): T[] {
    if (!this.hasVertex(startVertex)) {
      throw new Error(`Start vertex "${startVertex}" not found for DFS.`);
    }

    const visited = new Set<T>();
    const stack: T[] = [startVertex];
    const traversalOrder: T[] = [];

    while (stack.length > 0) {
      const vertex = stack.pop()!;

      if (!visited.has(vertex)) {
        visited.add(vertex);
        traversalOrder.push(vertex);

        const neighbors = this.getNeighbors(vertex);
        for (let i = neighbors.length - 1; i >= 0; i--) {
          const target = neighbors[i].target;
          if (!visited.has(target)) {
            stack.push(target);
          }
        }
      }
    }

    return traversalOrder;
  }

  traverseBFS(startVertex: T, callback: (vertex: T) => void): void {
    if (!this.hasVertex(startVertex)) {
      throw new Error(`Start vertex "${startVertex}" not found for BFS.`);
    }

    const visited = new Set<T>();
    const queue = new Queue<T>();

    queue.enqueue(startVertex);
    visited.add(startVertex);

    while (!queue.isEmpty()) {
      const currentVertex = queue.dequeue()!;
      callback(currentVertex);

      const neighbors = this.getNeighbors(currentVertex);
      for (const { target } of neighbors) {
        if (!visited.has(target)) {
          visited.add(target);
          queue.enqueue(target);
        }
      }
    }
  }

  traverseDFS(startVertex: T, callback: (vertex: T) => void): void {
    if (!this.hasVertex(startVertex)) {
      throw new Error(`Start vertex "${startVertex}" not found for DFS.`);
    }

    const visited = new Set<T>();
    const stack: T[] = [startVertex];

    while (stack.length > 0) {
      const vertex = stack.pop()!;

      if (!visited.has(vertex)) {
        visited.add(vertex);
        callback(vertex);

        const neighbors = this.getNeighbors(vertex);
        for (let i = neighbors.length - 1; i >= 0; i--) {
          const target = neighbors[i].target;
          if (!visited.has(target)) {
            stack.push(target);
          }
        }
      }
    }
  }

  hasCycle(): boolean {
    const visited = new Set<T>();

    const dfs = (vertex: T, parent: T | null): boolean => {
      visited.add(vertex);

      const neighbors = this.getNeighbors(vertex);

      for (const { target } of neighbors) {
        if (!visited.has(target)) {
          if (dfs(target, vertex)) return true;
        } else if (target !== parent) {
          // Found a visited vertex that's not the parent - cycle detected
          return true;
        }
      }

      return false;
    };

    for (const vertex of this.getAllVertices()) {
      if (!visited.has(vertex)) {
        if (dfs(vertex, null)) return true;
      }
    }

    return false;
  }

  hasPath(from: T, to: T): boolean {
    if (!this.hasVertex(from) || !this.hasVertex(to)) {
      return false;
    }

    if (from === to) {
      return true;
    }

    const visited = new Set<T>();
    const queue = new Queue<T>();

    queue.enqueue(from);
    visited.add(from);

    while (!queue.isEmpty()) {
      const vertex = queue.dequeue()!;
      const neighbors = this.getNeighbors(vertex);

      for (const { target } of neighbors) {
        if (target === to) {
          return true;
        }
        if (!visited.has(target)) {
          visited.add(target);
          queue.enqueue(target);
        }
      }
    }

    return false;
  }

  findShortestPath(from: T, to: T): T[] | undefined {
    if (!this.hasVertex(from) || !this.hasVertex(to)) {
      return undefined;
    }

    if (from === to) {
      return [from];
    }

    const visited = new Set<T>();
    const queue = new Queue<T>();
    queue.enqueue(from);
    const parent = new Map<T, T>();
    visited.add(from);

    while (!queue.isEmpty()) {
      const vertex = queue.dequeue()!;
      const neighbors = this.getNeighbors(vertex);

      for (const { target } of neighbors) {
        if (!visited.has(target)) {
          visited.add(target);
          parent.set(target, vertex);
          queue.enqueue(target);

          if (target === to) {
            const path: T[] = [];
            let current: T | undefined = to;
            while (current !== undefined) {
              path.unshift(current);
              current = parent.get(current);
            }
            return path;
          }
        }
      }
    }

    return undefined;
  }

  findShortestPathWeighted(
    from: T,
    to: T,
  ): { path: T[]; distance: number } | undefined {
    if (!this.hasVertex(from) || !this.hasVertex(to)) {
      return undefined;
    }

    if (from === to) {
      return { path: [from], distance: 0 };
    }

    const distances = new Map<T, number>();
    const previous = new Map<T, T | undefined>();
    const pq = new PriorityQueue<T>();

    for (const vertex of this.getAllVertices()) {
      const distance = vertex === from ? 0 : Infinity;
      distances.set(vertex, distance);
      previous.set(vertex, undefined);
      pq.enqueue(vertex, distance);
    }

    while (!pq.isEmpty()) {
      const current = pq.dequeue()!;
      const currentDist = distances.get(current)!;

      if (current === to) {
        break;
      }

      if (currentDist === Infinity) {
        break;
      }

      const neighbors = this.getNeighbors(current);
      for (const { target, weight } of neighbors) {
        const edgeWeight = weight ?? 1;
        const newDistance = currentDist + edgeWeight;
        const oldDistance = distances.get(target)!;

        if (newDistance < oldDistance) {
          distances.set(target, newDistance);
          previous.set(target, current);
          pq.updatePriority(target, newDistance);
        }
      }
    }

    const finalDistance = distances.get(to)!;
    if (finalDistance === Infinity) {
      return undefined;
    }

    const path: T[] = [];
    let current: T | undefined = to;
    while (current !== undefined) {
      path.unshift(current);
      current = previous.get(current);
    }

    return { path, distance: finalDistance };
  }

  getConnectedComponents(): T[][] {
    const visited = new Set<T>();
    const components: T[][] = [];

    const dfs = (vertex: T, component: T[]): void => {
      visited.add(vertex);
      component.push(vertex);

      const neighbors = this.getNeighbors(vertex);
      for (const { target } of neighbors) {
        if (!visited.has(target)) {
          dfs(target, component);
        }
      }
    };

    for (const vertex of this.getAllVertices()) {
      if (!visited.has(vertex)) {
        const component: T[] = [];
        dfs(vertex, component);
        components.push(component);
      }
    }

    return components;
  }

  isConnected(): boolean {
    if (this.vertexCount === 0) return true;

    const components = this.getConnectedComponents();
    return components.length === 1;
  }

  findMinimumSpanningTree(
    startVertex?: T,
  ):
    | { edges: Array<{ from: T; to: T; weight: number }>; totalWeight: number }
    | undefined {
    if (this.vertexCount === 0) {
      return { edges: [], totalWeight: 0 };
    }

    const start = startVertex ?? this.getAllVertices()[0];
    if (!this.hasVertex(start)) {
      throw new Error(`Start vertex "${start}" does not exist.`);
    }

    const visited = new Set<T>();
    const mstEdges: Array<{ from: T; to: T; weight: number }> = [];
    const pq = new PriorityQueue<{
      vertex: T;
      from: T | null;
      weight: number;
    }>();
    let totalWeight = 0;

    pq.enqueue({ vertex: start, from: null, weight: 0 }, 0);

    while (!pq.isEmpty()) {
      const { vertex, from, weight } = pq.dequeue()!;

      if (visited.has(vertex)) continue;

      visited.add(vertex);

      if (from !== null) {
        mstEdges.push({ from, to: vertex, weight });
        totalWeight += weight;
      }

      const neighbors = this.getNeighbors(vertex);
      for (const { target, weight: edgeWeight } of neighbors) {
        if (!visited.has(target)) {
          const w = edgeWeight ?? 1;
          pq.enqueue({ vertex: target, from: vertex, weight: w }, w);
        }
      }
    }

    // Check if all vertices were visited (graph is connected)
    if (visited.size !== this.vertexCount) {
      return undefined;
    }

    return { edges: mstEdges, totalWeight };
  }

  findMinimumSpanningTreeKruskal():
    | { edges: Array<{ from: T; to: T; weight: number }>; totalWeight: number }
    | undefined {
    if (this.vertexCount === 0) {
      return { edges: [], totalWeight: 0 };
    }

    // Get all edges
    const allEdges: Array<{ from: T; to: T; weight: number }> = [];
    const processedPairs = new Set<string>();

    for (const [vertex, edges] of this.adjacencyList) {
      for (const { target, weight } of edges) {
        const pairKey = [vertex, target].sort().join('-');
        if (!processedPairs.has(pairKey)) {
          processedPairs.add(pairKey);
          allEdges.push({ from: vertex, to: target, weight: weight ?? 1 });
        }
      }
    }

    // Sort edges by weight
    allEdges.sort((a, b) => a.weight - b.weight);

    // Union-Find data structure
    const parent = new Map<T, T>();
    const rank = new Map<T, number>();

    const find = (vertex: T): T => {
      if (parent.get(vertex) !== vertex) {
        parent.set(vertex, find(parent.get(vertex)!));
      }
      return parent.get(vertex)!;
    };

    const union = (v1: T, v2: T): boolean => {
      const root1 = find(v1);
      const root2 = find(v2);

      if (root1 === root2) return false;

      const rank1 = rank.get(root1) ?? 0;
      const rank2 = rank.get(root2) ?? 0;

      if (rank1 < rank2) {
        parent.set(root1, root2);
      } else if (rank1 > rank2) {
        parent.set(root2, root1);
      } else {
        parent.set(root2, root1);
        rank.set(root1, rank1 + 1);
      }

      return true;
    };

    // Initialize Union-Find
    for (const vertex of this.getAllVertices()) {
      parent.set(vertex, vertex);
      rank.set(vertex, 0);
    }

    const mstEdges: Array<{ from: T; to: T; weight: number }> = [];
    let totalWeight = 0;

    for (const edge of allEdges) {
      if (union(edge.from, edge.to)) {
        mstEdges.push(edge);
        totalWeight += edge.weight;

        if (mstEdges.length === this.vertexCount - 1) {
          break;
        }
      }
    }

    if (mstEdges.length !== this.vertexCount - 1) {
      return undefined;
    }

    return { edges: mstEdges, totalWeight };
  }

  isBipartite(): { setA: T[]; setB: T[] } | undefined {
    if (this.vertexCount === 0) {
      return { setA: [], setB: [] };
    }

    const color = new Map<T, 0 | 1>();

    const bfs = (start: T): boolean => {
      const queue = new Queue<T>();
      queue.enqueue(start);
      color.set(start, 0);

      while (!queue.isEmpty()) {
        const vertex = queue.dequeue()!;
        const currentColor = color.get(vertex)!;
        const nextColor = (1 - currentColor) as 0 | 1;

        const neighbors = this.getNeighbors(vertex);
        for (const { target } of neighbors) {
          if (!color.has(target)) {
            color.set(target, nextColor);
            queue.enqueue(target);
          } else if (color.get(target) === currentColor) {
            return false; // Same color as current vertex - not bipartite
          }
        }
      }

      return true;
    };

    // Check all components
    for (const vertex of this.getAllVertices()) {
      if (!color.has(vertex)) {
        if (!bfs(vertex)) {
          return undefined;
        }
      }
    }

    // Separate vertices into two sets
    const setA: T[] = [];
    const setB: T[] = [];

    for (const [vertex, c] of color) {
      if (c === 0) {
        setA.push(vertex);
      } else {
        setB.push(vertex);
      }
    }

    return { setA, setB };
  }

  clone(): UndirectedGraph<T> {
    const cloned = new UndirectedGraph<T>();

    for (const vertex of this.getAllVertices()) {
      cloned.addVertex(vertex);
    }

    const processedPairs = new Set<string>();

    for (const [source, edges] of this.adjacencyList) {
      for (const { target, weight } of edges) {
        const pairKey = [source, target].sort().join('-');
        if (!processedPairs.has(pairKey)) {
          processedPairs.add(pairKey);
          cloned.addEdge(source, target, weight);
        }
      }
    }

    return cloned;
  }

  toString(): string {
    let result = 'UndirectedGraph:\n';
    for (const [vertex, edges] of this.adjacencyList) {
      const edgeStr = edges
        .map(
          (e) => `${e.target}${e.weight !== undefined ? `(${e.weight})` : ''}`,
        )
        .join(', ');
      result += `  ${vertex} -- [${edgeStr}]\n`;
    }
    return result;
  }

  *[Symbol.iterator](): Iterator<[T, Edge<T>[]]> {
    for (const [vertex, edges] of this.adjacencyList) {
      yield [vertex, [...edges]];
    }
  }
}

export default UndirectedGraph;
