/**
 * Node class representing a single element in the linked list
 * @template T - The type of value stored in the node
 */
class Node<T> {
  val: T;
  next: Node<T> | null;

  /**
   * Creates a new Node
   * @param {T} val - The value to store in the node
   * @time O(1)
   * @space O(1)
   */
  constructor(val: T) {
    this.val = val;
    this.next = null;
  }
}

/**
 * Singly Linked List implementation with generic type support
 * @template T - The type of values stored in the list
 */
class SinglyLinkedList<T> {
  head: Node<T> | null;
  tail: Node<T> | null;
  length: number;

  /**
   * Creates a new empty SinglyLinkedList
   * @time O(1)
   * @space O(1)
   */
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * Adds a new node with the given value to the end of the list
   * @param {T} val - The value to add
   * @returns {this} The list instance for method chaining
   * @time O(1)
   * @space O(1)
   */
  push(val: T): this {
    const node = new Node(val);

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail!.next = node;
      this.tail = node;
    }

    this.length++;

    return this;
  }

  /**
   * Removes and returns the last node's value from the list
   * @returns {T | undefined} The value of the removed node, or undefined if list is empty
   * @time O(n) - Must traverse to find the second-to-last node
   * @space O(1)
   */
  pop(): T | undefined {
    if (!this.head) return undefined;

    // Handle single-node case
    if (this.head === this.tail) {
      const val = this.head.val;

      this.head = null;
      this.tail = null;
      this.length--;

      return val;
    }

    let curr = this.head;
    let newTail = curr;

    while (curr.next) {
      newTail = curr;
      curr = curr.next;
    }

    this.tail = newTail;
    this.tail.next = null;
    this.length--;

    return curr.val;
  }

  /**
   * Adds a new node with the given value to the beginning of the list
   * @param {T} val - The value to add
   * @returns {this} The list instance for method chaining
   * @time O(1)
   * @space O(1)
   */
  unshift(val: T): this {
    const node = new Node(val);

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head = node;
    }

    this.length++;

    return this;
  }

  /**
   * Removes and returns the first node's value from the list
   * @returns {T | undefined} The value of the removed node, or undefined if list is empty
   * @time O(1)
   * @space O(1)
   */
  shift(): T | undefined {
    if (!this.head) return undefined;

    const curr = this.head;

    this.head = curr.next;
    this.length--;

    if (this.length === 0) {
      this.tail = null;
    }

    return curr.val;
  }

  /**
   * Retrieves the node at the specified index
   * @param {number} idx - The zero-based index of the node to retrieve
   * @returns {Node<T> | null} The node at the specified index, or null if index is out of bounds
   * @time O(n) - Must traverse from head to the specified index
   * @space O(1)
   */
  get(idx: number): Node<T> | null {
    if (idx < 0 || idx >= this.length) return null;

    let curr = this.head;
    for (let i = 0; i < idx; i++) {
      curr = curr!.next;
    }

    return curr;
  }

  /**
   * Updates the value of the node at the specified index
   * @param {number} idx - The zero-based index of the node to update
   * @param {T} val - The new value to set
   * @returns {boolean} True if successful, false if index is out of bounds
   * @time O(n) - Must traverse to find the node
   * @space O(1)
   */
  set(idx: number, val: T): boolean {
    const node = this.get(idx);

    if (node) {
      node.val = val;
      return true;
    }

    return false;
  }

  /**
   * Inserts a new node with the given value at the specified index
   * @param {number} idx - The zero-based index where the new node should be inserted
   * @param {T} val - The value to insert
   * @returns {boolean} True if successful, false if index is out of bounds
   * @time O(n) - Must traverse to find the insertion point
   * @space O(1)
   */
  insert(idx: number, val: T): boolean {
    if (idx < 0 || idx > this.length) return false;
    if (idx === 0) {
      this.unshift(val);
      return true;
    }

    if (idx === this.length) {
      this.push(val);
      return true;
    }

    const node = new Node(val);
    const prev = this.get(idx - 1);

    if (!prev) return false;

    node.next = prev.next;
    prev.next = node;
    this.length++;

    return true;
  }

  /**
   * Removes and returns the value of the node at the specified index
   * @param {number} idx - The zero-based index of the node to remove
   * @returns {T | undefined} The value of the removed node, or undefined if index is out of bounds
   * @time O(n) - Must traverse to find the node
   * @space O(1)
   */
  remove(idx: number): T | undefined {
    if (idx < 0 || idx >= this.length) return undefined;
    if (idx === 0) return this.shift();
    if (idx === this.length - 1) return this.pop();

    const prev = this.get(idx - 1);

    if (!prev || !prev.next) return undefined;

    const removed = prev.next;
    prev.next = removed.next;
    this.length--;

    return removed.val;
  }

  /**
   * Reverses the list in place
   * @returns {this} The list instance for method chaining
   * @time O(n) - Must traverse the entire list once
   * @space O(1) - Only uses a constant amount of extra space
   */
  reverse(): this {
    if (!this.head || this.length <= 1) return this; // Optimization for empty or single-node lists

    // Swap head and tail
    let node: Node<T> | null = this.head;
    this.head = this.tail;
    this.tail = node;

    let prev: Node<T> | null = null;
    let next: Node<T> | null;

    for (let i = 0; i < this.length; i++) {
      next = node!.next;
      node!.next = prev;
      prev = node;
      node = next;
    }

    return this;
  }

  /**
   * Checks if the list is empty
   * @returns {boolean} True if the list is empty, false otherwise
   * @time O(1)
   * @space O(1)
   */
  isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * Removes all nodes from the list
   * @time O(1)
   * @space O(1)
   */
  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * Converts the list to an array
   * @returns {T[]} An array containing all values in the list
   * @time O(n) - Must traverse the entire list
   * @space O(n) - Creates a new array with n elements
   */
  toArray(): T[] {
    const arr: T[] = [];

    let curr = this.head;

    while (curr) {
      arr.push(curr.val);
      curr = curr.next;
    }

    return arr;
  }

  /**
   * Converts the list to a string representation
   * @param {string} separator - The separator to use between values (default: ' -> ')
   * @returns {string} A string representation of the list
   * @time O(n) - Must traverse the entire list
   * @space O(n) - Creates a string with n elements
   */
  toString(separator: string = ' -> '): string {
    if (this.isEmpty()) return 'null';

    return this.toArray().join(separator) + ' -> null';
  }

  /**
   * Finds the first node that satisfies the provided testing function
   * @param {function(T): boolean} predicate - Function to test each value
   * @returns {T | undefined} The first value that satisfies the predicate, or undefined
   * @time O(n) - May need to traverse the entire list
   * @space O(1)
   */
  find(predicate: (val: T) => boolean): T | undefined {
    let curr = this.head;

    while (curr) {
      if (predicate(curr.val)) {
        return curr.val;
      }

      curr = curr.next;
    }

    return undefined;
  }

  /**
   * Executes a provided function once for each list element
   * @param {function(T, number): void} callback - Function to execute for each element
   * @time O(n) - Must traverse the entire list
   * @space O(1)
   */
  forEach(callback: (val: T, idx: number) => void): void {
    let curr = this.head;
    let idx = 0;

    while (curr) {
      callback(curr.val, idx);
      curr = curr.next;
      idx++;
    }
  }

  /**
   * Iterator support - allows the list to be used with for...of loops
   * @yields {T} The next value in the list
   * @time O(n) - Yields each element once
   * @space O(1) - Uses constant space for iteration state
   */
  *[Symbol.iterator](): Iterator<T> {
    let curr = this.head;
    while (curr) {
      yield curr.val;
      curr = curr.next;
    }
  }
}

export default SinglyLinkedList;
