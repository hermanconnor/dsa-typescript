/**
 * A generic HashSet implementation that stores unique values.
 * Implements its own hash table using separate chaining for collision resolution.
 * Supports any value type with identity-based hashing for objects.
 *
 * @template T - The type of values maintained by this set
 *
 * @example
 * const set = new HashSet<string>();
 * set.add('apple');
 * set.add('banana');
 * set.has('apple'); // true
 */
class HashSet<T> {
  /** Internal storage: array of buckets (chains) for collision handling */
  private buckets: Array<Array<T>>;

  /** Current number of values stored */
  private _size: number;

  /** Current capacity (number of buckets) */
  private capacity: number;

  /** Threshold ratio for triggering resize (default: 0.75) */
  private readonly loadFactor: number;

  /** WeakMap for assigning unique IDs to object values (enables identity-based hashing) */
  private readonly objectIds = new WeakMap<object, number>();

  /** Counter for generating unique object IDs */
  private nextObjectId = 1;

  /**
   * Creates a new HashSet instance.
   *
   * @param initialCapacity - Initial number of buckets (default: 16)
   * @param loadFactor - Threshold for resizing: size/capacity (default: 0.75)
   * @throws {Error} If initialCapacity is not positive or loadFactor is not in (0, 1]
   *
   * Time Complexity: O(n) where n = initialCapacity
   * Space Complexity: O(n) where n = initialCapacity
   */
  constructor(initialCapacity: number = 16, loadFactor: number = 0.75) {
    if (initialCapacity <= 0) {
      throw new Error('Initial capacity must be positive');
    }
    if (loadFactor <= 0 || loadFactor > 1) {
      throw new Error('Load factor must be between 0 and 1');
    }

    this.capacity = initialCapacity;
    this.loadFactor = loadFactor;
    this._size = 0;
    this.buckets = this.createBuckets(this.capacity);
  }

  /**
   * Creates an array of empty buckets.
   *
   * @param capacity - Number of buckets to create
   * @returns Array of empty bucket arrays
   *
   * Time Complexity: O(n) where n = capacity
   * Space Complexity: O(n)
   */
  private createBuckets(capacity: number): Array<Array<T>> {
    return new Array(capacity).fill(null).map(() => []);
  }

  /**
   * Generates a hash code for the value and maps it to a bucket index.
   * Uses identity-based hashing for objects via WeakMap IDs.
   * Implements a variant of the DJB2 hash algorithm.
   *
   * @param value - The value to hash
   * @returns Bucket index in range [0, capacity)
   *
   * Time Complexity: O(k) where k = string length of the value representation
   * Space Complexity: O(1) amortized (WeakMap entries don't count as they're GC-eligible)
   */
  private hash(value: T): number {
    let hash = 5381; // DJB2 initial value
    let str: string;

    // Convert value to string representation based on type
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      str = String(value);
    } else if (typeof value === 'object' && value !== null) {
      // Identity-based hashing for object values
      let id = this.objectIds.get(value);

      if (id === undefined) {
        id = this.nextObjectId++;
        this.objectIds.set(value, id);
      }

      str = `obj:${id}`;
    } else {
      // Handle undefined, null, symbols, etc.
      str = String(value);
    }

    // DJB2 hash algorithm: hash * 33 + char
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) + hash + char;
      hash |= 0; // Convert to 32-bit signed integer
    }

    // Ensure positive index
    return (hash >>> 0) % this.capacity;
  }

  /**
   * Resizes the internal bucket array when the load factor threshold is exceeded.
   * Doubles the capacity and rehashes all existing values.
   *
   * Time Complexity: O(n) where n = number of values (each value rehashed once)
   * Space Complexity: O(m) where m = new capacity
   */
  private resize(): void {
    const oldBuckets = this.buckets;

    this.capacity *= 2;
    this.buckets = this.createBuckets(this.capacity);
    this._size = 0;

    // Rehash all existing values into new buckets
    for (const bucket of oldBuckets) {
      for (const value of bucket) {
        this.add(value);
      }
    }
  }

  /**
   * Adds a value to the set.
   * If the value already exists, the set is unchanged.
   * Triggers resize if load factor threshold is exceeded.
   *
   * @param value - The value to add
   * @returns The HashSet instance for chaining
   *
   * Time Complexity: O(1) average, O(n) worst case (with resize)
   * Space Complexity: O(1) amortized
   */
  add(value: T): HashSet<T> {
    const idx = this.hash(value);
    const bucket = this.buckets[idx];

    // Check if value already exists
    for (const v of bucket) {
      if (v === value) {
        return this; // Value already exists, no need to add
      }
    }

    // Add new value
    bucket.push(value);
    this._size++;

    // Check if resize is needed
    if (this._size / this.capacity > this.loadFactor) {
      this.resize();
    }

    return this;
  }

  /**
   * Checks if a value exists in the set.
   *
   * @param value - The value to check
   * @returns true if the value exists, false otherwise
   *
   * Time Complexity: O(1) average, O(n) worst case where n = values in bucket
   * Space Complexity: O(1)
   */
  has(value: T): boolean {
    const idx = this.hash(value);
    const bucket = this.buckets[idx];

    for (const v of bucket) {
      if (v === value) {
        return true;
      }
    }

    return false;
  }

  /**
   * Removes a value from the set.
   * Uses swap-and-pop for O(1) removal (order of bucket values doesn't matter).
   *
   * @param value - The value to remove
   * @returns true if the value was found and removed, false otherwise
   *
   * Time Complexity: O(1) average, O(n) worst case where n = values in bucket
   * Space Complexity: O(1)
   */
  delete(value: T): boolean {
    const idx = this.hash(value);
    const bucket = this.buckets[idx];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i] === value) {
        // Swap with last element and pop (O(1) removal)
        const lastIndex = bucket.length - 1;
        if (i !== lastIndex) {
          bucket[i] = bucket[lastIndex];
        }

        bucket.pop();
        this._size--;

        return true;
      }
    }

    return false;
  }

  /**
   * Gets the number of values in the set.
   *
   * @returns The size of the set
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  size(): number {
    return this._size;
  }

  /**
   * Checks if the set is empty.
   *
   * @returns true if the set has no values, false otherwise
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Removes all values from the set while maintaining capacity.
   *
   * Time Complexity: O(m) where m = capacity
   * Space Complexity: O(m)
   */
  clear(): void {
    this.buckets = this.createBuckets(this.capacity);
    this._size = 0;
  }

  /**
   * Returns the current load factor (size / capacity).
   * Useful for performance monitoring.
   *
   * @returns Current load factor as a decimal
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  getLoadFactor(): number {
    return this._size / this.capacity;
  }

  /**
   * Returns the current capacity (number of buckets).
   *
   * @returns Current capacity
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  getCapacity(): number {
    return this.capacity;
  }

  /**
   * Executes a callback function for each value in the set.
   *
   * @param callback - Function to execute for each value
   * @param thisArg - Value to use as 'this' when executing callback
   *
   * Time Complexity: O(n + m) where n = values, m = capacity
   * Space Complexity: O(1)
   */
  forEach(
    callback: (value: T, value2: T, set: HashSet<T>) => void,
    thisArg?: unknown,
  ): void {
    const boundCallback =
      thisArg !== undefined ? callback.bind(thisArg) : callback;

    for (const bucket of this.buckets) {
      for (const value of bucket) {
        boundCallback(value, value, this);
      }
    }
  }

  /**
   * Creates a new set with values that exist in both this set and another set.
   *
   * @param other - The other set to intersect with
   * @returns A new HashSet containing the intersection
   *
   * Time Complexity: O(min(n, m)) where n, m = sizes of the two sets
   * Space Complexity: O(min(n, m))
   */
  intersection(other: HashSet<T>): HashSet<T> {
    const result = new HashSet<T>();

    // Iterate over the smaller set for efficiency
    const smaller = this.size() <= other.size() ? this : other;
    const larger = this.size() <= other.size() ? other : this;

    for (const value of smaller) {
      if (larger.has(value)) {
        result.add(value);
      }
    }

    return result;
  }

  /**
   * Creates a new set with values that exist in either this set or another set.
   *
   * @param other - The other set to union with
   * @returns A new HashSet containing the union
   *
   * Time Complexity: O(n + m) where n, m = sizes of the two sets
   * Space Complexity: O(n + m)
   */
  union(other: HashSet<T>): HashSet<T> {
    const result = new HashSet<T>();

    for (const value of this) {
      result.add(value);
    }

    for (const value of other) {
      result.add(value);
    }

    return result;
  }

  /**
   * Creates a new set with values that exist in this set but not in another set.
   *
   * @param other - The other set to diff against
   * @returns A new HashSet containing the difference
   *
   * Time Complexity: O(n) where n = size of this set
   * Space Complexity: O(n)
   */
  difference(other: HashSet<T>): HashSet<T> {
    const result = new HashSet<T>();

    for (const value of this) {
      if (!other.has(value)) {
        result.add(value);
      }
    }

    return result;
  }

  /**
   * Creates a new set with values that exist in either set but not in both.
   *
   * @param other - The other set to compute symmetric difference with
   * @returns A new HashSet containing the symmetric difference
   *
   * Time Complexity: O(n + m) where n, m = sizes of the two sets
   * Space Complexity: O(n + m)
   */
  symmetricDifference(other: HashSet<T>): HashSet<T> {
    const result = new HashSet<T>();

    // Add values from this set that aren't in other
    for (const value of this) {
      if (!other.has(value)) {
        result.add(value);
      }
    }

    // Add values from other set that aren't in this
    for (const value of other) {
      if (!this.has(value)) {
        result.add(value);
      }
    }

    return result;
  }

  /**
   * Checks if this set is a subset of another set.
   *
   * @param other - The other set to check against
   * @returns true if all values in this set exist in the other set
   *
   * Time Complexity: O(n) where n = size of this set
   * Space Complexity: O(1)
   */
  isSubsetOf(other: HashSet<T>): boolean {
    if (this.size() > other.size()) {
      return false;
    }

    for (const value of this) {
      if (!other.has(value)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Checks if this set is a superset of another set.
   *
   * @param other - The other set to check against
   * @returns true if all values in the other set exist in this set
   *
   * Time Complexity: O(m) where m = size of other set
   * Space Complexity: O(1)
   */
  isSupersetOf(other: HashSet<T>): boolean {
    return other.isSubsetOf(this);
  }

  /**
   * Checks if this set has no values in common with another set.
   *
   * @param other - The other set to check against
   * @returns true if the sets have no values in common
   *
   * Time Complexity: O(min(n, m)) where n, m = sizes of the two sets
   * Space Complexity: O(1)
   */
  isDisjointFrom(other: HashSet<T>): boolean {
    // Check the smaller set for efficiency
    const smaller = this.size() <= other.size() ? this : other;
    const larger = this.size() <= other.size() ? other : this;

    for (const value of smaller) {
      if (larger.has(value)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Converts the set to an array.
   *
   * @returns Array containing all values in the set
   *
   * Time Complexity: O(n + m) where n = values, m = capacity
   * Space Complexity: O(n)
   */
  toArray(): T[] {
    return Array.from(this.values());
  }

  /**
   * Returns a string representation of the set.
   *
   * @returns String representation
   *
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  toString(): string {
    return `HashSet(${this.size()}) { ${this.toArray().join(', ')} }`;
  }

  /**
   * Returns an iterator over the values.
   *
   * Time Complexity: O(n + m) total iteration where n = values, m = capacity
   * Space Complexity: O(1) per iteration
   */
  *values(): IterableIterator<T> {
    for (const bucket of this.buckets) {
      for (const value of bucket) {
        yield value;
      }
    }
  }

  /**
   * Returns an iterator over the values (alias for values()).
   * Provided for Set API compatibility.
   *
   * Time Complexity: O(n + m) total iteration where n = values, m = capacity
   * Space Complexity: O(1) per iteration
   */
  *keys(): IterableIterator<T> {
    yield* this.values();
  }

  /**
   * Returns an iterator over [value, value] tuples.
   * Provided for Set API compatibility (both elements are the same).
   *
   * Time Complexity: O(n + m) total iteration where n = values, m = capacity
   * Space Complexity: O(1) per iteration
   */
  *entries(): IterableIterator<[T, T]> {
    for (const value of this.values()) {
      yield [value, value];
    }
  }

  /**
   * Makes the HashSet iterable with for...of loops.
   * Iterates over values.
   *
   * @example
   * for (const value of set) {
   *   console.log(value);
   * }
   *
   * Time Complexity: O(n + m) total iteration where n = values, m = capacity
   * Space Complexity: O(1) per iteration
   */
  [Symbol.iterator](): IterableIterator<T> {
    return this.values();
  }
}

export default HashSet;
