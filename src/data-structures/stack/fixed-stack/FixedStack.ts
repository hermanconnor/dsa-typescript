/**
 * A fixed-capacity stack implementation using a pre-allocated array.
 * Provides LIFO (Last In, First Out) semantics with strict capacity limits.
 * All operations are O(1) except iteration/conversion which are O(n).
 * @template T The type of elements in the stack
 */
class FixedStack<T> {
  private items: (T | undefined)[];
  private topIndex: number = -1;
  private readonly maxSize: number;

  /**
   * Creates a new fixed-capacity stack
   * @param {number} capacity - Maximum number of elements the stack can hold
   * @throws {Error} If capacity is not a positive integer
   * @time O(n) - Must allocate array of size n
   * @space O(n) - Pre-allocates array of capacity n
   */
  constructor(capacity: number) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error('Capacity must be a positive integer');
    }

    this.maxSize = capacity;
    this.items = new Array(capacity);
  }

  /**
   * Adds an element to the top of the stack
   * @param {T} element - The element to push onto the stack
   * @throws {Error} If the stack is full
   * @time O(1) - Constant time operation
   * @space O(1) - No additional space used
   */
  push(element: T): void {
    if (this.isFull()) {
      throw new Error('Stack overflow: Cannot push to a full stack');
    }

    this.topIndex++;
    this.items[this.topIndex] = element;
  }

  /**
   * Removes and returns the element at the top of the stack
   * @returns {T | undefined} The popped element, or undefined if stack is empty
   * @time O(1) - Constant time operation
   * @space O(1) - No additional space used
   */
  pop(): T | undefined {
    if (this.isEmpty()) return undefined;

    const value = this.items[this.topIndex];

    this.items[this.topIndex] = undefined; // Help Garbage Collector
    this.topIndex--;

    return value;
  }

  /**
   * Returns the element at the top of the stack without removing it
   * @returns {T | undefined} The top element, or undefined if stack is empty
   * @time O(1) - Constant time operation
   * @space O(1) - No additional space used
   */
  peek(): T | undefined {
    if (this.isEmpty()) return undefined;

    return this.items[this.topIndex];
  }

  /**
   * Checks if the stack is empty
   * @returns {boolean} True if the stack is empty, false otherwise
   * @time O(1) - Constant time operation
   * @space O(1) - No additional space used
   */
  isEmpty(): boolean {
    return this.topIndex === -1;
  }

  /**
   * Checks if the stack is full
   * @returns {boolean} True if the stack is full, false otherwise
   * @time O(1) - Constant time operation
   * @space O(1) - No additional space used
   */
  isFull(): boolean {
    return this.topIndex === this.maxSize - 1;
  }

  /**
   * Returns the number of elements currently in the stack
   * @returns {number} The size of the stack
   * @time O(1) - Constant time operation
   * @space O(1) - No additional space used
   */
  size(): number {
    return this.topIndex + 1;
  }

  /**
   * Returns the maximum capacity of the stack
   * @returns {number} The capacity of the stack
   * @time O(1) - Constant time operation
   * @space O(1) - No additional space used
   */
  capacity(): number {
    return this.maxSize;
  }

  /**
   * Returns the number of available slots in the stack
   * @returns {number} Remaining capacity
   * @time O(1) - Constant time operation
   * @space O(1) - No additional space used
   */
  remaining(): number {
    return this.maxSize - this.size();
  }

  /**
   * Removes all elements from the stack
   * @time O(n) - Must clear n elements for GC
   * @space O(1) - No additional space used
   */
  clear(): void {
    // Help GC by clearing references
    for (let i = 0; i <= this.topIndex; i++) {
      this.items[i] = undefined;
    }

    this.topIndex = -1;
  }

  /**
   * Checks if the stack contains a specific element
   * @param {T} element - The element to search for
   * @returns {boolean} True if element is found, false otherwise
   * @time O(n) - Linear time, must check all elements in worst case
   * @space O(1) - No additional space used
   */
  contains(element: T): boolean {
    for (let i = 0; i <= this.topIndex; i++) {
      if (this.items[i] === element) return true;
    }

    return false;
  }

  /**
   * Returns the index of an element from the top of the stack (0-indexed)
   * Returns -1 if element is not found
   * @param {T} element - The element to search for
   * @returns {number} Index from top (0 = top), or -1 if not found
   * @time O(n) - Linear time, must search through elements
   * @space O(1) - No additional space used
   */
  search(element: T): number {
    for (let i = this.topIndex; i >= 0; i--) {
      if (this.items[i] === element) {
        return this.topIndex - i;
      }
    }

    return -1;
  }

  /**
   * Applies a function to each element in the stack (top to bottom)
   * @param {function(T, number): void} callback - Function to apply to each element
   * @time O(n) - Must visit each element
   * @space O(1) - No additional space used (excluding callback space)
   */
  forEach(callback: (element: T, index: number) => void): void {
    for (let i = this.topIndex; i >= 0; i--) {
      callback(this.items[i] as T, this.topIndex - i);
    }
  }

  /**
   * Attempts to push multiple elements, stopping if stack becomes full
   * @param {T[]} elements - Elements to push
   * @returns {number} Number of elements successfully pushed
   * @time O(k) - Where k is min(elements.length, remaining capacity)
   * @space O(1) - No additional space used
   */
  pushMany(elements: T[]): number {
    let count = 0;

    for (const element of elements) {
      if (this.isFull()) break;

      this.push(element);
      count++;
    }

    return count;
  }

  /**
   * Returns utilization percentage of the stack
   * @returns {number} Percentage (0-100) of capacity used
   * @time O(1) - Constant time calculation
   * @space O(1) - No additional space used
   */
  utilization(): number {
    return (this.size() / this.maxSize) * 100;
  }

  /**
   * Creates a copy of the stack with the same capacity
   * @returns {FixedStack<T>} A new stack with the same elements and capacity
   * @time O(n) - Must copy all elements
   * @space O(capacity) - Creates new stack with same capacity
   */
  clone(): FixedStack<T> {
    const newStack = new FixedStack<T>(this.maxSize);
    // Copy internal state
    for (let i = 0; i <= this.topIndex; i++) {
      newStack.items[i] = this.items[i];
    }

    newStack.topIndex = this.topIndex;

    return newStack;
  }

  /**
   * Converts the stack to an array (top to bottom order)
   * Optimized to build array directly without using iterator
   * @returns {T[]} Array representation of the stack
   * @time O(n) - Must copy each element
   * @space O(n) - Creates new array with n elements
   */
  toArray(): T[] {
    const result: T[] = [];

    for (let i = this.topIndex; i >= 0; i--) {
      result.push(this.items[i] as T);
    }

    return result;
  }

  /**
   * Returns a string representation of the stack
   * Optimized to build string directly without intermediate arrays
   * @returns {string} String representation showing elements from top to bottom
   * @time O(n) - Must visit each element
   * @space O(n) - String concatenation creates new strings
   */
  toString(): string {
    if (this.isEmpty()) return '[EMPTY]';

    const elements: string[] = [];

    for (let i = this.topIndex; i >= 0; i--) {
      elements.push(String(this.items[i]));
    }

    return `[TOP] ${elements.join(' -> ')} [BOTTOM]`;
  }

  /**
   * Iterator for the stack (iterates from top to bottom)
   * Correctly handles undefined values that may be legitimately pushed
   * @yields {T} Elements from top to bottom of the stack
   * @time O(n) - Linear time to iterate all elements
   * @space O(1) - Constant space for iteration state
   */
  *[Symbol.iterator](): Iterator<T> {
    // Iterate only over valid indices (0 to topIndex)
    for (let i = this.topIndex; i >= 0; i--) {
      yield this.items[i] as T;
    }
  }
}

export default FixedStack;
