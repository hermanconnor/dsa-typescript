/**
 * @class CircularQueue
 * @description A fixed-size circular queue (ring buffer) implementation.
 * When the queue is full and a new item is enqueued, the oldest item is automatically dropped.
 * @template T The type of elements held in the queue.
 */
class CircularQueue<T> {
  private queue: (T | undefined)[];
  private head: number;
  private tail: number;
  private count: number;
  private readonly capacity: number;

  /**
   * Creates a new CircularQueue.
   * @param itemsOrCapacity Optional iterable of initial items or a capacity number
   * @param capacity Optional capacity when first arg is an iterable
   *
   * @example
   * new CircularQueue(10)              // Empty queue with capacity 10
   * new CircularQueue([1,2,3])         // Queue with items, capacity max(3, 10) = 10
   * new CircularQueue([1,2,3], 5)      // Queue with items, capacity 5
   * new CircularQueue([1,2,3,4,5], 3)  // Keeps only [3,4,5], capacity 3
   */
  constructor(itemsOrCapacity?: Iterable<T> | number, capacity?: number) {
    // Handle overloaded signatures
    let items: Iterable<T> | undefined;
    let maxCapacity: number | undefined;

    if (typeof itemsOrCapacity === 'number') {
      maxCapacity = itemsOrCapacity;
    } else {
      items = itemsOrCapacity;
      maxCapacity = capacity;
    }

    // Convert items to array if provided
    const itemsArray = items ? Array.from(items) : [];

    // Determine capacity
    if (maxCapacity !== undefined) {
      if (maxCapacity <= 0) {
        throw new Error('Capacity must be greater than 0');
      }
      this.capacity = maxCapacity;
    } else {
      // Default capacity: 10, or the number of items if greater than 10
      this.capacity = Math.max(itemsArray.length || 10, 10);
    }

    // Initialize queue with fixed capacity
    this.queue = new Array(this.capacity);
    this.head = 0;
    this.tail = 0;
    this.count = 0;

    // Enqueue initial items (drops oldest if exceeding capacity)
    const startIdx = Math.max(0, itemsArray.length - this.capacity);
    for (let i = startIdx; i < itemsArray.length; i++) {
      this.enqueue(itemsArray[i]);
    }
  }

  /**
   * Adds an item to the back of the queue.
   * If the queue is full, automatically drops the oldest item (circular buffer behavior).
   * @param item The item to enqueue
   * @TimeComplexity O(1) - Constant time
   * @SpaceComplexity O(1) - No additional space
   */
  enqueue(item: T): void {
    // If full, advance head to drop oldest item
    if (this.count === this.capacity) {
      this.queue[this.head] = undefined; // Clear reference for GC
      this.head = (this.head + 1) % this.capacity;
      this.count--;
    }

    this.queue[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;
    this.count++;
  }

  /**
   * Removes and returns the item from the front of the queue.
   * @returns The front item, or undefined if the queue is empty
   * @TimeComplexity O(1) - Constant time
   * @SpaceComplexity O(1) - No additional space
   */
  dequeue(): T | undefined {
    if (this.count === 0) {
      return undefined;
    }

    const item = this.queue[this.head];
    this.queue[this.head] = undefined; // Clear reference for GC
    this.head = (this.head + 1) % this.capacity;
    this.count--;

    return item;
  }

  /**
   * Returns the item at the front without removing it.
   * @returns The front item, or undefined if the queue is empty
   * @TimeComplexity O(1) - Constant time
   * @SpaceComplexity O(1) - No additional space
   */
  peek(): T | undefined {
    return this.count === 0 ? undefined : this.queue[this.head];
  }

  /**
   * Returns the item at the back without removing it.
   * @returns The back item, or undefined if the queue is empty
   * @TimeComplexity O(1) - Constant time
   * @SpaceComplexity O(1) - No additional space
   */
  peekBack(): T | undefined {
    if (this.count === 0) return undefined;

    const backIdx = (this.tail - 1 + this.capacity) % this.capacity;

    return this.queue[backIdx];
  }

  /**
   * Checks if the queue is empty.
   * @returns true if the queue has no items
   * @TimeComplexity O(1) - Constant time
   * @SpaceComplexity O(1) - No additional space
   */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Checks if the queue is at full capacity.
   * @returns true if the queue cannot accept more items without dropping oldest
   * @TimeComplexity O(1) - Constant time
   * @SpaceComplexity O(1) - No additional space
   */
  isFull(): boolean {
    return this.count === this.capacity;
  }

  /**
   * Returns the current number of items in the queue.
   * @returns The number of items
   * @TimeComplexity O(1) - Constant time
   * @SpaceComplexity O(1) - No additional space
   */
  size(): number {
    return this.count;
  }

  /**
   * Returns the maximum capacity of the queue.
   * @returns The capacity
   * @TimeComplexity O(1) - Constant time
   * @SpaceComplexity O(1) - No additional space
   */
  getCapacity(): number {
    return this.capacity;
  }

  /**
   * Removes all items from the queue.
   * Properly clears references for garbage collection.
   * @TimeComplexity O(n) - Linear time to clear references
   * @SpaceComplexity O(1) - No additional space
   */
  clear(): void {
    // Clear references for garbage collection
    if (this.count > 0) {
      let idx = this.head;

      for (let i = 0; i < this.count; i++) {
        this.queue[idx] = undefined;
        idx = (idx + 1) % this.capacity;
      }
    }

    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }

  /**
   * Converts the queue to an array in FIFO order.
   * @returns An array containing all items from front to back
   * @TimeComplexity O(n) - Linear time to copy all items
   * @SpaceComplexity O(n) - Creates new array
   */
  toArray(): T[] {
    const result: T[] = [];
    let idx = this.head;

    for (let i = 0; i < this.count; i++) {
      result.push(this.queue[idx]!);
      idx = (idx + 1) % this.capacity;
    }

    return result;
  }

  /**
   * Returns a string representation of the queue.
   * @returns A string showing the queue contents from front to back
   * @TimeComplexity O(n) - Linear time to build string
   * @SpaceComplexity O(n) - Creates new string
   */
  toString(): string {
    if (this.isEmpty()) return '[EMPTY]';

    const items = this.toArray();

    return `[FRONT] ${items.join(' <- ')} [BACK] (${this.count}/${
      this.capacity
    })`;
  }

  /**
   * Makes the queue iterable (for...of loops, spread operator).
   * Yields items from front to back in FIFO order.
   * @yields Items in the queue
   * @TimeComplexity O(n) - Linear time for full iteration
   * @SpaceComplexity O(1) - Constant space per iteration
   */
  *[Symbol.iterator](): Iterator<T> {
    let idx = this.head;

    for (let i = 0; i < this.count; i++) {
      yield this.queue[idx]!;
      idx = (idx + 1) % this.capacity;
    }
  }
}

export default CircularQueue;
