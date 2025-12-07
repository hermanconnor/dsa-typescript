/**
 * A stack implementation using a dynamic array.
 * Provides LIFO (Last In, First Out) semantics with amortized O(1) push and pop operations.
 * @template T The type of elements in the stack
 */
class Stack<T> {
  private items: T[];

  /**
   * Creates a new stack
   * @param {T[]} initialItems - Optional initial items to populate the stack
   * @time O(n) - Linear time if initial items provided, O(1) otherwise
   * @space O(n) - Space for n initial elements
   */
  constructor(initialItems?: T[]) {
    this.items = initialItems ? [...initialItems] : [];
  }

  /**
   * Adds an element to the top of the stack
   * @param {T} element - The element to push onto the stack
   * @time O(1) amortized - Constant time on average (array may resize)
   * @space O(1) - Single element allocation per call
   */
  push(element: T): void {
    this.items.push(element);
  }

  /**
   * Removes and returns the element at the top of the stack
   * @returns {T | undefined} The popped element, or undefined if stack is empty
   * @time O(1) - Constant time operation
   * @space O(1) - No additional space used
   */
  pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * Returns the element at the top of the stack without removing it
   * @returns {T | undefined} The top element, or undefined if stack is empty
   * @time O(1) - Constant time operation
   * @space O(1) - No additional space used
   */
  peek(): T | undefined {
    if (this.isEmpty()) return undefined;

    return this.items[this.items.length - 1];
  }

  /**
   * Checks if the stack is empty
   * @returns {boolean} True if the stack is empty, false otherwise
   * @time O(1) - Constant time operation
   * @space O(1) - No additional space used
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Returns the number of elements in the stack
   * @returns {number} The size of the stack
   * @time O(1) - Constant time operation
   * @space O(1) - No additional space used
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Removes all elements from the stack
   * @time O(1) - Constant time operation (creates new array reference)
   * @space O(1) - No additional space used (old array garbage collected)
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Checks if the stack contains a specific element
   * @param {T} element - The element to search for
   * @returns {boolean} True if element is found, false otherwise
   * @time O(n) - Linear time, must check all elements in worst case
   * @space O(1) - No additional space used
   */
  contains(element: T): boolean {
    return this.items.includes(element);
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
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i] === element) {
        return this.items.length - 1 - i;
      }
    }

    return -1;
  }

  /**
   * Creates a shallow copy of the stack
   * @returns {Stack<T>} A new stack with the same elements
   * @time O(n) - Must copy all n elements
   * @space O(n) - Creates new stack with n elements
   */
  clone(): Stack<T> {
    const newStack = new Stack<T>();

    newStack.items = [...this.items];

    return newStack;
  }

  /**
   * Applies a function to each element in the stack (top to bottom)
   * @param {function(T, number): void} callback - Function to apply to each element
   * @time O(n) - Must visit each element
   * @space O(1) - No additional space used (excluding callback space)
   */
  forEach(callback: (element: T, index: number) => void): void {
    for (let i = this.items.length - 1; i >= 0; i--) {
      callback(this.items[i], this.items.length - 1 - i);
    }
  }

  /**
   * Converts the stack to an array (top to bottom order)
   * Optimized to avoid creating intermediate arrays
   * @returns {T[]} Array representation of the stack
   * @time O(n) - Must copy each element
   * @space O(n) - Creates new array with n elements
   */
  toArray(): T[] {
    const result: T[] = [];

    for (let i = this.items.length - 1; i >= 0; i--) {
      result.push(this.items[i]);
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

    for (let i = this.items.length - 1; i >= 0; i--) {
      elements.push(String(this.items[i]));
    }

    return `[TOP] ${elements.join(' -> ')} [BOTTOM]`;
  }

  /**
   * Iterator for the stack (iterates from top to bottom)
   * @yields {T} Elements from top to bottom of the stack
   * @time O(n) - Linear time to iterate all elements
   * @space O(1) - Constant space for iteration state
   */
  *[Symbol.iterator](): Iterator<T> {
    for (let i = this.items.length - 1; i >= 0; i--) {
      yield this.items[i];
    }
  }
}

export default Stack;
