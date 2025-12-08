/**
 * Node class representing a single element in the circular linked list
 * @template T - The type of value stored in the node
 */
class Node<T> {
  value: T;
  next: Node<T>;

  /**
   * Creates a new Node
   * @param {T} value - The value to store in the node
   * @param {Node<T>} [next] - Optional reference to the next node
   * @time O(1)
   * @space O(1)
   */
  constructor(value: T, next?: Node<T>) {
    this.value = value;
    this.next = next || (this as Node<T>); // Self-reference by default for circular structure
  }
}

/**
 * Circular Linked List implementation with generic type support
 * In a circular linked list, the last node points back to the first node
 * @template T - The type of values stored in the list
 */
class CircularLinkedList<T> {
  private tail: Node<T> | null;
  private _size: number;

  /**
   * Creates a new empty CircularLinkedList
   * @time O(1)
   * @space O(1)
   */
  constructor() {
    this.tail = null;
    this._size = 0;
  }

  /**
   * Gets the number of elements in the list
   * @returns {number} The size of the list
   * @time O(1)
   * @space O(1)
   */
  get size(): number {
    return this._size;
  }

  /**
   * Gets the first node in the list (head)
   * @returns {Node<T> | null} The head node, or null if list is empty
   * @time O(1)
   * @space O(1)
   */
  get head(): Node<T> | null {
    return this.tail?.next || null;
  }

  /**
   * Adds a new value to the end of the list
   * @param {T} value - The value to add
   * @returns {this} The list instance for method chaining
   * @time O(1)
   * @space O(1)
   */
  append(value: T): this {
    const node = new Node(value);

    if (!this.tail) {
      node.next = node; // Point to itself for circularity
      this.tail = node;
    } else {
      node.next = this.tail.next; // Point to head
      this.tail.next = node; // Old tail points to new node
      this.tail = node; // Update tail
    }

    this._size++;

    return this;
  }

  /**
   * Adds a new value to the beginning of the list
   * @param {T} value - The value to add
   * @returns {this} The list instance for method chaining
   * @time O(1)
   * @space O(1)
   */
  prepend(value: T): this {
    const node = new Node(value);

    if (!this.tail) {
      node.next = node; // Point to itself for circularity
      this.tail = node;
    } else {
      node.next = this.tail.next; // Point to current head
      this.tail.next = node; // Tail points to new head
    }

    this._size++;

    return this;
  }

  /**
   * Inserts a value at the specified index
   * @param {number} index - The zero-based index where the value should be inserted
   * @param {T} value - The value to insert
   * @returns {boolean} True if successful, false if index is out of bounds
   * @time O(n) - Must traverse to find the insertion point
   * @space O(1)
   */
  insertAt(index: number, value: T): boolean {
    if (index < 0 || index > this._size) return false;

    if (index === 0) {
      this.prepend(value);
      return true;
    }

    if (index === this._size) {
      this.append(value);
      return true;
    }

    let curr = this.tail!.next; // Start at head
    for (let i = 0; i < index - 1; i++) {
      curr = curr.next;
    }

    const node = new Node(value, curr.next);

    curr.next = node;
    this._size++;

    return true;
  }

  /**
   * Removes and returns the first value from the list
   * @returns {T | undefined} The value of the removed node, or undefined if list is empty
   * @time O(1)
   * @space O(1)
   */
  removeFirst(): T | undefined {
    if (!this.tail) return undefined;

    const head = this.tail.next;
    const value = head.value;

    if (head === this.tail) {
      // Single node case
      this.tail = null;
    } else {
      this.tail.next = head.next; // Skip the head
    }

    this._size--;

    return value;
  }

  /**
   * Removes and returns the last value from the list
   * @returns {T | undefined} The value of the removed node, or undefined if list is empty
   * @time O(n) - Must traverse to find the second-to-last node
   * @space O(1)
   */
  removeLast(): T | undefined {
    if (!this.tail) return undefined;

    const value = this.tail.value;

    if (this.tail.next === this.tail) {
      // Single node case
      this.tail = null;
    } else {
      let curr = this.tail.next;

      while (curr.next !== this.tail) {
        curr = curr.next;
      }

      curr.next = this.tail.next; // Point to head
      this.tail = curr; // Update tail
    }

    this._size--;

    return value;
  }

  /**
   * Removes and returns the value at the specified index
   * @param {number} index - The zero-based index of the element to remove
   * @returns {T | undefined} The value of the removed node, or undefined if index is out of bounds
   * @time O(n) - Must traverse to find the node
   * @space O(1)
   */
  removeAt(index: number): T | undefined {
    if (index < 0 || index >= this._size || !this.tail) return undefined;

    if (index === 0) return this.removeFirst();
    if (index === this._size - 1) return this.removeLast();

    let curr = this.tail.next;
    for (let i = 0; i < index - 1; i++) {
      curr = curr.next;
    }

    const removed = curr.next;
    curr.next = removed.next;
    this._size--;

    return removed.value;
  }

  /**
   * Finds the first node with the specified value
   * @param {T} value - The value to search for
   * @returns {Node<T> | null} The node if found, or null if not found
   * @time O(n) - May need to traverse the entire list
   * @space O(1)
   */
  find(value: T): Node<T> | null {
    if (!this.tail) return null;

    let curr = this.tail.next;

    do {
      if (curr.value === value) return curr;

      curr = curr.next;
    } while (curr !== this.tail.next);

    return null;
  }

  /**
   * Checks if a value exists in the list
   * @param {T} value - The value to search for
   * @returns {boolean} True if the value exists, false otherwise
   * @time O(n) - May need to traverse the entire list
   * @space O(1)
   */
  contains(value: T): boolean {
    return this.find(value) !== null;
  }

  /**
   * Gets the value at the specified index
   * @param {number} index - The zero-based index of the element to retrieve
   * @returns {T | undefined} The value at the index, or undefined if index is out of bounds
   * @time O(n) - Must traverse to the specified index
   * @space O(1)
   */
  get(index: number): T | undefined {
    if (index < 0 || index >= this._size || !this.tail) return undefined;

    let curr = this.tail.next;

    for (let i = 0; i < index; i++) {
      curr = curr.next;
    }

    return curr.value;
  }

  /**
   * Updates the value at the specified index
   * @param {number} index - The zero-based index of the element to update
   * @param {T} value - The new value to set
   * @returns {boolean} True if successful, false if index is out of bounds
   * @time O(n) - Must traverse to the specified index
   * @space O(1)
   */
  set(index: number, value: T): boolean {
    if (index < 0 || index >= this._size || !this.tail) return false;

    let curr = this.tail.next;
    for (let i = 0; i < index; i++) {
      curr = curr.next;
    }

    curr.value = value;

    return true;
  }

  /**
   * Finds the index of the first occurrence of a value
   * @param {T} value - The value to search for
   * @returns {number} The index of the value, or -1 if not found
   * @time O(n) - May need to traverse the entire list
   * @space O(1)
   */
  indexOf(value: T): number {
    if (!this.tail) return -1;

    let curr = this.tail.next;
    let index = 0;
    do {
      if (curr.value === value) return index;
      curr = curr.next;
      index++;
    } while (curr !== this.tail.next);

    return -1;
  }

  /**
   * Executes a provided function once for each list element
   * @param {function(T, number): void} callback - Function to execute for each element
   * @time O(n) - Must traverse the entire list
   * @space O(1)
   */
  forEach(callback: (value: T, index: number) => void): void {
    if (!this.tail) return;

    let curr = this.tail.next;
    let index = 0;

    do {
      callback(curr.value, index++);
      curr = curr.next;
    } while (curr !== this.tail.next);
  }

  /**
   * Creates a new list with the results of calling a function on every element
   * @template U - The type of values in the new list
   * @param {function(T, number): U} callback - Function that produces an element of the new list
   * @returns {CircularLinkedList<U>} A new list with transformed values
   * @time O(n) - Must traverse the entire list
   * @space O(n) - Creates a new list with n elements
   */
  map<U>(callback: (value: T, index: number) => U): CircularLinkedList<U> {
    const newList = new CircularLinkedList<U>();

    this.forEach((value, index) => {
      newList.append(callback(value, index));
    });

    return newList;
  }

  /**
   * Creates a new list with all elements that pass the test
   * @param {function(T, number): boolean} predicate - Function to test each element
   * @returns {CircularLinkedList<T>} A new list with filtered values
   * @time O(n) - Must traverse the entire list
   * @space O(n) - Creates a new list (size depends on filter results)
   */
  filter(
    predicate: (value: T, index: number) => boolean,
  ): CircularLinkedList<T> {
    const newList = new CircularLinkedList<T>();

    this.forEach((value, index) => {
      if (predicate(value, index)) {
        newList.append(value);
      }
    });

    return newList;
  }

  /**
   * Reduces the list to a single value by executing a reducer function
   * @template U - The type of the accumulated value
   * @param {function(U, T, number): U} callback - Function to execute on each element
   * @param {U} initialValue - Initial value for the accumulator
   * @returns {U} The final accumulated value
   * @time O(n) - Must traverse the entire list
   * @space O(1)
   */
  reduce<U>(
    callback: (accumulator: U, value: T, index: number) => U,
    initialValue: U,
  ): U {
    let accumulator = initialValue;
    this.forEach((value, index) => {
      accumulator = callback(accumulator, value, index);
    });

    return accumulator;
  }

  /**
   * Rotates the list forward by k steps
   * Positive k rotates forward (tail moves forward)
   * Negative k rotates backward (tail moves backward)
   * @param {number} k - Number of steps to rotate
   * @returns {this} The list instance for method chaining
   * @time O(k mod n) - Where n is the size of the list
   * @space O(1)
   */
  rotate(k: number): this {
    if (!this.tail || this._size <= 1) return this;

    // Normalize k to be within [0, size)
    k = ((k % this._size) + this._size) % this._size;
    if (k === 0) return this;

    // Move tail forward k times
    for (let i = 0; i < k; i++) {
      this.tail = this.tail.next;
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
    return this.tail === null;
  }

  /**
   * Removes all elements from the list
   * @time O(1)
   * @space O(1)
   */
  clear(): void {
    this.tail = null;
    this._size = 0;
  }

  /**
   * Converts the list to an array
   * @returns {T[]} An array containing all values in the list
   * @time O(n) - Must traverse the entire list
   * @space O(n) - Creates a new array with n elements
   */
  toArray(): T[] {
    if (!this.tail) return [];

    const arr: T[] = [];
    let curr = this.tail.next;

    do {
      arr.push(curr.value);
      curr = curr.next;
    } while (curr !== this.tail.next);

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
    if (!this.tail) return '[]';

    return `[${this.toArray().join(separator)}] -> (circular)`;
  }

  // Aliases for array-like naming conventions
  /**
   * Alias for append() - adds to the end
   * @time O(1)
   * @space O(1)
   */
  push(value: T): this {
    return this.append(value);
  }

  /**
   * Alias for prepend() - adds to the beginning
   * @time O(1)
   * @space O(1)
   */
  unshift(value: T): this {
    return this.prepend(value);
  }

  /**
   * Alias for removeFirst() - removes from the beginning
   * @time O(1)
   * @space O(1)
   */
  shift(): T | undefined {
    return this.removeFirst();
  }

  /**
   * Alias for removeLast() - removes from the end
   * @time O(n)
   * @space O(1)
   */
  pop(): T | undefined {
    return this.removeLast();
  }

  /**
   * Iterator support - allows the list to be used with for...of loops
   * @yields {T} The next value in the list
   * @time O(n) - Yields each element once
   * @space O(1) - Uses constant space for iteration state
   */
  *[Symbol.iterator](): Iterator<T> {
    if (!this.tail) return;

    let curr = this.tail.next;
    do {
      yield curr.value;
      curr = curr.next;
    } while (curr !== this.tail.next);
  }
}

export default CircularLinkedList;
