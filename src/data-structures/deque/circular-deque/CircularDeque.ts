/**
 * @class CircularDeque
 * @description A high-performance generic double-ended queue implemented with a circular buffer.
 * Uses bitwise wrapping and Power-of-Two sizing for O(1) operations.
 * * @template T The type of elements held in the deque.
 */
class CircularDeque<T> {
  private buffer: (T | undefined)[];
  private frontIndex: number = 0;
  private rearIndex: number = 0;
  private count: number = 0;
  private capacity: number;
  private readonly initialCapacity: number;
  private readonly maxlen?: number;

  /**
   * @constructor
   * @param itemsOrMaxlen Initial items to add or the maximum length of the deque.
   * @param maxlen Optional maximum length if items are provided as the first argument.
   * @param initialCapacity The starting internal buffer size (will be rounded up to power of 2).
   * * @time O(N) where N is the number of initial items.
   * @space O(K) where K is the initial capacity.
   */
  constructor(
    itemsOrMaxlen?: Iterable<T> | number,
    maxlen?: number,
    initialCapacity: number = 16,
  ) {
    const getNextPowerOfTwo = (n: number) =>
      n <= 1 ? 1 : Math.pow(2, Math.ceil(Math.log2(n)));

    let items: T[] | undefined;

    // Handle overloaded constructor arguments
    if (typeof itemsOrMaxlen === 'number') {
      if (itemsOrMaxlen <= 0) throw new Error('maxlen must be greater than 0');
      this.maxlen = itemsOrMaxlen;
    } else if (itemsOrMaxlen) {
      items = Array.from(itemsOrMaxlen);
      this.maxlen = maxlen;

      if (this.maxlen !== undefined && this.maxlen <= 0) {
        throw new Error('maxlen must be greater than 0');
      }
    }

    if (initialCapacity <= 0)
      throw new Error('initialCapacity must be greater than 0');

    // Setup initial power-of-two capacity for bitwise optimization
    this.initialCapacity = getNextPowerOfTwo(initialCapacity);
    this.capacity = this.maxlen
      ? getNextPowerOfTwo(Math.min(this.maxlen, this.initialCapacity))
      : this.initialCapacity;

    this.buffer = new Array(this.capacity);

    if (items) {
      this.extend(items);
    }
  }

  /**
   * Optimized Bitwise Wrap
   * Replaces (index % capacity) for Power-of-Two capacities.
   * @private
   * * @time O(1)
   * @space O(1)
   */
  private wrap(index: number): number {
    return index & (this.capacity - 1);
  }

  /**
   * Doubles the internal buffer size and realigns elements.
   * @private
   * * @time O(N) where N is current count.
   * @space O(N) for the new buffer.
   */
  private resize(): void {
    const newCapacity = this.capacity * 2;
    const newBuffer = new Array(newCapacity);

    // Copy elements in order to the start of the new buffer
    for (let i = 0; i < this.count; i++) {
      newBuffer[i] = this.buffer[this.wrap(this.frontIndex + i)];
    }

    this.buffer = newBuffer;
    this.capacity = newCapacity;
    this.frontIndex = 0;
    this.rearIndex = this.count;
  }

  /**
   * Reduces the internal buffer size to the smallest power of 2 that fits the current count.
   * * @time O(N)
   * @space O(N)
   */
  trimToSize(): void {
    if (this.count === this.capacity) return;

    const getNextPowerOfTwo = (n: number) =>
      n <= 1 ? 2 : Math.pow(2, Math.ceil(Math.log2(n)));

    const newCapacity = Math.max(
      this.initialCapacity,
      getNextPowerOfTwo(this.count),
    );

    if (newCapacity < this.capacity) {
      const newBuffer = new Array(newCapacity);
      for (let i = 0; i < this.count; i++) {
        newBuffer[i] = this.buffer[this.wrap(this.frontIndex + i)];
      }
      this.buffer = newBuffer;
      this.capacity = newCapacity;
      this.frontIndex = 0;
      this.rearIndex = this.count;
    }
  }

  /**
   * Adds an item to the front of the deque.
   * If capacity is reached and maxlen is set, the rear item is dropped.
   * * @time O(1) Amortized (O(N) if resize is triggered).
   * @space O(1) Amortized.
   */
  addFront(item: T): void {
    if (this.count === this.capacity) {
      if (this.maxlen === undefined || this.capacity < this.maxlen) {
        this.resize();
      }
    }

    // Handle fixed-size deque behavior (evict rear if full)
    if (this.maxlen !== undefined && this.count === this.maxlen) {
      this.removeRear();
    }

    this.frontIndex = this.wrap(this.frontIndex - 1);
    this.buffer[this.frontIndex] = item;
    this.count++;
  }

  /**
   * Adds an item to the rear of the deque.
   * If capacity is reached and maxlen is set, the front item is dropped.
   * * @time O(1) Amortized.
   * @space O(1) Amortized.
   */
  addRear(item: T): void {
    if (this.count === this.capacity) {
      if (this.maxlen === undefined || this.capacity < this.maxlen) {
        this.resize();
      }
    }

    // Handle fixed-size deque behavior (evict front if full)
    if (this.maxlen !== undefined && this.count === this.maxlen) {
      this.removeFront();
    }

    this.buffer[this.rearIndex] = item;
    this.rearIndex = this.wrap(this.rearIndex + 1);
    this.count++;
  }

  /**
   * Removes and returns the item from the front.
   * * @time O(1)
   * @space O(1)
   */
  removeFront(): T | undefined {
    if (this.count === 0) return undefined;

    const value = this.buffer[this.frontIndex];
    this.buffer[this.frontIndex] = undefined; // Avoid memory leaks (GC)
    this.frontIndex = this.wrap(this.frontIndex + 1);
    this.count--;

    return value;
  }

  /**
   * Removes and returns the item from the rear.
   * * @time O(1)
   * @space O(1)
   */
  removeRear(): T | undefined {
    if (this.count === 0) return undefined;
    this.rearIndex = this.wrap(this.rearIndex - 1);
    const value = this.buffer[this.rearIndex];
    this.buffer[this.rearIndex] = undefined; // Avoid memory leaks (GC)
    this.count--;

    return value;
  }

  /**
   * Returns the item at the front without removing it.
   * * @time O(1)
   * @space O(1)
   */
  peekFront(): T | undefined {
    return this.count === 0 ? undefined : this.buffer[this.frontIndex];
  }

  /**
   * Returns the item at the rear without removing it.
   * * @time O(1)
   * @space O(1)
   */
  peekRear(): T | undefined {
    return this.count === 0
      ? undefined
      : this.buffer[this.wrap(this.rearIndex - 1)];
  }

  /**
   * Accesses an item by its logical index.
   * Supports negative indexing (e.g., -1 is the last item).
   * * @time O(1)
   * @space O(1)
   */
  get(index: number): T | undefined {
    if (index < 0) index = this.count + index;
    if (index < 0 || index >= this.count) return undefined;

    return this.buffer[this.wrap(this.frontIndex + index)];
  }

  /**
   * Checks if an item exists in the deque using strict equality.
   * * @time O(N)
   * @space O(1)
   */
  contains(item: T): boolean {
    for (let i = 0; i < this.count; i++) {
      if (this.buffer[this.wrap(this.frontIndex + i)] === item) return true;
    }

    return false;
  }

  /**
   * Adds multiple items to the rear.
   * * @time O(M) where M is the number of items.
   * @space O(1) (excluding potential resizing).
   */
  extend(items: Iterable<T>): void {
    for (const item of items) {
      this.addRear(item);
    }
  }

  /**
   * Adds multiple items to the front, maintaining their relative order.
   * * @time O(M) where M is the number of items.
   * @space O(M) if items is not an array (due to Array.from).
   */
  extendLeft(items: Iterable<T>): void {
    const itemsArray = Array.isArray(items) ? items : Array.from(items);

    for (let i = itemsArray.length - 1; i >= 0; i--) {
      this.addFront(itemsArray[i]);
    }
  }

  /**
   * Rotates the deque n steps to the right (positive) or left (negative).
   * * @time O(K) where K is the number of effective shifts.
   * @space O(1)
   */
  rotate(n: number = 1): void {
    if (this.count <= 1) return;
    const shift = ((n % this.count) + this.count) % this.count;
    if (shift === 0) return;

    // Rotate right: move items from rear to front
    for (let i = 0; i < shift; i++) {
      this.addFront(this.removeRear()!);
    }
  }

  /**
   * Resets the deque and clears the buffer for GC.
   * * @time O(K) where K is current capacity.
   * @space O(1)
   */
  clear(): void {
    this.buffer.fill(undefined);
    this.frontIndex = 0;
    this.rearIndex = 0;
    this.count = 0;
  }

  /** @returns True if deque has no items. */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /** @returns The number of items in the deque. */
  get length(): number {
    return this.count;
  }

  /** @returns The number of items in the deque. */
  get size(): number {
    return this.count;
  }

  /** @returns The current internal buffer capacity. */
  getCapacity(): number {
    return this.capacity;
  }

  /** @returns The maximum allowed length, if any. */
  getMaxLen(): number | undefined {
    return this.maxlen;
  }

  /**
   * Returns a standard array containing the deque elements in order.
   * * @time O(N)
   * @space O(N)
   */
  toArray(): T[] {
    const result: T[] = new Array(this.count);

    for (let i = 0; i < this.count; i++) {
      result[i] = this.buffer[this.wrap(this.frontIndex + i)]!;
    }

    return result;
  }

  /**
   * Iterates over elements from front to rear.
   * * @time O(N)
   * @space O(1)
   */
  *[Symbol.iterator](): IterableIterator<T> {
    for (let i = 0; i < this.count; i++) {
      yield this.buffer[this.wrap(this.frontIndex + i)]!;
    }
  }

  /**
   * Iterates over elements from rear to front.
   * * @time O(N)
   * @space O(1)
   */
  *reverseIterator(): IterableIterator<T> {
    for (let i = this.count - 1; i >= 0; i--) {
      yield this.buffer[this.wrap(this.frontIndex + i)]!;
    }
  }
}

export default CircularDeque;
