/**
 * Union-Find (Disjoint Set Union) data structure with path compression and union by rank.
 * Efficiently manages disjoint sets and supports near-constant time union and find operations.
 */
class UnionFind {
  private parent: number[];
  private rank: number[];
  private componentCount: number;
  private componentSize: number[];

  /**
   * Creates a new Union-Find data structure.
   * @param size - The number of elements (must be positive)
   * @throws {Error} If size is not a positive number
   *
   * @timeComplexity O(n) - Initialize n elements
   * @spaceComplexity O(n) - Store parent, rank, and size arrays
   */
  constructor(size: number) {
    if (size <= 0) {
      throw new Error('Size must be a positive number');
    }

    this.parent = Array.from({ length: size }, (_, index) => index);
    this.rank = Array(size).fill(0);
    this.componentSize = Array(size).fill(1);
    this.componentCount = size;
  }

  /**
   * Finds the root of the set containing element x with path compression.
   * Path compression flattens the tree structure for faster subsequent operations.
   *
   * @param x - The element to find the root of
   * @returns The root of the set containing x
   * @throws {RangeError} If x is out of bounds
   *
   * @timeComplexity O(α(n)) - Inverse Ackermann function, practically constant
   * @spaceComplexity O(α(n)) - Recursion stack depth for path compression
   */
  find(x: number): number {
    this.validateIndex(x);

    if (this.parent[x] !== x) {
      // Path compression: make every node point directly to the root
      this.parent[x] = this.find(this.parent[x]);
    }

    return this.parent[x];
  }

  /**
   * Unites the sets containing elements x and y using union by rank.
   * Returns true if the sets were merged, false if already in the same set.
   *
   * @param x - First element
   * @param y - Second element
   * @returns True if sets were merged, false if already connected
   * @throws {RangeError} If x or y is out of bounds
   *
   * @timeComplexity O(α(n)) - Inverse Ackermann function, practically constant
   * @spaceComplexity O(α(n)) - Due to find operation
   */
  union(x: number, y: number): boolean {
    this.validateIndex(x);
    this.validateIndex(y);

    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false; // Already in the same set

    // Union by rank: attach smaller rank tree under root of higher rank tree
    if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
      this.componentSize[rootX] += this.componentSize[rootY];
    } else if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
      this.componentSize[rootY] += this.componentSize[rootX];
    } else {
      this.parent[rootY] = rootX;
      this.componentSize[rootX] += this.componentSize[rootY];
      this.rank[rootX]++;
    }

    this.componentCount--;

    return true;
  }

  /**
   * Checks if two elements are in the same set.
   *
   * @param x - First element
   * @param y - Second element
   * @returns True if x and y are in the same set
   * @throws {RangeError} If x or y is out of bounds
   *
   * @timeComplexity O(α(n)) - Inverse Ackermann function, practically constant
   * @spaceComplexity O(α(n)) - Due to find operation
   */
  isConnected(x: number, y: number): boolean {
    this.validateIndex(x);
    this.validateIndex(y);

    return this.find(x) === this.find(y);
  }

  /**
   * Gets the number of disjoint sets.
   *
   * @returns The number of disjoint components
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  getComponentCount(): number {
    return this.componentCount;
  }

  /**
   * Gets the size of the component containing element x.
   *
   * @param x - The element to check
   * @returns The size of the component containing x
   * @throws {RangeError} If x is out of bounds
   *
   * @timeComplexity O(α(n)) - Due to find operation
   * @spaceComplexity O(α(n)) - Due to find operation
   */
  getComponentSize(x: number): number {
    this.validateIndex(x);
    const root = this.find(x);

    return this.componentSize[root];
  }

  /**
   * Gets a copy of the parent array (useful for debugging).
   *
   * @returns A copy of the internal parent array
   *
   * @timeComplexity O(n)
   * @spaceComplexity O(n)
   */
  getParent(): number[] {
    return this.parent.slice();
  }

  /**
   * Gets the total number of elements in the data structure.
   *
   * @returns The size of the Union-Find structure
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  getSize(): number {
    return this.parent.length;
  }

  /**
   * Resets the Union-Find structure to its initial state where each element is its own set.
   *
   * @timeComplexity O(n)
   * @spaceComplexity O(1)
   */
  reset(): void {
    const size = this.parent.length;

    for (let i = 0; i < size; i++) {
      this.parent[i] = i;
      this.rank[i] = 0;
      this.componentSize[i] = 1;
    }

    this.componentCount = size;
  }

  /**
   * Validates that an index is within bounds.
   *
   * @param x - The index to validate
   * @throws {RangeError} If x is out of bounds
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  private validateIndex(x: number): void {
    if (x < 0 || x >= this.parent.length) {
      throw new RangeError(
        `Element index ${x} is out of bounds [0, ${this.parent.length - 1}]`,
      );
    }
  }
}

export default UnionFind;
