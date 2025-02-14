class UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    if (size <= 0) throw new Error('Size must be a positive number');
    this.parent = Array.from({ length: size }, (_, index) => index);
    this.rank = Array(size).fill(0);
  }

  // Find the root of the set containing element x, with path compression
  find(x: number): number {
    if (x < 0 || x >= this.parent.length) {
      throw new RangeError(`Element index ${x} is out of bounds`);
    }

    if (this.parent[x] !== x) {
      // Path compression: Make every node on the path point directly to the root
      this.parent[x] = this.find(this.parent[x]);
    }

    return this.parent[x];
  }

  // Union by rank: Merge two sets if they are different
  union(x: number, y: number): void {
    if (x < 0 || x >= this.parent.length || y < 0 || y >= this.parent.length) {
      throw new RangeError(`Element index ${x} or ${y} is out of bounds`);
    }

    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX !== rootY) {
      // Union by rank
      if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      } else if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
      } else {
        this.parent[rootY] = rootX;
        this.rank[rootX] += 1;
      }
    }
  }

  // Check if two elements are in the same set
  isConnected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }

  getParent(): number[] {
    return this.parent.slice();
  }
}

export default UnionFind;
