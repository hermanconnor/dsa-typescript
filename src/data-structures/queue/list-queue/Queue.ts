/**
 * @class Node
 * @description Represents a node in the linked list used by the Queue.
 * @template T The type of the value stored in the node.
 */
class Node<T> {
  value: T;
  next: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

/**
 * @class Queue
 * @description A generic First-In, First-Out (FIFO) queue implemented using a singly linked list.
 * @template T The type of elements held in the queue.
 */
class Queue<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private count: number;
  private maxlen?: number;

  constructor(itemsOrCapacity?: Iterable<T> | number, capacity?: number) {
    this.head = null;
    this.tail = null;
    this.count = 0;

    // Handle overloaded signatures
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
        ? Math.max(0, itemsArray.length - this.maxlen)
        : 0;

      this.initializeFromItems(itemsArray, startIdx);
    }
  }

  /**
   * @private
   * @description Initializes the linked list (head, tail, and count) from an array of items.
   * It starts appending items from a specified index, respecting the max length constraint.
   * @param {T[]} items The array of elements to initialize the queue with.
   * @param {number} startIdx The index in the `items` array to begin building the queue from.
   * @returns {void}
   * @TimeComplexity O(k) - Linear time, where k is the number of elements added (items.length - startIdx).
   * @SpaceComplexity O(k) - Linear space complexity for the nodes created, where k is the number of elements added.
   */
  private initializeFromItems(items: T[], startIdx: number): void {
    // Build the linked list directly
    for (let i = startIdx; i < items.length; i++) {
      const newNode = new Node(items[i]);

      if (!this.tail) {
        // First node
        this.head = newNode;
        this.tail = newNode;
      } else {
        // Subsequent nodes
        this.tail.next = newNode;
        this.tail = newNode;
      }

      this.count++;
    }
  }

  /**
   * Adds an element to the back (tail) of the queue.
   * @param {T} value The element to add.
   * @TimeComplexity O(1) - Constant time, as it only involves pointer manipulation at the tail.
   * @SpaceComplexity O(1) - A new node is created.
   */
  enqueue(value: T): void {
    const newNode = new Node(value);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this.count++;

    // If maxlen is set and we've exceeded it, dequeue from the front
    if (this.maxlen !== undefined && this.count > this.maxlen) {
      this.dequeue();
    }
  }

  /**
   * Removes and returns the element from the front (head) of the queue.
   * @returns {T | undefined} The element at the front, or `undefined` if the queue is empty.
   * @TimeComplexity O(1) - Constant time, as it only involves pointer manipulation at the head.
   * @SpaceComplexity O(1) - No extra space is used.
   */
  dequeue(): T | undefined {
    if (!this.head) return undefined;

    const value = this.head.value;

    this.head = this.head.next;

    if (!this.head) {
      this.tail = null; // If empty, the tail must also be null.
    }

    this.count--;

    return value;
  }

  /**
   * Returns the element at the front (head) without removing it.
   * @returns {T | undefined} The element at the front, or `undefined` if the queue is empty.
   * @TimeComplexity O(1) - Constant time, as it accesses the head directly.
   * @SpaceComplexity O(1) - No extra space is used.
   */
  peek(): T | undefined {
    return this.head?.value;
  }

  /**
   * Returns the element at the back (tail) without removing it.
   * @returns {T | undefined} The element at the back, or `undefined` if the queue is empty.
   * @TimeComplexity O(1) - Constant time, as it accesses the tail directly.
   * @SpaceComplexity O(1) - No extra space is used.
   */
  peekBack(): T | undefined {
    return this.tail?.value;
  }

  /**
   * Checks if the queue is empty.
   * @returns {boolean} `true` if the queue contains no elements, `false` otherwise.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space is used.
   */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Returns the number of elements in the queue.
   * @returns {number} The current number of elements.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space is used.
   */
  size(): number {
    return this.count;
  }

  /**
   * Removes all elements from the queue.
   * @TimeComplexity O(1) - Constant time for resetting pointers and count.
   * @SpaceComplexity O(1) - No extra space is used.
   */
  clear(): void {
    this.head = null;
    this.tail = null;
    this.count = 0;
  }

  /**
   * Converts the queue to an array.
   * @returns {T[]} An array containing all elements in FIFO order.
   * @TimeComplexity O(n) - Iterates over all n elements.
   * @SpaceComplexity O(n) - Creates a new array of size n.
   */
  toArray(): T[] {
    return [...this];
  }

  /**
   * Returns a string representation of the queue, showing elements from front to back.
   * @returns {string} A string representing the queue's content.
   * @TimeComplexity O(n) - Iterates over all n elements.
   * @SpaceComplexity O(n) - Creates a new string proportional to the number of elements.
   */
  toString(): string {
    if (this.isEmpty()) return '[EMPTY]';

    let current = this.head;
    let s = '[FRONT] ';

    while (current !== null) {
      s += `${current.value}`;
      if (current.next !== null) {
        s += ' <- '; // Represents the flow from head to tail (front to back)
      }

      current = current.next;
    }

    s += ' [BACK]';

    return s;
  }

  /**
   * Implements the Iterable protocol, allowing the queue to be used in a for...of loop or spread operator.
   * Elements are yielded from front (head) to back (tail).
   * @yields {T} The value of the next node.
   * @TimeComplexity O(n) - For a full iteration over n elements.
   * @SpaceComplexity O(1) - Iteration uses constant extra space (excluding the returned values).
   */
  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;

    while (current !== null) {
      yield current.value;
      current = current.next;
    }
  }
}

export default Queue;
