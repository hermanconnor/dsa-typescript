/**
 * Node class representing a single element in the circular doubly linked list
 * @template T The type of value stored in the node
 */
class Node<T> {
  val: T;
  next: Node<T>;
  prev: Node<T>;

  constructor(val: T) {
    this.val = val;
    // Initialize to self - will be updated when added to list
    this.next = this;
    this.prev = this;
  }
}

/**
 * A generic circular doubly linked list implementation where the last node
 * connects back to the first node, forming a circle
 * @template T The type of elements stored in the list
 */
class CircularDoublyLinkedList<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private len: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.len = 0;
  }

  /**
   * Gets the current size of the list
   * @returns {number} The number of elements in the list
   * @complexity Time: O(1), Space: O(1)
   */
  get size(): number {
    return this.len;
  }

  /**
   * Checks if the list is empty
   * @returns {boolean} True if the list has no elements
   * @complexity Time: O(1), Space: O(1)
   */
  get isEmpty(): boolean {
    return this.len === 0;
  }

  /**
   * Adds a value to the end of the list
   * @param {T} val The value to add
   * @returns {CircularDoublyLinkedList<T>} The list instance for chaining
   * @complexity Time: O(1), Space: O(1)
   */
  append(val: T): this {
    const node = new Node(val);

    if (!this.head) {
      this.head = this.tail = node;
      node.next = node.prev = node;
    } else {
      node.prev = this.tail!;
      node.next = this.head;
      this.tail!.next = node;
      this.head.prev = node;
      this.tail = node;
    }

    this.len++;

    return this;
  }

  /**
   * Adds a value to the beginning of the list
   * @param {T} val The value to add
   * @returns {CircularDoublyLinkedList<T>} The list instance for chaining
   * @complexity Time: O(1), Space: O(1)
   */
  prepend(val: T): this {
    const node = new Node(val);

    if (!this.head) {
      this.head = this.tail = node;
      node.next = node.prev = node;
    } else {
      node.next = this.head;
      node.prev = this.tail!;
      this.head.prev = node;
      this.tail!.next = node;
      this.head = node;
    }

    this.len++;

    return this;
  }

  /**
   * Inserts a value at the specified index
   * @param {number} idx The index to insert at (0-based)
   * @param {T} val The value to insert
   * @returns {boolean} True if successful, false if index is out of bounds
   * @complexity Time: O(n), Space: O(1)
   */
  insertAt(idx: number, val: T): boolean {
    if (idx < 0 || idx > this.len) return false;
    if (idx === 0) {
      this.prepend(val);
      return true;
    }
    if (idx === this.len) {
      this.append(val);
      return true;
    }

    const node = new Node(val);
    const curr = this.getNodeAt(idx)!;

    node.next = curr;
    node.prev = curr.prev;
    curr.prev.next = node;
    curr.prev = node;
    this.len++;

    return true;
  }

  /**
   * Removes and returns the first element from the list
   * @returns {T | undefined} The removed value, or undefined if the list is empty
   * @complexity Time: O(1), Space: O(1)
   */
  removeFirst(): T | undefined {
    if (!this.head) return undefined;

    const val = this.head.val;

    if (this.len === 1) {
      this.head = this.tail = null;
    } else {
      this.head = this.head.next;
      this.head.prev = this.tail!;
      this.tail!.next = this.head;
    }

    this.len--;

    return val;
  }

  /**
   * Removes and returns the last element from the list
   * @returns {T | undefined} The removed value, or undefined if the list is empty
   * @complexity Time: O(1), Space: O(1)
   */
  removeLast(): T | undefined {
    if (!this.tail) return undefined;

    const val = this.tail.val;

    if (this.len === 1) {
      this.head = this.tail = null;
    } else {
      this.tail = this.tail.prev;
      this.tail.next = this.head!;
      this.head!.prev = this.tail;
    }

    this.len--;

    return val;
  }

  /**
   * Removes the element at the specified index
   * @param {number} idx The index to remove (0-based)
   * @returns {T | undefined} The removed value, or undefined if index is out of bounds
   * @complexity Time: O(n), Space: O(1)
   */
  removeAt(idx: number): T | undefined {
    if (idx < 0 || idx >= this.len) return undefined;
    if (idx === 0) return this.removeFirst();
    if (idx === this.len - 1) return this.removeLast();

    const node = this.getNodeAt(idx)!;

    node.prev.next = node.next;
    node.next.prev = node.prev;
    this.len--;

    return node.val;
  }

  /**
   * Gets the value at the specified index
   * @param {number} idx The index to retrieve (0-based)
   * @returns {T | undefined} The value at the index, or undefined if out of bounds
   * @complexity Time: O(n), Space: O(1)
   */
  get(idx: number): T | undefined {
    const node = this.getNodeAt(idx);

    return node?.val;
  }

  /**
   * Sets the value at the specified index
   * @param {number} idx The index to update (0-based)
   * @param {T} val The new value
   * @returns {boolean} True if successful, false if index is out of bounds
   * @complexity Time: O(n), Space: O(1)
   */
  set(idx: number, val: T): boolean {
    const node = this.getNodeAt(idx);

    if (!node) return false;

    node.val = val;

    return true;
  }

  /**
   * Finds the index of the first occurrence of a value
   * @param {T} val The value to search for
   * @returns {number} The index of the value, or -1 if not found
   * @complexity Time: O(n), Space: O(1)
   */
  indexOf(val: T): number {
    if (!this.head) return -1;

    let curr = this.head;
    for (let i = 0; i < this.len; i++) {
      if (curr.val === val) return i;

      curr = curr.next;
    }

    return -1;
  }

  /**
   * Checks if the list contains a value
   * @param {T} val The value to search for
   * @returns {boolean} True if the value exists in the list
   * @complexity Time: O(n), Space: O(1)
   */
  contains(val: T): boolean {
    return this.indexOf(val) !== -1;
  }

  /**
   * Returns the first element without removing it
   * @returns {T | undefined} The first value, or undefined if the list is empty
   * @complexity Time: O(1), Space: O(1)
   */
  getFirst(): T | undefined {
    return this.head?.val;
  }

  /**
   * Returns the last element without removing it
   * @returns {T | undefined} The last value, or undefined if the list is empty
   * @complexity Time: O(1), Space: O(1)
   */
  getLast(): T | undefined {
    return this.tail?.val;
  }

  /**
   * Alias for getFirst() - returns first element without removing it
   * @returns {T | undefined} The first value, or undefined if the list is empty
   * @complexity Time: O(1), Space: O(1)
   */
  peekFront(): T | undefined {
    return this.getFirst();
  }

  /**
   * Alias for getLast() - returns last element without removing it
   * @returns {T | undefined} The last value, or undefined if the list is empty
   * @complexity Time: O(1), Space: O(1)
   */
  peekBack(): T | undefined {
    return this.getLast();
  }

  /**
   * Rotates the list by moving the head pointer forward by n positions
   * Positive values rotate forward, negative values rotate backward
   * @param {number} positions Number of positions to rotate (default: 1)
   * @returns {CircularDoublyLinkedList<T>} The list instance for chaining
   * @complexity Time: O(n) worst case, Space: O(1)
   */
  rotate(positions: number = 1): this {
    if (!this.head || this.len <= 1) return this;

    // Normalize positions to be within list length
    positions = ((positions % this.len) + this.len) % this.len;
    if (positions === 0) return this;

    // Move head forward by positions
    let curr = this.head;
    for (let i = 0; i < positions; i++) {
      curr = curr.next;
    }

    this.head = curr;
    this.tail = curr.prev;

    return this;
  }

  /**
   * Reverses the order of elements in the list in-place
   * @returns {CircularDoublyLinkedList<T>} The list instance for chaining
   * @complexity Time: O(n), Space: O(1)
   */
  reverse(): this {
    if (!this.head || this.len === 1) return this;

    let curr = this.head;
    for (let i = 0; i < this.len; i++) {
      const temp = curr.next;
      curr.next = curr.prev;
      curr.prev = temp;
      curr = temp;
    }

    // Swap head and tail
    const temp = this.head;
    this.head = this.tail;
    this.tail = temp;

    return this;
  }

  /**
   * Removes all elements from the list
   * @returns {CircularDoublyLinkedList<T>} The list instance for chaining
   * @complexity Time: O(1), Space: O(1)
   */
  clear(): this {
    this.head = this.tail = null;
    this.len = 0;

    return this;
  }

  /**
   * Executes a callback function for each element in the list
   * @param {function} callback Function to execute for each element
   * @complexity Time: O(n), Space: O(1)
   */
  forEach(callback: (val: T, idx: number) => void): void {
    if (!this.head) return;

    let curr = this.head;
    for (let i = 0; i < this.len; i++) {
      callback(curr.val, i);
      curr = curr.next;
    }
  }

  /**
   * Creates a new array with the results of calling a function on every element
   * @template U The type of elements in the resulting array
   * @param {function} callback Function that produces an element of the new array
   * @returns {U[]} A new array with each element being the result of the callback
   * @complexity Time: O(n), Space: O(n)
   */
  map<U>(callback: (val: T, idx: number) => U): U[] {
    const result: U[] = [];

    if (!this.head) return result;

    let curr = this.head;
    for (let i = 0; i < this.len; i++) {
      result.push(callback(curr.val, i));
      curr = curr.next;
    }

    return result;
  }

  /**
   * Creates a new array with all elements that pass the test
   * @param {function} predicate Function to test each element
   * @returns {T[]} A new array with elements that pass the test
   * @complexity Time: O(n), Space: O(n)
   */
  filter(predicate: (val: T, idx: number) => boolean): T[] {
    const result: T[] = [];

    if (!this.head) return result;

    let curr = this.head;
    for (let i = 0; i < this.len; i++) {
      if (predicate(curr.val, i)) {
        result.push(curr.val);
      }

      curr = curr.next;
    }

    return result;
  }

  /**
   * Converts the list to an array
   * @returns {T[]} An array containing all elements in order
   * @complexity Time: O(n), Space: O(n)
   */
  toArray(): T[] {
    const arr: T[] = [];

    if (!this.head) return arr;

    let curr = this.head;
    for (let i = 0; i < this.len; i++) {
      arr.push(curr.val);
      curr = curr.next;
    }

    return arr;
  }

  /**
   * Returns a string representation of the circular list
   * @returns {string} String representation in the format [val1 ↔ val2 ↔ val3 ⟲]
   * @complexity Time: O(n), Space: O(n)
   */
  toString(): string {
    if (this.isEmpty) return '[]';

    const values: string[] = [];
    let curr = this.head!;

    for (let i = 0; i < this.len; i++) {
      values.push(String(curr.val));
      curr = curr.next;
    }

    return `[${values.join(' ↔ ')} ⟲]`;
  }

  /**
   * Helper method to get the node at a specific index
   * Optimized to search from the closer end (head or tail)
   * @private
   * @param {number} idx The index to retrieve
   * @returns {Node<T> | null} The node at the index, or null if out of bounds
   * @complexity Time: O(n), Space: O(1)
   */
  private getNodeAt(idx: number): Node<T> | null {
    if (!this.head || idx < 0 || idx >= this.len) return null;

    let curr: Node<T>;

    // Optimize: traverse from closest end
    if (idx < this.len / 2) {
      curr = this.head;
      for (let i = 0; i < idx; i++) {
        curr = curr.next;
      }
    } else {
      curr = this.tail!;
      for (let i = this.len - 1; i > idx; i--) {
        curr = curr.prev;
      }
    }

    return curr;
  }

  /**
   * Makes the list iterable with for...of loops
   * @returns {Iterator<T>} An iterator over the list values
   * @complexity Time: O(1) per iteration, Space: O(1)
   */
  *[Symbol.iterator](): Iterator<T> {
    if (!this.head) return;

    let curr = this.head;
    for (let i = 0; i < this.len; i++) {
      yield curr.val;
      curr = curr.next;
    }
  }
}

export default CircularDoublyLinkedList;
