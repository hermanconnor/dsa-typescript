/**
 * A dynamic array implementation that automatically resizes when needed.
 * Provides O(1) amortized push/pop and automatic shrinking to save memory.
 *
 * @template T The type of elements stored in the array
 *
 * @example
 * const arr = new DynamicArray<number>(4);
 * arr.push(1);
 * arr.push(2);
 * console.log(arr.get(0)); // 1
 * console.log(arr.length); // 2
 */
class DynamicArray<T> {
  private items: (T | undefined)[];
  private count: number;
  private capacity: number;
  private readonly MIN_CAPACITY: number;
  private readonly SHRINK_FACTOR: number = 4;

  /**
   * Creates a new DynamicArray with the specified initial capacity.
   *
   * @param {number} [initialCapacity=4] - The initial capacity (minimum 1)
   *
   * @timeComplexity O(n) where n is initialCapacity
   * @spaceComplexity O(n) where n is initialCapacity
   */
  constructor(initialCapacity: number = 4) {
    this.MIN_CAPACITY = Math.max(1, initialCapacity);
    this.capacity = this.MIN_CAPACITY;
    this.items = new Array<T | undefined>(this.capacity);
    this.count = 0;
  }

  /**
   * Returns the number of elements currently in the array.
   *
   * @returns {number} The number of elements
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  get length(): number {
    return this.count;
  }

  /**
   * Returns the current capacity of the underlying array.
   *
   * @returns {number} The current capacity
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  get currentCapacity(): number {
    return this.capacity;
  }

  /**
   * Adds an item to the end of the array.
   * Automatically doubles capacity when full.
   *
   * @param {T} item - The item to add
   *
   * @timeComplexity O(1) amortized, O(n) worst case when resizing
   * @spaceComplexity O(1) amortized
   */
  push(item: T): void {
    if (this.count === this.capacity) {
      this.resize(this.capacity * 2);
    }

    this.items[this.count] = item;
    this.count++;
  }

  /**
   * Removes and returns the last item from the array.
   * Automatically shrinks capacity when utilization is low.
   *
   * @returns {T} The removed item
   * @throws {Error} If the array is empty
   *
   * @timeComplexity O(1) amortized
   * @spaceComplexity O(1) amortized
   */
  pop(): T {
    if (this.count === 0) {
      throw new Error('Cannot pop from empty array');
    }

    const lastIndex = this.count - 1;
    const item = this.items[lastIndex] as T;

    this.count--;
    this.items[lastIndex] = undefined;

    if (
      this.capacity > this.MIN_CAPACITY &&
      this.count * this.SHRINK_FACTOR <= this.capacity
    ) {
      const newCapacity = Math.max(
        this.MIN_CAPACITY,
        Math.ceil(this.capacity / 2),
      );

      this.resize(newCapacity);
    }

    return item;
  }
  /**
   * Gets the element at the specified index.
   *
   * @param {number} index - The index to retrieve
   * @returns {T} The element at the index
   * @throws {Error} If index is out of bounds
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  get(index: number): T {
    if (index < 0 || index >= this.count) {
      throw new RangeError(
        `Index out of bounds: Index ${index} for length ${this.count}`,
      );
    }

    return this.items[index] as T;
  }

  /**
   * Sets the element at the specified index.
   *
   * @param {number} index - The index to set
   * @param {T} item - The item to set
   * @throws {Error} If index is out of bounds
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  set(index: number, item: T): void {
    if (index < 0 || index >= this.count) {
      throw new RangeError(
        `Index out of bounds: Index ${index} for length ${this.count}`,
      );
    }

    this.items[index] = item;
  }

  /**
   * Removes the element at the specified index and shifts remaining elements left.
   * Automatically shrinks capacity when utilization is low.
   *
   * @param {number} index - The index to remove
   * @returns {T} The removed item
   * @throws {Error} If index is out of bounds
   *
   * @timeComplexity O(n) due to shifting elements
   * @spaceComplexity O(1) amortized
   */
  removeAt(index: number): T {
    if (index < 0 || index >= this.count) {
      throw new RangeError(
        `Index out of bounds: Index ${index} for length ${this.count}`,
      );
    }
    // We are certain the item exists and is of type T
    const removedItem = this.items[index] as T;

    // Shift elements
    for (let i = index; i < this.count - 1; i++) {
      this.items[i] = this.items[i + 1];
    }

    this.count--;
    this.items[this.count] = undefined;

    // Shrinking logic
    if (
      this.capacity > this.MIN_CAPACITY &&
      this.count * this.SHRINK_FACTOR <= this.capacity
    ) {
      const newCapacity = Math.max(
        this.MIN_CAPACITY,
        Math.ceil(this.capacity / 2),
      );

      this.resize(newCapacity);
    }

    return removedItem;
  }

  /**
   * Inserts an item at the specified index, shifting elements right.
   *
   * @param {number} index - The index to insert at (0 to length inclusive)
   * @param {T} item - The item to insert
   * @throws {Error} If index is out of bounds
   *
   * @timeComplexity O(n) due to shifting elements
   * @spaceComplexity O(1) amortized
   */
  insert(index: number, item: T): void {
    if (index < 0 || index > this.count) {
      throw new RangeError(
        `Index out of bounds: Index ${index} for length ${this.count}`,
      );
    }

    if (this.count === this.capacity) {
      this.resize(this.capacity * 2);
    }

    for (let i = this.count; i > index; i--) {
      this.items[i] = this.items[i - 1];
    }

    this.items[index] = item;
    this.count++;
  }

  /**
   * Finds the first index of the specified item.
   *
   * @param {T} item - The item to find
   * @returns {number} The index of the item, or -1 if not found
   *
   * @timeComplexity O(n)
   * @spaceComplexity O(1)
   */
  indexOf(item: T): number {
    for (let i = 0; i < this.count; i++) {
      if (this.items[i] === item) {
        return i;
      }
    }

    return -1;
  }

  /**
   * Checks if the array contains the specified item.
   *
   * @param {T} item - The item to check for
   * @returns {boolean} True if the item exists
   *
   * @timeComplexity O(n)
   * @spaceComplexity O(1)
   */
  contains(item: T): boolean {
    return this.indexOf(item) !== -1;
  }

  /**
   * Removes all elements from the array and resets to minimum capacity.
   *
   * @timeComplexity O(1) - just resets references
   * @spaceComplexity O(n) where n is MIN_CAPACITY
   */
  clear(): void {
    this.items = new Array<T | undefined>(this.MIN_CAPACITY);
    this.capacity = this.MIN_CAPACITY;
    this.count = 0;
  }

  /**
   * Checks if the array is empty.
   *
   * @returns {boolean} True if the array has no elements
   *
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Adds an item to the beginning of the array, shifting all elements right.
   *
   * @param {T} item - The item to add
   *
   * @timeComplexity O(n) due to shifting all elements
   * @spaceComplexity O(1) amortized
   */
  unshift(item: T): void {
    this.insert(0, item);
  }

  /**
   * Removes and returns the first item from the array, shifting all elements left.
   *
   * @returns {T} The removed item
   * @throws {Error} If the array is empty
   *
   * @timeComplexity O(n) due to shifting all elements
   * @spaceComplexity O(1) amortized
   */
  shift(): T {
    if (this.count === 0) {
      throw new Error('Cannot shift from empty array');
    }

    return this.removeAt(0);
  }

  /**
   * Executes a callback function for each element in the array.
   *
   * @param {function(T, number): void} callback - Function to execute for each element
   *
   * @timeComplexity O(n)
   * @spaceComplexity O(1)
   *
   * @example
   * arr.forEach((item, index) => {
   *   console.log(`${index}: ${item}`);
   * });
   */
  forEach(callback: (item: T, index: number) => void): void {
    for (let i = 0; i < this.count; i++) {
      callback(this.items[i] as T, i); // Assert T for the callback
    }
  }

  /**
   * Creates a new array with the results of calling a callback on every element.
   *
   * @template U The type of elements in the resulting array
   * @param {function(T, number): U} callback - Function that produces an element of the new array
   * @returns {U[]} A new array with transformed elements
   *
   * @timeComplexity O(n)
   * @spaceComplexity O(n) for the new array
   *
   * @example
   * const doubled = arr.map(x => x * 2);
   */
  map<U>(callback: (item: T, index: number) => U): U[] {
    const result: U[] = [];

    for (let i = 0; i < this.count; i++) {
      result.push(callback(this.items[i] as T, i));
    }

    return result;
  }

  /**
   * Creates a new array with all elements that pass the test implemented by the callback.
   *
   * @param {function(T, number): boolean} callback - Function to test each element
   * @returns {T[]} A new array with elements that pass the test
   *
   * @timeComplexity O(n)
   * @spaceComplexity O(n) worst case if all elements pass
   *
   * @example
   * const evens = arr.filter(x => x % 2 === 0);
   */
  filter(callback: (item: T, index: number) => boolean): T[] {
    const result: T[] = [];

    for (let i = 0; i < this.count; i++) {
      const item = this.items[i] as T;

      if (callback(item, i)) {
        result.push(item);
      }
    }

    return result;
  }

  /**
   * Executes a reducer function on each element, resulting in a single output value.
   *
   * @template U The type of the accumulated value
   * @param {function(U, T, number): U} callback - Reducer function
   * @param {U} initialValue - Initial value for the accumulator
   * @returns {U} The accumulated result
   *
   * @timeComplexity O(n)
   * @spaceComplexity O(1)
   *
   * @example
   * const sum = arr.reduce((acc, x) => acc + x, 0);
   */
  reduce<U>(
    callback: (accumulator: U, item: T, index: number) => U,
    initialValue: U,
  ): U {
    let accumulator = initialValue;

    for (let i = 0; i < this.count; i++) {
      accumulator = callback(accumulator, this.items[i] as T, i);
    }

    return accumulator;
  }

  /**
   * Converts the dynamic array to a standard JavaScript array.
   *
   * @returns {T[]} A new array containing all elements
   *
   * @timeComplexity O(n)
   * @spaceComplexity O(n)
   */
  toArray(): T[] {
    return this.items.slice(0, this.count) as T[];
  }

  /**
   * Resizes the internal array to the specified capacity.
   * Private method used for automatic resizing.
   *
   * @param {number} newCapacity - The new capacity
   *
   * @timeComplexity O(n) where n is the number of elements to copy
   * @spaceComplexity O(newCapacity)
   */
  private resize(newCapacity: number): void {
    const newItems = new Array<T | undefined>(newCapacity);

    for (let i = 0; i < this.count; i++) {
      newItems[i] = this.items[i];
    }

    this.items = newItems;
    this.capacity = newCapacity;
  }

  /**
   * Returns an iterator for the array elements.
   * Allows use with for...of loops and spread operator.
   *
   * @yields {T} Each element in the array
   *
   * @timeComplexity O(1) per iteration, O(n) for full iteration
   * @spaceComplexity O(1)
   *
   * @example
   * const arr = new DynamicArray<number>();
   * arr.push(1);
   * arr.push(2);
   * for (const item of arr) {
   *   console.log(item);
   * }
   */
  *[Symbol.iterator](): Iterator<T> {
    for (let i = 0; i < this.count; i++) {
      yield this.items[i] as T;
    }
  }
}

export default DynamicArray;
