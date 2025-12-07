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
    if (this.maxlen !== undefined && this.count >= this.maxlen) return;

    const newCapacity =
      this.maxlen !== undefined
        ? Math.min(Math.floor(this.capacity * this.growthFactor), this.maxlen)
        : Math.floor(this.capacity * this.growthFactor);

    // Ensure we actually increase capacity
    if (newCapacity <= this.capacity) return;

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
   * @private
   * @description Shrinks the buffer when count falls below threshold.
   * Helps reduce memory usage for long-lived deques.
   * @returns {void}
   * @TimeComplexity O(n) - Copies all n elements to new buffer.
   * @SpaceComplexity O(n) - Allocates new smaller buffer.
   */
  private maybeShrink(): void {
    // Don't shrink below initial capacity
    if (this.capacity <= this.initialCapacity) {
      return;
    }

    // Don't shrink if maxlen is set (capacity is optimized for it)
    if (this.maxlen !== undefined) return;

    // Shrink if utilization is less than 25%
    const shrinkThreshold = this.capacity / 4;
    if (this.count > shrinkThreshold) return;

    const newCapacity = Math.max(
      this.initialCapacity,
      Math.floor(this.capacity / this.growthFactor),
    );

    const newBuffer = new Array<T | undefined>(newCapacity);

    // Copy elements in order
    for (let i = 0; i < this.count; i++) {
      newBuffer[i] = this.buffer[(this.frontIndex + i) % this.capacity];
    }

    this.buffer = newBuffer;
    this.frontIndex = 0;
    this.rearIndex = this.count;
    this.capacity = newCapacity;
  }

  /**
   * Adds an element to the front of the deque.
   * If maxlen is set and exceeded, removes from the rear.
   * @param {T} item The element to add.
   * @TimeComplexity O(1) amortized - May trigger O(n) resize occasionally.
   * @SpaceComplexity O(1) - Constant space for the operation.
   */
  addFront(item: T): void {
    // Handle maxlen constraint
    if (this.maxlen !== undefined && this.count === this.maxlen) {
      this.removeRear();
    }

    // Resize if needed (only when no maxlen)
    if (this.count === this.capacity) {
      this.resize();
    }

    this.frontIndex = (this.frontIndex - 1 + this.capacity) % this.capacity;
    this.buffer[this.frontIndex] = item;
    this.count++;
  }

  /**
   * Adds an element to the rear of the deque.
   * If maxlen is set and exceeded, removes from the front.
   * @param {T} item The element to add.
   * @TimeComplexity O(1) amortized - May trigger O(n) resize occasionally.
   * @SpaceComplexity O(1) - Constant space for the operation.
   */
  addRear(item: T): void {
    // Handle maxlen constraint
    if (this.maxlen !== undefined && this.count === this.maxlen) {
      this.removeFront();
    }

    // Resize if needed (only when no maxlen)
    if (this.count === this.capacity) {
      this.resize();
    }

    this.buffer[this.rearIndex] = item;
    this.rearIndex = (this.rearIndex + 1) % this.capacity;
    this.count++;
  }

  /**
   * Removes and returns the element from the front of the deque.
   * @returns {T | undefined} The element at the front, or `undefined` if empty.
   * @TimeComplexity O(1) amortized - May trigger O(n) shrink occasionally.
   * @SpaceComplexity O(1) - Constant space for the operation.
   */
  removeFront(): T | undefined {
    if (this.count === 0) return undefined;

    const value = this.buffer[this.frontIndex];
    this.buffer[this.frontIndex] = undefined; // Allow garbage collection

    this.frontIndex = (this.frontIndex + 1) % this.capacity;
    this.count--;

    // Consider shrinking if buffer is underutilized
    this.maybeShrink();

    return value;
  }

  /**
   * Removes and returns the element from the rear of the deque.
   * @returns {T | undefined} The element at the rear, or `undefined` if empty.
   * @TimeComplexity O(1) amortized - May trigger O(n) shrink occasionally.
   * @SpaceComplexity O(1) - Constant space for the operation.
   */
  removeRear(): T | undefined {
    if (this.count === 0) return undefined;

    this.rearIndex = (this.rearIndex - 1 + this.capacity) % this.capacity;
    const value = this.buffer[this.rearIndex];

    this.buffer[this.rearIndex] = undefined; // Allow garbage collection
    this.count--;

    // Consider shrinking if buffer is underutilized
    this.maybeShrink();

    return value;
  }

  /**
   * Returns the element at the front without removing it.
   * @returns {T | undefined} The element at the front, or `undefined` if empty.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space used.
   */
  peekFront(): T | undefined {
    return this.count === 0 ? undefined : this.buffer[this.frontIndex];
  }

  /**
   * Returns the element at the rear without removing it.
   * @returns {T | undefined} The element at the rear, or `undefined` if empty.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space used.
   */
  peekRear(): T | undefined {
    if (this.count === 0) return undefined;

    const index = (this.rearIndex - 1 + this.capacity) % this.capacity;

    return this.buffer[index];
  }

  /**
   * Checks if the deque contains a specific item.
   * Uses strict equality (===) for comparison.
   * @param {T} item The item to search for.
   * @returns {boolean} `true` if the item is found, `false` otherwise.
   * @TimeComplexity O(n) - May need to check all elements.
   * @SpaceComplexity O(1) - No extra space used.
   */
  contains(item: T): boolean {
    for (let i = 0; i < this.count; i++) {
      const index = (this.frontIndex + i) % this.capacity;

      if (this.buffer[index] === item) return true;
    }

    return false;
  }

  /**
   * Returns the element at the specified index (0-based from front).
   * Negative indices count from the rear (-1 is last element).
   * @param {number} index The index of the element to retrieve.
   * @returns {T | undefined} The element at the index, or `undefined` if out of bounds.
   * @TimeComplexity O(1) - Direct array access with modulo arithmetic.
   * @SpaceComplexity O(1) - No extra space used.
   */
  get(index: number): T | undefined {
    // Handle negative indices
    if (index < 0) {
      index = this.count + index;
    }

    // Out of bounds check
    if (index < 0 || index >= this.count) return undefined;

    const actualIndex = (this.frontIndex + index) % this.capacity;

    return this.buffer[actualIndex];
  }

  /**
   * Extends the deque by adding multiple items to the rear.
   * If maxlen is set, removes from front as needed.
   * @param {Iterable<T>} items The items to add.
   * @TimeComplexity O(k) amortized - Where k is the number of items.
   * @SpaceComplexity O(1) - Constant extra space (excluding new elements).
   */
  extend(items: Iterable<T>): void {
    for (const item of items) {
      this.addRear(item);
    }
  }

  /**
   * Extends the deque by adding multiple items to the front (in order).
   * Items are added so that the first item in the iterable becomes the new front.
   * If maxlen is set, removes from rear as needed.
   * @param {Iterable<T>} items The items to add.
   * @TimeComplexity O(k) amortized - Where k is the number of items.
   * @SpaceComplexity O(k) - May need to convert iterable to array for reverse order.
   */
  extendLeft(items: Iterable<T>): void {
    const itemsArray = Array.from(items);

    for (let i = itemsArray.length - 1; i >= 0; i--) {
      this.addFront(itemsArray[i]);
    }
  }

  /**
   * Rotates the deque n steps. Positive n rotates right (rear to front),
   * negative n rotates left (front to rear).
   * @param {number} n Number of steps to rotate.
   * @TimeComplexity O(min(n, count)) - Moves elements, but optimized.
   * @SpaceComplexity O(1) - No extra space used.
   */
  rotate(n: number = 1): void {
    if (this.isEmpty() || this.count === 1) return;

    // Normalize n to be within [-count, count]
    n = n % this.count;

    if (n === 0) return;

    if (n > 0) {
      // Rotate right: move rear to front
      for (let i = 0; i < n; i++) {
        const item = this.removeRear();

        if (item !== undefined) {
          this.addFront(item);
        }
      }
    } else {
      // Rotate left: move front to rear
      for (let i = 0; i < Math.abs(n); i++) {
        const item = this.removeFront();

        if (item !== undefined) {
          this.addRear(item);
        }
      }
    }
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
   * Removes all elements from the deque and resets to initial capacity.
   * @TimeComplexity O(1) - Just reallocates buffer.
   * @SpaceComplexity O(1) - Resets to initial capacity.
   */
  clear(): void {
    const resetCapacity =
      this.maxlen !== undefined
        ? Math.min(this.maxlen, this.initialCapacity)
        : this.initialCapacity;

    this.buffer = new Array(resetCapacity);
    this.frontIndex = 0;
    this.rearIndex = 0;
    this.count = 0;
    this.capacity = resetCapacity;
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

  /**
   * Returns a string representation of the deque.
   * @returns {string} A string representing the deque's content.
   * @TimeComplexity O(n) - Iterates over all n elements.
   * @SpaceComplexity O(n) - Creates a new string.
   */
  toString(): string {
    if (this.isEmpty()) return '[EMPTY]';

    let s = '[FRONT] ';

    for (let i = 0; i < this.count; i++) {
      const index = (this.frontIndex + i) % this.capacity;

      s += `${this.buffer[index]}`;

      if (i < this.count - 1) {
        s += ' <-> ';
      }
    }
    s += ' [REAR]';

    return s;
  }

  /**
   * Implements the Iterable protocol. Elements are yielded from front to rear.
   * @yields {T} The value at the current position.
   * @TimeComplexity O(n) - For a full iteration over n elements.
   * @SpaceComplexity O(1) - Iteration uses constant extra space.
   */
  *[Symbol.iterator](): Iterator<T> {
    for (let i = 0; i < this.count; i++) {
      const index = (this.frontIndex + i) % this.capacity;

      yield this.buffer[index]!;
    }
  }

  /**
   * Reverse iterator - yields elements from rear to front.
   * @yields {T} The value at the current position (moving backward).
   * @TimeComplexity O(n) - For a full iteration over n elements.
   * @SpaceComplexity O(1) - Iteration uses constant extra space.
   */
  reverseIterator(): Iterable<T> {
    return {
      [Symbol.iterator]: (): Iterator<T> => {
        let i = this.count - 1;

        return {
          next: () => {
            if (i >= 0) {
              const index = (this.frontIndex + i) % this.capacity;
              const value = this.buffer[index]!;
              i--;
              return { value, done: false };
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return { value: undefined as any, done: true };
          },
        };
      },
    };
  }
}

export default CircularDeque;
