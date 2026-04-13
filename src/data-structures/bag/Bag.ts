/**
 * A bag (multiset) data structure that allows duplicate elements and tracks their counts
 * based on a unique key.
 *
 * @template T The type of elements stored in the bag
 * @template K The type of the key used to identify elements (defaults to T)
 */
class Bag<T, K = T> {
  private counts = new Map<K, number>();
  private items = new Map<K, T>();
  private keySelector: (item: T) => K;
  private totalSize = 0;

  /**
   * Creates a new Bag, optionally initialized with items from an iterable.
   *
   * @param initialItems - Optional iterable of items to initialize the bag
   * @param keySelector - Function to extract a unique key from an item
   *
   * @timeComplexity O(n) where n is the number of items in initialItems
   * @spaceComplexity O(u) where u is the number of unique keys
   */
  constructor(
    initialItems?: Iterable<T>,
    keySelector: (item: T) => K = (item: T) => item as unknown as K,
  ) {
    this.keySelector = keySelector;

    if (initialItems) {
      for (const item of initialItems) {
        this.add(item);
      }
    }
  }

  /**
   * Adds a single item to the bag, incrementing its count.
   *
   * @param item - The item to add
   *
   * @timeComplexity O(1) average case
   * @spaceComplexity O(1) amortized
   */
  add(item: T): void {
    const key = this.keySelector(item);

    // Store the actual item if we haven't seen this key before
    if (!this.items.has(key)) {
      this.items.set(key, item);
    }

    // Update count using the key K
    const currentCount = this.counts.get(key) || 0;
    this.counts.set(key, currentCount + 1);

    this.totalSize++;
  }

  /**
   * Adds multiple instances of an item to the bag at once.
   *
   * @param item - The item to add
   * @param amount - The number of instances to add (must be a positive integer)
   *
   * @timeComplexity O(1) average case
   * @spaceComplexity O(1) amortized
   */
  addMany(item: T, amount: number): void {
    if (amount <= 0 || !Number.isInteger(amount)) {
      // Optional: Throw an error if amount is invalid
      return;
    }

    const key = this.keySelector(item);

    // Ensure the item is registered if it's the first time we see this key
    if (!this.items.has(key)) {
      this.items.set(key, item);
    }

    // Update count using the key K
    const currentCount = this.counts.get(key) || 0;
    this.counts.set(key, currentCount + amount);

    this.totalSize += amount;
  }

  /**
   * Removes one instance of an item from the bag, decrementing its count.
   * If the count reaches zero, the item is completely removed.
   *
   * @param item - The item to remove
   * @returns True if an instance was removed, false if the item wasn't in the bag
   *
   * @timeComplexity O(1) average case
   * @spaceComplexity O(1)
   */
  remove(item: T): boolean {
    const key = this.keySelector(item);
    if (!this.counts.has(key)) return false;

    this.removeMany(item, 1);
    return true;
  }

  /**
   * Removes multiple instances of an item from the bag.
   *
   * @param item - The item to remove
   * @param amount - The number of instances to remove
   *
   * @timeComplexity O(1) average case
   * @spaceComplexity O(1)
   */
  removeMany(item: T, amount: number): void {
    if (amount <= 0 || !Number.isInteger(amount)) {
      return;
    }

    const key = this.keySelector(item);
    const currentCount = this.counts.get(key);

    if (!currentCount) return;

    if (amount >= currentCount) {
      // If we remove more than we have, delete the key entirely
      this.counts.delete(key);
      this.items.delete(key);
      this.totalSize -= currentCount;
    } else {
      // Otherwise, just decrement the count
      this.counts.set(key, currentCount - amount);
      this.totalSize -= amount;
    }
  }

  /**
   * Checks whether the bag contains at least one instance of the given item.
   *
   * @param {T} item - The item to check for
   * @returns {boolean} True if the item is in the bag, false otherwise
   *
   * @timeComplexity O(1) average case
   * @spaceComplexity O(1)
   */
  contains(item: T): boolean {
    return this.counts.has(this.keySelector(item));
  }

  /**
   * Returns the number of instances of the given item in the bag.
   *
   * @param {T} item - The item to count
   * @returns {number} The count of the item (0 if not present)
   *
   * @timeComplexity O(1) average case
   * @spaceComplexity O(1)
   */
  count(item: T): number {
    return this.counts.get(this.keySelector(item)) || 0;
  }

  /**
   * Returns the total number of items in the bag (counting duplicates).
   *
   * @returns {number} The total size of the bag
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  size(): number {
    return this.totalSize;
  }

  /**
   * Returns an array of all unique items in the bag (without duplicates).
   *
   * @returns {T[]} Array of unique items
   *
   * @timeComplexity O(k) where k is the number of unique items
   * @spaceComplexity O(k) for the returned array
   */
  uniqueItems(): T[] {
    return Array.from(this.items.values());
  }

  /**
   * Checks whether the bag is empty.
   *
   * @returns True if the bag contains no items, false otherwise
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  isEmpty(): boolean {
    return this.totalSize === 0;
  }

  /**
   * Removes all items from the bag.
   *
   * @timeComplexity O(n) where n is the number of unique keys (due to GC cleanup)
   * @spaceComplexity O(1)
   */
  clear(): void {
    this.counts.clear();
    this.items.clear(); // Added to prevent memory leaks
    this.totalSize = 0;
  }

  /**
   * Returns an iterator that yields each item in the bag according to its count.
   * Each item is yielded once for each instance in the bag.
   *
   * @yields {T} Each item in the bag (with duplicates)
   *
   * @timeComplexity O(n) to iterate through all items, where n is the total size
   * @spaceComplexity O(1) per iteration (generator function)
   *
   * @example
   * const bag = new Bag(['a', 'a', 'b']);
   * for (const item of bag) {
   *   console.log(item); // prints 'a', 'a', 'b'
   * }
   */
  *[Symbol.iterator]() {
    for (const [item, count] of this.counts) {
      for (let i = 0; i < count; i++) {
        yield item;
      }
    }
  }
}

export default Bag;
