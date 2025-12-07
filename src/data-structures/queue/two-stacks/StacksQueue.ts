/**
 * Implements a Queue (FIFO) using two underlying Arrays as Stacks (LIFO).
 * This design achieves amortized O(1) time complexity for enqueue and dequeue operations.
 * It can optionally enforce a maximum capacity (like a circular buffer).
 *
 * @template T The type of elements held in the queue.
 */
class StacksQueue<T> {
  /**
   * The 'in' stack, used for pushing new elements.
   * Elements are pushed to this stack, mimicking the tail of the queue.
   * @private
   * @type {T[]}
   */
  private inStack: T[] = [];

  /**
   * The 'out' stack, used for popping (dequeuing) elements.
   * When `inStack` is transferred, elements are pushed to this stack, reversing the order
   * so that the oldest element is at the top (end) of `outStack`.
   * @private
   * @type {T[]}
   */
  private outStack: T[] = [];

  /**
   * Optional maximum capacity of the queue. If defined, the queue behaves like a circular buffer.
   * @private
   * @type {number | undefined}
   */
  private maxlen?: number;

  /**
   * Creates an instance of StacksQueue.
   *
   * @constructor
   * @param {Iterable<T> | number} [itemsOrCapacity] - Initial iterable of items to populate the queue, OR the maximum capacity (maxlen).
   * @param {number} [capacity] - The maximum capacity (maxlen) if the first argument was an iterable of items.
   * @throws {Error} If `maxlen` is provided and is not greater than 0.
   *
   * @complexity Time: O(N) where N is the number of initial items, due to iteration/conversion.
   * @complexity Space: O(N) where N is the number of initial items, to store them.
   */
  constructor(itemsOrCapacity?: Iterable<T> | number, capacity?: number) {
    let items: Iterable<T> | undefined;
    let maxlen: number | undefined;

    if (typeof itemsOrCapacity === 'number') {
      maxlen = itemsOrCapacity;
    } else {
      items = itemsOrCapacity;
      maxlen = capacity;
    }

    // Validate and set maxlen
    if (maxlen !== undefined) {
      if (maxlen <= 0) {
        throw new Error('maxlen must be greater than 0');
      }

      this.maxlen = maxlen;
    }

    // Initialize with items, dropping oldest if exceeding capacity
    if (items) {
      const itemsArray = Array.from(items);
      const startIdx = this.maxlen
        ? Math.max(0, itemsArray.length - this.maxlen) // Only take the latest `maxlen` items
        : 0;

      for (let i = startIdx; i < itemsArray.length; i++) {
        this.inStack.push(itemsArray[i]);
      }
    }
  }

  /**
   * Adds an item to the back (tail) of the queue.
   * If the queue has a `maxlen` and is already full, the oldest item is first removed (dequeued)
   * to maintain the capacity (circular buffer behavior).
   *
   * @param {T} item - The item to add.
   * @returns {void}
   *
   * @complexity Time: O(1) **amortized**. O(1) if `transferIfNeeded` isn't called, or if `maxlen` is enforced.
   * Worst case O(N) if a dequeue is triggered on a full capacity queue, which in turn triggers a transfer.
   * @complexity Space: O(1) on average. O(N) worst case if resizing of underlying array/stack is needed, where N is the new size.
   */
  enqueue(item: T): void {
    // If at capacity, remove the oldest item first (circular buffer behavior)
    if (this.maxlen && this.size() >= this.maxlen) {
      this.dequeue(); // Drop the oldest item
    }

    this.inStack.push(item);
  }

  /**
   * Removes and returns the item from the front (head) of the queue (FIFO).
   *
   * @returns {T | undefined} The oldest item in the queue, or `undefined` if the queue is empty.
   *
   * @complexity Time: O(1) **amortized**. The `transferIfNeeded` operation takes O(N) only when `outStack` is empty,
   * where N is the current queue size. Over a sequence of operations, each element is transferred once,
   * making the average time O(1).
   * @complexity Space: O(1) on average. O(N) worst case if a transfer occurs, but this is the existing space.
   */
  dequeue(): T | undefined {
    this.transferIfNeeded();

    return this.outStack.pop();
  }

  /**
   * Returns the item at the front (head) of the queue without removing it.
   *
   * @returns {T | undefined} The oldest item in the queue, or `undefined` if the queue is empty.
   *
   * @complexity Time: O(1) **amortized**. Similar to `dequeue`, the O(N) transfer only occurs when necessary.
   * @complexity Space: O(1) on average.
   */
  peek(): T | undefined {
    this.transferIfNeeded();

    return this.outStack[this.outStack.length - 1];
  }

  /**
   * Returns the total number of elements in the queue.
   *
   * @returns {number} The size of the queue.
   *
   * @complexity Time: O(1).
   * @complexity Space: O(1).
   */
  size(): number {
    return this.inStack.length + this.outStack.length;
  }

  /**
   * Checks if the queue is empty.
   *
   * @returns {boolean} `true` if the queue contains no elements, `false` otherwise.
   *
   * @complexity Time: O(1).
   * @complexity Space: O(1).
   */
  isEmpty(): boolean {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }

  /**
   * Clears all elements from the queue.
   *
   * @returns {void}
   *
   * @complexity Time: O(1).
   * @complexity Space: O(1) (excluding garbage collection of old arrays).
   */
  clear(): void {
    this.inStack = [];
    this.outStack = [];
  }

  /**
   * Returns an array representation of the queue, maintaining FIFO order (oldest to newest).
   *
   * @returns {T[]} An array containing all elements in FIFO order.
   *
   * @complexity Time: O(N) where N is the size of the queue, due to array creation, reversal, and concatenation.
   * @complexity Space: O(N) where N is the size of the queue, to store the new array.
   */
  toArray(): T[] {
    // Reverse outStack (which is newest -> oldest) to get oldest -> newest, then append inStack (which is also newest -> oldest)
    return [...this.outStack].reverse().concat(this.inStack);
  }

  /**
   * Transfers all elements from `inStack` to `outStack` if `outStack` is empty.
   * This operation reverses the order of elements, making the oldest element (first one pushed to `inStack`)
   * the last one popped from `outStack` (i.e., at `outStack[outStack.length - 1]`).
   *
   * @private
   * @returns {void}
   *
   * @complexity Time: O(N) where N is the size of `inStack`. However, it is an amortized O(1) operation
   * when viewed over a sequence of operations (see `dequeue`).
   * @complexity Space: O(1) (does not allocate new storage proportional to N, only moves existing elements).
   */
  private transferIfNeeded(): void {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        // Pop from inStack (LIFO) and push to outStack (LIFO)
        this.outStack.push(this.inStack.pop()!);
      }
    }
  }

  /**
   * Implements the iterable protocol, allowing the queue to be used in `for...of` loops,
   * spread syntax (`...`), and other iterable contexts. Iterates in FIFO order.
   *
   * @generator
   * @yields {T} The next element in FIFO order.
   *
   * @complexity Time: O(N) where N is the size of the queue.
   * @complexity Space: O(1) (excluding the space for the iteration state).
   */
  *[Symbol.iterator](): Iterator<T> {
    // Iterate over outStack from top (oldest) to bottom (newest transfered)
    for (let i = this.outStack.length - 1; i >= 0; i--) {
      yield this.outStack[i];
    }
    // Iterate over inStack from oldest (start) to newest (end)
    for (const item of this.inStack) {
      yield item;
    }
  }
}

export default StacksQueue;
