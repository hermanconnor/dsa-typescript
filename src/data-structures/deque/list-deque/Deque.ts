/**
 * @class Node
 * @description Represents a doubly-linked node in the deque.
 * @template T The type of the value stored in the node.
 */
class Node<T> {
  value: T;
  next: Node<T> | null;
  prev: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

/**
 * @class Deque
 * @description A generic double-ended queue (deque) implemented using a doubly linked list.
 * Supports efficient O(1) operations at both ends.
 * @template T The type of elements held in the deque.
 */
class Deque<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private count: number;
  private readonly maxlen?: number;

  constructor(itemsOrCapacity?: Iterable<T> | number, capacity?: number) {
    this.head = null;
    this.tail = null;
    this.count = 0;

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
   * @description Initializes the doubly linked list from an array of items.
   * @param {T[]} items The array of elements to initialize the deque with.
   * @param {number} startIdx The index to begin building the deque from.
   * @returns {void}
   * @TimeComplexity O(k) - Linear time, where k is the number of elements added.
   * @SpaceComplexity O(k) - Linear space for the nodes created.
   */
  private initializeFromItems(items: T[], startIdx: number): void {
    for (let i = startIdx; i < items.length; i++) {
      const newNode = new Node(items[i]);

      if (!this.tail) {
        // First node
        this.head = newNode;
        this.tail = newNode;
      } else {
        // Link new node to tail
        newNode.prev = this.tail;
        this.tail.next = newNode;
        this.tail = newNode;
      }

      this.count++;
    }
  }

  /**
   * Adds an element to the front (head) of the deque.
   * If maxlen is set and exceeded, removes from the rear.
   * @param {T} item The element to add.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - A new node is created.
   */
  addFront(item: T): void {
    const newNode = new Node(item);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }

    this.count++;

    // If maxlen is set and exceeded, remove from rear
    if (this.maxlen !== undefined && this.count > this.maxlen) {
      this.removeRear();
    }
  }

  /**
   * Adds an element to the rear (tail) of the deque.
   * If maxlen is set and exceeded, removes from the front.
   * @param {T} item The element to add.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - A new node is created.
   */
  addRear(item: T): void {
    const newNode = new Node(item);

    if (this.tail === null) {
      this.head = this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.count++;

    // If maxlen is set and exceeded, remove from front
    if (this.maxlen !== undefined && this.count > this.maxlen) {
      this.removeFront();
    }
  }

  /**
   * Removes and returns the element from the front (head) of the deque.
   * @returns {T | undefined} The element at the front, or `undefined` if empty.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space used.
   */
  removeFront(): T | undefined {
    if (this.head === null) return undefined;

    const value = this.head.value;
    const oldHead = this.head;

    this.head = this.head.next;

    if (this.head !== null) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }

    // Break links for garbage collection
    oldHead.next = null;

    this.count--;

    return value;
  }

  /**
   * Removes and returns the element from the rear (tail) of the deque.
   * @returns {T | undefined} The element at the rear, or `undefined` if empty.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space used.
   */
  removeRear(): T | undefined {
    if (this.tail === null) return undefined;

    const value = this.tail.value;
    const oldTail = this.tail;

    this.tail = this.tail.prev;

    if (this.tail !== null) {
      this.tail.next = null;
    } else {
      this.head = null;
    }

    // Break links for garbage collection
    oldTail.prev = null;

    this.count--;

    return value;
  }

  /**
   * Returns the element at the front without removing it.
   * @returns {T | undefined} The element at the front, or `undefined` if empty.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space used.
   */
  peekFront(): T | undefined {
    return this.head?.value;
  }

  /**
   * Returns the element at the rear without removing it.
   * @returns {T | undefined} The element at the rear, or `undefined` if empty.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space used.
   */
  peekRear(): T | undefined {
    return this.tail?.value;
  }

  /**
   * Checks if the deque contains a specific item.
   * Uses strict equality (===) for comparison.
   * @param {T} item The item to search for.
   * @returns {boolean} `true` if the item is found, `false` otherwise.
   * @TimeComplexity O(n) - May need to traverse entire deque.
   * @SpaceComplexity O(1) - No extra space used.
   */
  contains(item: T): boolean {
    let current = this.head;

    while (current !== null) {
      if (current.value === item) {
        return true;
      }

      current = current.next;
    }

    return false;
  }

  /**
   * Returns the element at the specified index (0-based from front).
   * Negative indices count from the rear (-1 is last element).
   * @param {number} index The index of the element to retrieve.
   * @returns {T | undefined} The element at the index, or `undefined` if out of bounds.
   * @TimeComplexity O(n) - May need to traverse up to n elements.
   * @SpaceComplexity O(1) - No extra space used.
   */
  get(index: number): T | undefined {
    // Handle negative indices
    if (index < 0) {
      index = this.count + index;
    }

    // Out of bounds check
    if (index < 0 || index >= this.count) {
      return undefined;
    }

    // Optimize: start from front or rear depending on index
    if (index < this.count / 2) {
      // Traverse from front
      let current = this.head;

      for (let i = 0; i < index; i++) {
        current = current!.next;
      }

      return current!.value;
    } else {
      // Traverse from rear
      let current = this.tail;

      for (let i = this.count - 1; i > index; i--) {
        current = current!.prev;
      }

      return current!.value;
    }
  }

  /**
   * Extends the deque by adding multiple items to the rear.
   * If maxlen is set, removes from front as needed.
   * @param {Iterable<T>} items The items to add.
   * @TimeComplexity O(k) - Where k is the number of items.
   * @SpaceComplexity O(1) - Constant extra space (excluding new nodes).
   */
  extend(items: Iterable<T>): void {
    for (const item of items) {
      this.addRear(item);
    }
  }

  /**
   * Extends the deque by adding multiple items to the front (in order).
   * Items are added so that the first item in the iterable becomes the new front.
   * If maxlen is set, removes from rear as needed.
   * @param {Iterable<T>} items The items to add.
   * @TimeComplexity O(k) - Where k is the number of items.
   * @SpaceComplexity O(k) - May need to convert iterable to array for reverse order.
   */
  extendLeft(items: Iterable<T>): void {
    // Convert to array to add in reverse order
    // This ensures the first item in the iterable becomes the new front
    const itemsArray = Array.from(items);

    for (let i = itemsArray.length - 1; i >= 0; i--) {
      this.addFront(itemsArray[i]);
    }
  }

  /**
   * Returns the number of elements in the deque.
   * @returns {number} The current number of elements.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space used.
   */
  get length(): number {
    return this.count;
  }

  /**
   * Returns the number of elements in the deque (method form for compatibility).
   * @returns {number} The current number of elements.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space used.
   */
  size(): number {
    return this.count;
  }

  /**
   * Returns the maximum length of the deque, if set.
   * @returns {number | undefined} The maximum length, or `undefined` if not set.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space used.
   */
  getMaxLen(): number | undefined {
    return this.maxlen;
  }

  /**
   * Checks if the deque is empty.
   * @returns {boolean} `true` if the deque contains no elements, `false` otherwise.
   * @TimeComplexity O(1) - Constant time.
   * @SpaceComplexity O(1) - No extra space used.
   */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Removes all elements from the deque.
   * @TimeComplexity O(n) - Needs to break all links for proper garbage collection.
   * @SpaceComplexity O(1) - No extra space used.
   */
  clear(): void {
    // Break all links for better garbage collection
    let current = this.head;

    while (current !== null) {
      const next = current.next;

      current.prev = null;
      current.next = null;
      current = next;
    }

    this.head = null;
    this.tail = null;
    this.count = 0;
  }

  /**
   * Converts the deque to an array from front to rear.
   * @returns {T[]} An array containing all elements in order.
   * @TimeComplexity O(n) - Iterates over all n elements.
   * @SpaceComplexity O(n) - Creates a new array of size n.
   */
  toArray(): T[] {
    return [...this];
  }

  /**
   * Returns a string representation of the deque.
   * @returns {string} A string representing the deque's content.
   * @TimeComplexity O(n) - Iterates over all n elements.
   * @SpaceComplexity O(n) - Creates a new string.
   */
  toString(): string {
    if (this.isEmpty()) return '[EMPTY]';

    let current = this.head;
    let s = '[FRONT] ';

    while (current !== null) {
      s += `${current.value}`;

      if (current.next !== null) {
        s += ' <-> ';
      }

      current = current.next;
    }

    s += ' [REAR]';

    return s;
  }

  /**
   * Rotates the deque n steps. Positive n rotates right (rear to front),
   * negative n rotates left (front to rear).
   * @param {number} n Number of steps to rotate.
   * @TimeComplexity O(min(n, count)) - At most n operations.
   * @SpaceComplexity O(1) - No extra space used.
   */
  rotate(n: number = 1): void {
    if (this.isEmpty() || this.count === 1) return;

    // Normalize n to be within [-count, count]
    n = n % this.count;

    if (n === 0) return;

    if (n > 0) {
      // Rotate right: move rear to front
      for (let i = 0; i < n; i++) {
        const item = this.removeRear();

        if (item !== undefined) {
          this.addFront(item);
        }
      }
    } else {
      // Rotate left: move front to rear
      for (let i = 0; i < Math.abs(n); i++) {
        const item = this.removeFront();

        if (item !== undefined) {
          this.addRear(item);
        }
      }
    }
  }

  /**
   * Implements the Iterable protocol. Elements are yielded from front to rear.
   * @yields {T} The value of the next node.
   * @TimeComplexity O(n) - For a full iteration over n elements.
   * @SpaceComplexity O(1) - Iteration uses constant extra space.
   */
  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;

    while (current !== null) {
      yield current.value;
      current = current.next;
    }
  }

  /**
   * Reverse iterator - yields elements from rear to front.
   * Showcases the advantage of a doubly-linked list.
   * @yields {T} The value of the previous node.
   * @TimeComplexity O(n) - For a full iteration over n elements.
   * @SpaceComplexity O(1) - Iteration uses constant extra space.
   */
  reverseIterator(): Iterable<T> {
    return {
      [Symbol.iterator]: (): Iterator<T> => {
        let current = this.tail;

        return {
          next: () => {
            if (current !== null) {
              const value = current.value;
              current = current.prev;
              return { value, done: false };
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return { value: undefined as any, done: true };
          },
        };
      },
    };
  }
}

export default Deque;
