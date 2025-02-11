class HashTable<K, V> {
  private table: Array<[K, V][]> = [];
  size: number;
  count: number;

  constructor(size = 19) {
    this.size = size;
    this.count = 0;
    this.table = new Array(size).fill(undefined).map(() => []);
  }

  set(key: K, value: V): void {
    if (this.count >= this.size * 0.75) {
      this.resize();
    }

    const index = this.hash(key);
    const bucket = this.table[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }

    bucket.push([key, value]);
    this.count++;
  }

  get(key: K): V | undefined {
    const index = this.hash(key);
    const bucket = this.table[index];

    for (const [k, v] of bucket) {
      if (k === key) return v;
    }

    return undefined;
  }

  delete(key: K): void {
    const index = this.hash(key);
    const bucket = this.table[index];
    const idx = bucket.findIndex(([k]) => k === key);

    if (idx !== -1) {
      bucket.splice(idx, 1);
      this.count--;
    }
  }

  private resize(): void {
    const newSize = this.size * 2;
    const newTable: Array<[K, V][]> = new Array(newSize)
      .fill(undefined)
      .map(() => []);

    for (const bucket of this.table) {
      for (const [key, value] of bucket) {
        const newIndex = this.hashForSize(key, newSize); // Use hashForSize here!
        newTable[newIndex].push([key, value]);
      }
    }

    this.table = newTable;
    this.size = newSize;
  }

  private hash(key: K): number {
    return this.hashForSize(key, this.size); // Use hashForSize consistently
  }

  private hashForSize(key: K, size: number): number {
    let hash = 0;
    if (typeof key === 'string') {
      for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) % size; // Use the provided size
      }
    } else if (typeof key === 'number') {
      hash = key % size; // Use the provided size
    } else {
      hash = this.hashString(JSON.stringify(key)) % size; // Use the provided size
    }

    return hash;
  }

  private hashString(key: string): number {
    let hash = 0;

    for (let i = 0; i < key.length; i++) {
      hash = hash * 31 + key.charCodeAt(i); // No modulo here, it's done in hashForSize
    }

    return hash;
  }
}

export default HashTable;
