/**
 * A generic HashMap implementation using separate chaining for collision resolution.
 * Supports any key type with identity-based hashing for objects.
 *
 * @template K - The type of keys maintained by this map
 * @template V - The type of mapped values
 *
 * @example
 * const map = new HashMap<string, number>();
 * map.set('foo', 42);
 * map.get('foo'); // 42
 */
class HashMap<K, V> {
  /** Internal storage: array of buckets (chains) for collision handling */
  private buckets: Array<Array<[K, V]>>;

  /** Current number of key-value pairs stored */
  private size: number;

  /** Current capacity (number of buckets) */
  private capacity: number;

  /** Threshold ratio for triggering resize (default: 0.75) */
  private readonly loadFactor: number;

  /** WeakMap for assigning unique IDs to object keys (enables identity-based hashing) */
  private readonly objectIds = new WeakMap<object, number>();

  /** Counter for generating unique object IDs */
  private nextObjectId = 1;

  /**
   * Creates a new HashMap instance.
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
    this.size = 0;
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
  private createBuckets(capacity: number): Array<Array<[K, V]>> {
    return new Array(capacity).fill(null).map(() => []);
  }

  /**
   * Generates a hash code for the key and maps it to a bucket index.
   * Uses identity-based hashing for objects via WeakMap IDs.
   * Implements a variant of the DJB2 hash algorithm.
   *
   * @param key - The key to hash
   * @returns Bucket index in range [0, capacity)
   *
   * Time Complexity: O(k) where k = string length of the key representation
   * Space Complexity: O(1) amortized (WeakMap entries don't count as they're GC-eligible)
   */
  private hash(key: K): number {
    let hash = 5381; // DJB2 initial value
    let str: string;

    // Convert key to string representation based on type
    if (
      typeof key === 'string' ||
      typeof key === 'number' ||
      typeof key === 'boolean'
    ) {
      str = String(key);
    } else if (typeof key === 'object' && key !== null) {
      // Identity-based hashing for object keys
      let id = this.objectIds.get(key);
      if (id === undefined) {
        id = this.nextObjectId++;
        this.objectIds.set(key, id);
      }
      str = `obj:${id}`;
    } else {
      // Handle undefined, null, symbols, etc.
      str = String(key);
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
   * Doubles the capacity and rehashes all existing entries.
   *
   * Time Complexity: O(n) where n = number of entries (each entry rehashed once)
   * Space Complexity: O(m) where m = new capacity
   */
  private resize(): void {
    const oldBuckets = this.buckets;
    this.capacity *= 2;
    this.buckets = this.createBuckets(this.capacity);
    this.size = 0;

    // Rehash all existing entries into new buckets
    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        // Use set() to properly rehash and handle duplicates
        this.set(key, value);
      }
    }
  }

  /**
   * Sets or updates a key-value pair in the map.
   * If the key already exists, its value is updated.
   * Triggers resize if load factor threshold is exceeded.
   *
   * @param key - The key to set
   * @param value - The value to associate with the key
   *
   * Time Complexity: O(1) average, O(n) worst case (with resize), O(k) for key hashing
   * Space Complexity: O(1) amortized
   */
  set(key: K, value: V): void {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];

    // Update existing key
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }

    // Add new entry
    bucket.push([key, value]);
    this.size++;

    // Check if resize is needed
    if (this.size / this.capacity > this.loadFactor) {
      this.resize();
    }
  }

  /**
   * Retrieves the value associated with a key.
   *
   * @param key - The key to look up
   * @returns The associated value, or undefined if key doesn't exist
   *
   * Time Complexity: O(1) average, O(n) worst case where n = entries in bucket
   * Space Complexity: O(1)
   */
  get(key: K): V | undefined {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];

    for (const [k, v] of bucket) {
      if (k === key) {
        return v;
      }
    }
    return undefined;
  }

  /**
   * Checks if a key exists in the map.
   *
   * @param key - The key to check
   * @returns true if the key exists, false otherwise
   *
   * Time Complexity: O(1) average, O(n) worst case where n = entries in bucket
   * Space Complexity: O(1)
   */
  has(key: K): boolean {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];

    for (const [k] of bucket) {
      if (k === key) {
        return true;
      }
    }
    return false;
  }

  /**
   * Deletes a key-value pair from the map.
   * Uses swap-and-pop for O(1) removal (order of bucket entries doesn't matter).
   *
   * @param key - The key to delete
   * @returns true if the key was found and deleted, false otherwise
   *
   * Time Complexity: O(1) average, O(n) worst case where n = entries in bucket
   * Space Complexity: O(1)
   */
  delete(key: K): boolean {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        // Swap with last element and pop (O(1) removal)
        const lastIndex = bucket.length - 1;
        if (i !== lastIndex) {
          bucket[i] = bucket[lastIndex];
        }
        bucket.pop();
        this.size--;
        return true;
      }
    }
    return false;
  }

  /**
   * Gets the number of key-value pairs in the map.
   *
   * @returns The size of the map
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Checks if the map is empty.
   *
   * @returns true if the map has no entries, false otherwise
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Clears all entries from the map while maintaining capacity.
   *
   * Time Complexity: O(m) where m = capacity
   * Space Complexity: O(m)
   */
  clear(): void {
    this.buckets = this.createBuckets(this.capacity);
    this.size = 0;
  }

  /**
   * Executes a callback function for each key-value pair in the map.
   *
   * @param callback - Function to execute for each entry
   * @param thisArg - Value to use as 'this' when executing callback
   *
   * Time Complexity: O(n + m) where n = entries, m = capacity
   * Space Complexity: O(1)
   */
  forEach(
    callback: (value: V, key: K, map: HashMap<K, V>) => void,
    thisArg?: unknown,
  ): void {
    const boundCallback =
      thisArg !== undefined ? callback.bind(thisArg) : callback;

    for (const bucket of this.buckets) {
      for (const [key, value] of bucket) {
        boundCallback(value, key, this);
      }
    }
  }

  /**
   * Returns an iterator over the keys.
   *
   * Time Complexity: O(n + m) total iteration where n = entries, m = capacity
   * Space Complexity: O(1) per iteration
   */
  *keys(): IterableIterator<K> {
    for (const bucket of this.buckets) {
      for (const [key] of bucket) {
        yield key;
      }
    }
  }

  /**
   * Returns an iterator over the values.
   *
   * Time Complexity: O(n + m) total iteration where n = entries, m = capacity
   * Space Complexity: O(1) per iteration
   */
  *values(): IterableIterator<V> {
    for (const bucket of this.buckets) {
      for (const [, value] of bucket) {
        yield value;
      }
    }
  }

  /**
   * Returns an iterator over the key-value pairs as [key, value] tuples.
   *
   * Time Complexity: O(n + m) total iteration where n = entries, m = capacity
   * Space Complexity: O(1) per iteration
   */
  *entries(): IterableIterator<[K, V]> {
    for (const bucket of this.buckets) {
      yield* bucket;
    }
  }

  /**
   * Makes the HashMap iterable with for...of loops.
   * Iterates over [key, value] tuples.
   *
   * @example
   * for (const [key, value] of map) {
   *   console.log(key, value);
   * }
   *
   * Time Complexity: O(n + m) total iteration where n = entries, m = capacity
   * Space Complexity: O(1) per iteration
   */
  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
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
    return this.size / this.capacity;
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
}

export default HashMap;
