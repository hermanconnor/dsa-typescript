/**
 * Node class representing a single element in the doubly linked list
 * @template T The type of value stored in the node
 */
class Node<T> {
  val: T;
  next: Node<T> | null;
  prev: Node<T> | null;

  constructor(val: T) {
    this.val = val;
    this.next = null;
    this.prev = null;
  }
}

/**
 * A generic doubly linked list implementation with O(1) operations at both ends
 * @template T The type of elements stored in the list
 */
class DoublyLinkedList<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private len;

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
   * Adds a value to the front of the list
   * @param {T} val The value to add
   * @returns {DoublyLinkedList<T>} The list instance for chaining
   * @complexity Time: O(1), Space: O(1)
   */
  prepend(val: T): this {
    const node = new Node(val);

    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }

    this.len++;

    return this;
  }

  /**
   * Adds a value to the end of the list
   * @param {T} val The value to add
   * @returns {DoublyLinkedList<T>} The list instance for chaining
   * @complexity Time: O(1), Space: O(1)
   */
  append(val: T): this {
    const node = new Node(val);

    if (!this.tail) {
      this.head = this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }

    this.len++;

    return this;
  }

  /**
   * Removes and returns the first element from the list
   * @returns {T | null} The removed value, or null if the list is empty
   * @complexity Time: O(1), Space: O(1)
   */
  shift(): T | null {
    if (!this.head) return null;

    const val = this.head.val;
    this.head = this.head.next;

    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }

    this.len--;

    return val;
  }

  /**
   * Removes and returns the last element from the list
   * @returns {T | null} The removed value, or null if the list is empty
   * @complexity Time: O(1), Space: O(1)
   */
  pop(): T | null {
    if (!this.tail) return null;

    const val = this.tail.val;
    this.tail = this.tail.prev;

    if (this.tail) {
      this.tail.next = null;
    } else {
      this.head = null;
    }

    this.len--;

    return val;
  }

  /**
   * Returns the first element without removing it
   * @returns {T | null} The first value, or null if the list is empty
   * @complexity Time: O(1), Space: O(1)
   */
  peekFront(): T | null {
    return this.head ? this.head.val : null;
  }

  /**
   * Returns the last element without removing it
   * @returns {T | null} The last value, or null if the list is empty
   * @complexity Time: O(1), Space: O(1)
   */
  peekBack(): T | null {
    return this.tail ? this.tail.val : null;
  }

  /**
   * Gets the value at the specified index
   * @param {number} idx The index to retrieve (0-based)
   * @returns {T | null} The value at the index, or null if out of bounds
   * @complexity Time: O(n), Space: O(1)
   */
  get(idx: number): T | null {
    const node = this.getNode(idx);

    return node ? node.val : null;
  }

  /**
   * Sets the value at the specified index
   * @param {number} idx The index to update (0-based)
   * @param {T} val The new value
   * @returns {boolean} True if successful, false if index is out of bounds
   * @complexity Time: O(n), Space: O(1)
   */
  set(idx: number, val: T): boolean {
    const node = this.getNode(idx);

    if (!node) return false;

    node.val = val;

    return true;
  }

  /**
   * Inserts a value at the specified index
   * @param {number} idx The index to insert at (0-based)
   * @param {T} val The value to insert
   * @returns {boolean} True if successful, false if index is out of bounds
   * @complexity Time: O(n), Space: O(1)
   */
  insert(idx: number, val: T): boolean {
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
    const prev = this.getNode(idx - 1)!;
    const next = prev.next!;

    prev.next = node;
    node.prev = prev;
    node.next = next;
    next.prev = node;

    this.len++;

    return true;
  }

  /**
   * Removes the element at the specified index
   * @param {number} idx The index to remove (0-based)
   * @returns {T | null} The removed value, or null if index is out of bounds
   * @complexity Time: O(n), Space: O(1)
   */
  remove(idx: number): T | null {
    if (idx < 0 || idx >= this.len) return null;
    if (idx === 0) return this.shift();
    if (idx === this.len - 1) return this.pop();

    const node = this.getNode(idx)!;
    const prev = node.prev!;
    const next = node.next!;

    prev.next = next;
    next.prev = prev;

    this.len--;

    return node.val;
  }

  /**
   * Finds the index of the first occurrence of a value
   * @param {T} val The value to search for
   * @returns {number} The index of the value, or -1 if not found
   * @complexity Time: O(n), Space: O(1)
   */
  indexOf(val: T): number {
    let curr = this.head;
    let idx = 0;

    while (curr) {
      if (curr.val === val) return idx;
      curr = curr.next;
      idx++;
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
   * Removes all elements from the list
   * @returns {DoublyLinkedList<T>} The list instance for chaining
   * @complexity Time: O(1), Space: O(1)
   */
  clear(): this {
    this.head = null;
    this.tail = null;
    this.len = 0;

    return this;
  }

  /**
   * Reverses the order of elements in the list in-place
   * @returns {DoublyLinkedList<T>} The list instance for chaining
   * @complexity Time: O(n), Space: O(1)
   */
  reverse(): this {
    if (!this.head || this.len === 1) return this;

    let curr: Node<T> | null = this.head;

    // Swap next and prev pointers for each node
    while (curr) {
      const temp: Node<T> | null = curr.next;
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
   * Executes a callback function for each element in the list
   * @param {function} callback Function to execute for each element
   * @complexity Time: O(n), Space: O(1)
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
   * Creates a new array with the results of calling a function on every element
   * @template U The type of elements in the resulting array
   * @param {function} callback Function that produces an element of the new array
   * @returns {U[]} A new array with each element being the result of the callback
   * @complexity Time: O(n), Space: O(n)
   */
  map<U>(callback: (val: T, idx: number) => U): U[] {
    const result: U[] = [];
    let curr = this.head;
    let idx = 0;

    while (curr) {
      result.push(callback(curr.val, idx));
      curr = curr.next;
      idx++;
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

    let curr = this.head;
    let idx = 0;

    while (curr) {
      if (predicate(curr.val, idx)) {
        result.push(curr.val);
      }
      curr = curr.next;
      idx++;
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

    let curr = this.head;

    while (curr) {
      arr.push(curr.val);
      curr = curr.next;
    }

    return arr;
  }

  /**
   * Returns a string representation of the list
   * @returns {string} String representation in the format [val1 <-> val2 <-> val3]
   * @complexity Time: O(n), Space: O(n)
   */
  toString(): string {
    if (this.isEmpty) return '[]';

    const values: string[] = [];
    let curr = this.head;

    while (curr) {
      values.push(String(curr.val));
      curr = curr.next;
    }

    return `[${values.join(' <-> ')}]`;
  }

  /**
   * Helper method to get the node at a specific index
   * Optimized to search from the closer end (head or tail)
   * @private
   * @param {number} idx The index to retrieve
   * @returns {Node<T> | null} The node at the index, or null if out of bounds
   * @complexity Time: O(n), Space: O(1)
   */
  private getNode(idx: number): Node<T> | null {
    if (idx < 0 || idx >= this.len) return null;

    let curr: Node<T> | null;

    // Search from closer end
    if (idx < this.len / 2) {
      curr = this.head;
      for (let i = 0; i < idx; i++) {
        curr = curr!.next;
      }
    } else {
      curr = this.tail;
      for (let i = this.len - 1; i > idx; i--) {
        curr = curr!.prev;
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
    let curr = this.head;
    while (curr) {
      yield curr.val;
      curr = curr.next;
    }
  }
}

export default DoublyLinkedList;
