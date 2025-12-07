/**
 * @class CircularDeque
 * @description A generic double-ended queue (deque) implemented using a circular buffer.
 * Provides O(1) amortized operations at both ends with efficient memory usage.
 * @template T The type of elements held in the deque.
 */
class CircularDeque<T> {
  private buffer: (T | undefined)[];
  private frontIndex: number;
  private rearIndex: number;
  private count: number;
  private capacity: number;
  private readonly initialCapacity: number;
  private readonly growthFactor: number;
  private readonly maxlen?: number;

  constructor(
    itemsOrCapacity?: Iterable<T> | number,
    maxlen?: number,
    initialCapacity: number = 16,
    growthFactor: number = 2,
  ) {
    // Handle overloaded signatures
    let items: Iterable<T> | undefined;
    let maxlenValue: number | undefined;

    if (typeof itemsOrCapacity === 'number') {
      maxlenValue = itemsOrCapacity;
    } else {
      items = itemsOrCapacity;
      maxlenValue = maxlen;
    }

    // Validate maxlen
    if (maxlenValue !== undefined && maxlenValue <= 0) {
      throw new Error('maxlen must be greater than 0');
    }

    // Validate initialCapacity
    if (initialCapacity <= 0) {
      throw new Error('initialCapacity must be greater than 0');
    }

    // Validate growthFactor
    if (growthFactor <= 1) {
      throw new Error('growthFactor must be greater than 1');
    }

    this.maxlen = maxlenValue;
    this.initialCapacity = Math.max(1, initialCapacity);
    this.growthFactor = growthFactor;

    // If maxlen is set and smaller than initialCapacity, use maxlen as capacity
    this.capacity =
      this.maxlen !== undefined
        ? Math.min(this.maxlen, this.initialCapacity)
        : this.initialCapacity;

    this.buffer = new Array(this.capacity);
    this.frontIndex = 0;
    this.rearIndex = 0;
    this.count = 0;

    // Initialize with items if provided
    if (items) {
      const itemsArray = Array.from(items);
      const startIdx = this.maxlen
        ? Math.max(0, itemsArray.length - this.maxlen)
        : 0;

      this.initializeFromItems(itemsArray, startIdx);
    }
  }

  /**
   * @private
   * @description Initializes the circular buffer from an array of items.
   * @param {T[]} items The array of elements to initialize the deque with.
   * @param {number} startIdx The index to begin building the deque from.
   * @returns {void}
   * @TimeComplexity O(k) - Linear time, where k is the number of elements added.
   * @SpaceComplexity O(1) - Uses existing buffer space.
   */
  private initializeFromItems(items: T[], startIdx: number): void {
    for (let i = startIdx; i < items.length; i++) {
      // May need to resize if items exceed initial capacity
      if (this.count === this.capacity && this.maxlen === undefined) {
        this.resize();
      }

      this.buffer[this.rearIndex] = items[i];
      this.rearIndex = (this.rearIndex + 1) % this.capacity;
      this.count++;
    }
  }

  /**
   * @private
   * @description Resizes the internal buffer when capacity is reached.
   * @returns {void}
   * @TimeComplexity O(n) - Copies all n elements to new buffer.
   * @SpaceComplexity O(n) - Allocates new buffer of increased size.
   */
  private resize(): void {
    // Don't resize if we have a maxlen constraint and we're at it
    if (this.maxlen !== undefined && this.count >= this.maxlen) {
      return;
    }

    const newCapacity =
      this.maxlen !== undefined
        ? Math.min(Math.floor(this.capacity * this.growthFactor), this.maxlen)
        : Math.floor(this.capacity * this.growthFactor);

    // Ensure we actually increase capacity
    if (newCapacity <= this.capacity) {
      return;
    }

    const newBuffer = new Array<T | undefined>(newCapacity);

    // Copy elements in order from front to rear
    for (let i = 0; i < this.count; i++) {
      newBuffer[i] = this.buffer[(this.frontIndex + i) % this.capacity];
    }

    this.buffer = newBuffer;
    this.frontIndex = 0;
    this.rearIndex = this.count;
    this.capacity = newCapacity;
  }

  /**
   * Checks if the deque is empty.
   * @returns {boolean} `true` if the deque contains no elements, `false` otherwise.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space used.
   */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Returns the number of elements in the deque.
   * @returns {number} The current number of elements.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space used.
   */
  get length(): number {
    return this.count;
  }

  /**
   * Returns the number of elements in the deque (method form for compatibility).
   * @returns {number} The current number of elements.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space used.
   */
  size(): number {
    return this.count;
  }

  /**
   * Returns the current capacity of the internal buffer.
   * @returns {number} The current capacity.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space used.
   */
  getCapacity(): number {
    return this.capacity;
  }

  /**
   * Returns the maximum length of the deque, if set.
   * @returns {number | undefined} The maximum length, or `undefined` if not set.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space used.
   */
  getMaxLen(): number | undefined {
    return this.maxlen;
  }

  /**
   * Converts the deque to an array from front to rear.
   * @returns {T[]} An array containing all elements in order.
   * @TimeComplexity O(n) - Iterates over all n elements.
   * @SpaceComplexity O(n) - Creates a new array of size n.
   */
  toArray(): T[] {
    const result: T[] = [];

    for (let i = 0; i < this.count; i++) {
      const index = (this.frontIndex + i) % this.capacity;

      result.push(this.buffer[index]!);
    }

    return result;
  }
}

export default CircularDeque;
