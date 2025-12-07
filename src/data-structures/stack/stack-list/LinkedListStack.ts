/**
 * A node in the linked list
 * @template T The type of element stored in the node
 */
class Node<T> {
  element: T;
  next: Node<T> | null;

  /**
   * Creates a new node
   * @param {T} element - The element to store in the node
   * @time O(1) - Constant time initialization
   * @space O(1) - Single node allocation
   */
  constructor(element: T) {
    this.element = element;
    this.next = null;
  }
}

/**
 * A stack implementation using a singly linked list.
 * Provides LIFO (Last In, First Out) semantics with O(1) push and pop operations.
 * @template T The type of elements in the stack
 */
class LinkedListStack<T> {
  private head: Node<T> | null;
  private count: number;

  constructor() {
    this.head = null;
    this.count = 0;
  }

  /**
   * Adds an element to the top of the stack
   * @param {T} element - The element to push onto the stack
   * @throws {Error} If element is null or undefined and strict validation is needed
   * @time O(1) - Constant time operation
   * @space O(1) - Single node allocation per call
   */
  push(element: T): void {
    const newNode = new Node(element);

    newNode.next = this.head;
    this.head = newNode;

    this.count++;
  }

  /**
   * Removes and returns the element at the top of the stack
   * @returns {T | undefined} The popped element, or undefined if stack is empty
   * @time O(1) - Constant time operation
   * @space O(1) - No additional space used
   */
  pop(): T | undefined {
    if (this.head === null) return undefined;

    const poppedElement = this.head.element;
    this.head = this.head.next;
    this.count--;

    return poppedElement;
  }

  /**
   * Returns the element at the top of the stack without removing it
   * @returns {T | undefined} The top element, or undefined if stack is empty
   * @time O(1) - Constant time operation
   * @space O(1) - No additional space used
   */
  peek(): T | undefined {
    return this.head?.element;
  }

  /**
   * Checks if the stack is empty
   * @returns {boolean} True if the stack is empty, false otherwise
   * @time O(1) - Constant time operation
   * @space O(1) - No additional space used
   */
  isEmpty(): boolean {
    return this.head === null;
  }

  /**
   * Returns the number of elements in the stack
   * @returns {number} The size of the stack
   * @time O(1) - Constant time operation (cached count)
   * @space O(1) - No additional space used
   */
  size(): number {
    return this.count;
  }

  /**
   * Removes all elements from the stack
   * @time O(1) - Constant time operation (relies on garbage collection)
   * @space O(1) - No additional space used
   */
  clear(): void {
    this.head = null;
    this.count = 0;
  }

  /**
   * Checks if the stack contains a specific element
   * @param {T} element - The element to search for
   * @returns {boolean} True if element is found, false otherwise
   * @time O(n) - Linear time, must traverse the stack
   * @space O(1) - No additional space used
   */
  contains(element: T): boolean {
    let current = this.head;

    while (current !== null) {
      if (current.element === element) {
        return true;
      }

      current = current.next;
    }

    return false;
  }

  /**
   * Creates a shallow copy of the stack
   * @returns {LinkedListStack<T>} A new stack with the same elements
   * @time O(n) - Must copy all n elements
   * @space O(n) - Creates new stack with n nodes
   */
  clone(): LinkedListStack<T> {
    const newStack = new LinkedListStack<T>();

    if (this.isEmpty()) {
      return newStack;
    }

    // Use temporary array to maintain order
    const elements = this.toArray();

    // Push in reverse order to maintain stack order
    for (let i = elements.length - 1; i >= 0; i--) {
      newStack.push(elements[i]);
    }

    return newStack;
  }

  /**
   * Applies a function to each element in the stack (top to bottom)
   * @param {function(T, number): void} callback - Function to apply to each element
   * @time O(n) - Must visit each element
   * @space O(1) - No additional space used (excluding callback space)
   */
  forEach(callback: (element: T, index: number) => void): void {
    let current = this.head;
    let index = 0;

    while (current !== null) {
      callback(current.element, index);
      current = current.next;
      index++;
    }
  }

  /**
   * Converts the stack to an array (top to bottom order)
   * @returns {T[]} Array representation of the stack
   * @time O(n) - Must visit each element
   * @space O(n) - Creates new array with n elements
   */
  toArray(): T[] {
    return Array.from(this);
  }

  /**
   * Returns a string representation of the stack
   * Optimized to avoid creating intermediate array
   * @returns {string} String representation showing elements from top to bottom
   * @time O(n) - Must visit each element
   * @space O(n) - String concatenation creates new strings
   */
  toString(): string {
    if (this.isEmpty()) return '[EMPTY]';

    const elements: string[] = [];
    let current = this.head;

    while (current !== null) {
      elements.push(String(current.element));
      current = current.next;
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
    let current = this.head;

    while (current !== null) {
      yield current.element;
      current = current.next;
    }
  }
}

export default LinkedListStack;
