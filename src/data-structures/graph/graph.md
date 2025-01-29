# What is a Graph?

A graph is a non-linear data structure consisting of nodes (or vertices) and edges. The nodes are the points or vertices in the graph, and the edges are the lines connecting these nodes. It is a way of representing relationships between objects. The nodes represent entities (like people, cities, or websites), and the edges represent the connections or relationships between them (like friendships, roads, or hyperlinks).

## Types of Graphs

1. **Directed vs. Undirected Graphs**

   - **Directed Graph (Digraph):** The edges have a direction, meaning they go from one vertex to another. For example, if you have a directed graph where an edge is `(A → B)`, it means there is a connection from A to B, but not necessarily from B to A.
   - **Undirected Graph:** The edges have no direction, meaning if there’s an edge between A and B, it’s the same as from B to A.

2. **Weighted vs. Unweighted Graphs**

   - **Weighted Graph:** Each edge has a weight associated with it. The weight represents the cost or distance between the nodes it connects.
   - **Unweighted Graph:** The edges have no weight, and all edges are considered equal.

3. **Cyclic vs. Acyclic Graphs**

   - **Cyclic Graph:** A graph that contains at least one cycle, meaning you can start at a vertex and follow a path that eventually leads back to the same vertex.
   - **Acyclic Graph:** A graph with no cycles. An example of this is a **tree** (which is a special type of graph).

4. **Connected vs. Disconnected Graphs**

   - **Connected Graph:** In an undirected graph, a graph is connected if there is a path between any two vertices.
   - **Disconnected Graph:** If there is at least one pair of vertices that cannot be reached from each other, the graph is disconnected.

5. **Complete Graph**
   - A graph in which there is an edge between every pair of vertices.

## Graph Representations

There are two common ways to represent a graph:

- Adjacency Matrix
- Adjacency List

  **Adjacency Matrix**

  - A 2D array where each cell `(i, j)` represents whether there is an edge between vertex `i` and vertex `j`. If there's an edge, the matrix contains the edge's weight or `1`; if there's no edge, it contains `0` or `null`.
  - Pros: Easy to check if an edge exists between two nodes.
  - Cons: Space-inefficient for sparse graphs (graphs with fewer edges).

  Example (adjacency matrix of a graph):

  ```
  0  1  0  1
  1  0  1  0
  0  1  0  1
  1  0  1  0

  ```

  **Adjacency List**

  - A list of lists (or a dictionary of lists in JavaScript/TypeScript) where each vertex has a list of vertices connected to it.
  - Pros: Space-efficient for sparse graphs.
  - Cons: Harder to check for the presence of a specific edge.

  Example (adjacency list of the same graph):

  ```ts
  const graph = {
    0: [1, 3],
    1: [0, 2],
    2: [1, 3],
    3: [0, 2],
  };
  ```
