// =========================================================================
// BASE INTERFACE
// =========================================================================

/**
 * Base interface defining common operations for all graph types.
 * This interface contains only operations that make sense for both
 * directed and undirected graphs.
 *
 * @template T - The type of values stored in vertices
 */
export interface IGraph<T> {
  // CORE STRUCTURE MANIPULATION

  /**
   * Adds a vertex to the graph.
   * @param vertex - The vertex to add
   */
  addVertex(vertex: T): void;

  /**
   * Removes a vertex and all connected edges.
   * @param vertex - The vertex to remove
   * @returns true if removed, false if vertex didn't exist
   */
  removeVertex(vertex: T): boolean;

  /**
   * Adds an edge between two vertices.
   * For directed graphs: creates edge from -> to
   * For undirected graphs: creates bidirectional connection
   * @param from - Source vertex (or first vertex for undirected)
   * @param to - Target vertex (or second vertex for undirected)
   * @param weight - Optional edge weight
   */
  addEdge(from: T, to: T, weight?: number): void;

  /**
   * Removes an edge between two vertices.
   * For directed graphs: removes edge from -> to only
   * For undirected graphs: removes bidirectional connection
   * @param from - Source vertex (or first vertex for undirected)
   * @param to - Target vertex (or second vertex for undirected)
   * @returns true if removed, false if edge didn't exist
   */
  removeEdge(from: T, to: T): boolean;

  // QUERYING METHODS

  /**
   * Checks if a vertex exists in the graph.
   * @param vertex - The vertex to check
   * @returns true if the vertex exists
   */
  hasVertex(vertex: T): boolean;

  /**
   * Checks if an edge exists between two vertices.
   * For undirected graphs: checks both directions
   * @param from - Source vertex (or first vertex for undirected)
   * @param to - Target vertex (or second vertex for undirected)
   * @returns true if the edge exists
   */
  hasEdge(from: T, to: T): boolean;

  /**
   * Gets all neighbors of a vertex (vertices connected by an edge).
   * @param vertex - The vertex to get neighbors for
   * @returns Array of neighbor objects with target and optional weight
   */
  getNeighbors(vertex: T): Array<{ target: T; weight?: number }>;

  /**
   * Gets the weight of an edge.
   * @param from - Source vertex (or first vertex for undirected)
   * @param to - Target vertex (or second vertex for undirected)
   * @returns The edge weight, or undefined if edge doesn't exist
   */
  getEdgeWeight(from: T, to: T): number | undefined;

  /**
   * Gets all vertices in the graph.
   * @returns Array of all vertices
   */
  getAllVertices(): T[];

  /**
   * Gets the total number of vertices.
   */
  readonly vertexCount: number;

  /**
   * Gets the total number of edges.
   * For undirected graphs: each edge is counted once (not twice)
   */
  readonly edgeCount: number;

  /**
   * Gets the degree of a vertex (number of edges connected to it).
   * For directed graphs: returns out-degree
   * For undirected graphs: returns total degree
   * @param vertex - The vertex to check
   * @returns The degree
   */
  getDegree(vertex: T): number;

  // TRAVERSAL METHODS

  /**
   * Performs DFS and returns vertices in visited order.
   * @param startVertex - The vertex to start traversal from
   * @returns Array of vertices in DFS order
   */
  getDFSOrder(startVertex: T): T[];

  /**
   * Performs DFS and executes a callback on each visited vertex.
   * @param startVertex - The vertex to start traversal from
   * @param callback - Function to execute on each vertex
   */
  traverseDFS(startVertex: T, callback: (vertex: T) => void): void;

  /**
   * Performs BFS and returns vertices in visited order.
   * @param startVertex - The vertex to start traversal from
   * @returns Array of vertices in BFS order
   */
  getBFSOrder(startVertex: T): T[];

  /**
   * Performs BFS and executes a callback on each visited vertex.
   * @param startVertex - The vertex to start traversal from
   * @param callback - Function to execute on each vertex
   */
  traverseBFS(startVertex: T, callback: (vertex: T) => void): void;

  // CYCLE DETECTION

  /**
   * Checks if the graph contains a cycle.
   * @returns true if a cycle exists
   */
  hasCycle(): boolean;

  // CONNECTED COMPONENTS

  /**
   * Finds all connected components in the graph.
   * For directed graphs: returns strongly connected components
   * For undirected graphs: returns connected components
   * @returns Array of components, where each component is an array of vertices
   */
  getConnectedComponents(): T[][];

  // PATH FINDING

  /**
   * Checks if a path exists between two vertices.
   * @param from - Source vertex
   * @param to - Target vertex
   * @returns true if a path exists
   */
  hasPath(from: T, to: T): boolean;

  /**
   * Finds the shortest path between two vertices (unweighted).
   * @param from - Source vertex
   * @param to - Target vertex
   * @returns Array of vertices representing the path, or undefined if no path exists
   */
  findShortestPath(from: T, to: T): T[] | undefined;

  // UTILITY METHODS

  /**
   * Removes all vertices and edges from the graph.
   */
  clear(): void;

  /**
   * Returns a string representation of the graph.
   * @returns String representation
   */
  toString(): string;
}

// =========================================================================
// DIRECTED INTERFACE
// =========================================================================

/**
 * Interface for directed graph specific operations.
 * Extends the base graph interface with operations that only make sense
 * for directed graphs (where edges have direction).
 *
 * @template T - The type of values stored in vertices
 */
export interface IDirectedGraph<T> extends IGraph<T> {
  /**
   * Gets the out-degree of a vertex (number of outgoing edges).
   * @param vertex - The vertex to check
   * @returns The out-degree
   */
  getOutDegree(vertex: T): number;

  /**
   * Gets the in-degree of a vertex (number of incoming edges).
   * @param vertex - The vertex to check
   * @returns The in-degree
   */
  getInDegree(vertex: T): number;

  /**
   * Gets all predecessor vertices (vertices with edges pointing to this vertex).
   * @param vertex - The vertex to find predecessors for
   * @returns Array of predecessor vertices
   */
  getPredecessors(vertex: T): T[];

  /**
   * Performs topological sort using Kahn's algorithm.
   * Only valid for DAGs (Directed Acyclic Graphs).
   * @returns Array of vertices in topological order, or undefined if graph has a cycle
   */
  topologicalSort(): T[] | undefined;

  /**
   * Performs topological sort using DFS.
   * Only valid for DAGs (Directed Acyclic Graphs).
   * @returns Array of vertices in topological order, or undefined if graph has a cycle
   */
  topologicalSortDFS(): T[] | undefined;

  /**
   * Finds all strongly connected components using Kosaraju's algorithm.
   * @returns Array of SCCs, where each SCC is an array of vertices
   */
  getStronglyConnectedComponents(): T[][];

  /**
   * Creates a transpose of the graph (all edges reversed).
   * @returns A new directed graph with edges reversed
   */
  transpose(): IDirectedGraph<T>;

  /**
   * Checks if the graph is a DAG (Directed Acyclic Graph).
   * @returns true if the graph has no cycles
   */
  isDAG(): boolean;

  /**
   * Gets all source vertices (vertices with no incoming edges).
   * @returns Array of source vertices
   */
  getSources(): T[];

  /**
   * Gets all sink vertices (vertices with no outgoing edges).
   * @returns Array of sink vertices
   */
  getSinks(): T[];
}

// =========================================================================
// UNDIRECTED INTERFACE
// =========================================================================

/**
 * Interface for undirected graph specific operations.
 * Extends the base graph interface with operations specific to undirected graphs.
 *
 * @template T - The type of values stored in vertices
 */
export interface IUndirectedGraph<T> extends IGraph<T> {
  /**
   * Checks if the graph is a tree (connected and acyclic).
   * @returns true if the graph is a tree
   */
  isTree(): boolean;

  /**
   * Checks if the graph is connected (all vertices reachable from any vertex).
   * @returns true if the graph is connected
   */
  isConnected(): boolean;

  /**
   * Finds a minimum spanning tree using Kruskal's or Prim's algorithm.
   * Only valid for connected, weighted graphs.
   * @returns A new graph representing the MST, or undefined if graph is not connected
   */
  getMinimumSpanningTree?(): IUndirectedGraph<T> | undefined;

  /**
   * Checks if the graph is bipartite (can be 2-colored).
   * @returns true if the graph is bipartite
   */
  isBipartite(): boolean;

  /**
   * If bipartite, returns the two sets of vertices.
   * @returns Two sets of vertices, or undefined if not bipartite
   */
  getBipartiteSets(): [T[], T[]] | undefined;
}
