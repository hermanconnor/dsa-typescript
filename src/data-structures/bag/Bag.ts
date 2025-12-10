/**
 * A bag (multiset) data structure that allows duplicate elements and tracks their counts.
 * Uses a Map internally for efficient operations.
 *
 * @template T The type of elements stored in the bag
 *
 * @example
 * const bag = new Bag<string>(['apple', 'banana', 'apple']);
 * bag.add('cherry');
 * console.log(bag.count('apple')); // 2
 * console.log(bag.size()); // 4
 */
class Bag<T> {
  private counts = new Map<T, number>();
  private totalSize = 0;

  /**
   * Creates a new Bag, optionally initialized with items from an iterable.
   *
   * @param {Iterable<T>} [initialItems] - Optional iterable of items to initialize the bag
   *
   * @timeComplexity O(n) where n is the number of items in initialItems
   * @spaceComplexity O(k) where k is the number of unique items in initialItems
   */
  constructor(initialItems?: Iterable<T>) {
    if (initialItems) {
      for (const item of initialItems) {
        this.add(item);
      }
    }
  }

  /**
   * Adds a single item to the bag, incrementing its count.
   *
   * @param {T} item - The item to add
   *
   * @timeComplexity O(1) average case for Map operations
   * @spaceComplexity O(1) amortized - may require O(k) if the map needs to resize, where k is current unique items
   */
  add(item: T): void {
    this.counts.set(item, (this.counts.get(item) || 0) + 1);
    this.totalSize++;
  }

  /**
   * Adds multiple instances of an item to the bag at once.
   *
   * @param {T} item - The item to add
   * @param {number} amount - The number of instances to add (must be a positive integer)
   * @returns {void}
   *
   * @timeComplexity O(1) average case
   * @spaceComplexity O(1) amortized
   */
  addMany(item: T, amount: number): void {
    if (amount <= 0 || !Number.isInteger(amount)) {
      // Optional: Throw an error or just return if amount is invalid
      return;
    }

    this.counts.set(item, (this.counts.get(item) || 0) + amount);
    this.totalSize += amount;
  }

  /**
   * Removes one instance of an item from the bag, decrementing its count.
   * If the count reaches zero, the item is removed from the internal map.
   *
   * @param {T} item - The item to remove
   * @returns {boolean} True if the item was removed, false if it wasn't in the bag
   *
   * @timeComplexity O(1) average case
   * @spaceComplexity O(1)
   */
  remove(item: T): boolean {
    const count = this.counts.get(item);

    if (!count) return false;

    if (count === 1) {
      this.counts.delete(item);
    } else {
      this.counts.set(item, count - 1);
    }

    this.totalSize--;

    return true;
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
    return this.counts.has(item);
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
    return this.counts.get(item) || 0;
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
   * Checks whether the bag is empty.
   *
   * @returns {boolean} True if the bag contains no items, false otherwise
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
   * @timeComplexity O(1) - Map.clear() is typically O(1)
   * @spaceComplexity O(1)
   */
  clear(): void {
    this.counts.clear();
    this.totalSize = 0;
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
    return Array.from(this.counts.keys());
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
