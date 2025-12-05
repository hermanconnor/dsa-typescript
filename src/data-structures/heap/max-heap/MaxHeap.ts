class MaxHeap<T> {
  private heap: T[] = [];
  private readonly compare: (a: T, b: T) => number;
  // Map: Stores the index of an element in the heap array for O(1) lookup.
  // This enables O(log N) removal and update operations.
  private valueToHeapIndex: Map<T, number> = new Map();

  /**
   * Constructs a MaxHeap.
   * Time Complexity: O(1)
   * @param compare - An optional comparison function that defines the order of elements.
   * It should return a negative number if a < b, 0 if a === b, and a positive number if a > b.
   * Elements are ordered such that the largest element is at the root.
   */
  constructor(compare?: (a: T, b: T) => number) {
    this.compare =
      compare ||
      ((a, b) => {
        if (a === b) return 0;
        if (typeof a === 'number' && typeof b === 'number') {
          return a - b;
        }
        if (typeof a === 'string' && typeof b === 'string') {
          return a.localeCompare(b);
        }
        // Fallback for objects with natural ordering
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
  }

  /**
   * Returns the number of elements in the heap.
   * Time Complexity: O(1)
   * @returns The number of elements (size) in the heap.
   */
  public size(): number {
    return this.heap.length;
  }

  /**
   * Checks if the heap is empty.
   * Time Complexity: O(1)
   * @returns True if the heap contains no elements, false otherwise.
   */
  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * Returns the maximum element (the root) without removing it.
   * Time Complexity: O(1)
   * @returns The maximum element, or undefined if the heap is empty.
   */
  public peekMax(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.heap[0];
  }

  /**
   * Inserts a new element into the heap.
   * Time Complexity: O(log N).
   * @param value - The element to insert.
   */
  public insert(value: T): void {
    this.heap.push(value);
    const newIdx = this.heap.length - 1;
    // O(1): Update the index map for the new value
    this.valueToHeapIndex.set(value, newIdx);
    // O(log N): Heapify up to restore the MaxHeap property
    this.heapifyUp(newIdx);
  }

  /**
   * Removes and returns the maximum element (the root).
   * Time Complexity: O(log N).
   * @returns The maximum element, or undefined if the heap is empty.
   */
  public extractMax(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const max = this.heap[0];

    if (this.size() === 1) {
      this.heap.pop();
      // O(1): Remove index tracking for the extracted element
      this.valueToHeapIndex.delete(max);
      return max;
    }

    // Replace the root with the last element
    const last = this.heap.pop()!;
    this.heap[0] = last;

    // O(1): Update the index map for the new root element
    this.valueToHeapIndex.set(last, 0);
    // O(1): Remove index tracking for the extracted element
    this.valueToHeapIndex.delete(max);

    // O(log N): Restore the MaxHeap property
    this.heapifyDown(0);
    return max;
  }

  /**
   * Removes a specific element from the heap.
   * Time Complexity: O(log N), due to O(1) index lookup and O(log N) heap operations.
   * @param value - The element to remove (must be the same object reference used for insertion).
   * @returns True if the element was found and removed, false otherwise.
   */
  public remove(value: T): boolean {
    // O(1): Find the index using the map
    const idx = this.valueToHeapIndex.get(value);
    if (idx === undefined) return false;

    // Handle case where element is already the last element
    if (idx === this.heap.length - 1) {
      this.heap.pop();
      this.valueToHeapIndex.delete(value); // O(1) map cleanup
      return true;
    }

    // Replace the element to be removed with the last element
    const last = this.heap.pop()!;
    this.heap[idx] = last;

    // O(1): Update the index map for the element that moved
    this.valueToHeapIndex.set(last, idx);
    // O(1): Remove index tracking for the element that was removed
    this.valueToHeapIndex.delete(value);

    // O(log N): Restore heap property. One of these will run.
    this.heapifyDown(idx);
    this.heapifyUp(idx);
    return true;
  }

  /**
   * Updates the value (priority) of an element.
   * Time Complexity: O(log N), due to O(1) index lookup and O(log N) heap operations.
   * @param oldValue - The current value (object reference) of the element to update.
   * @param newValue - The new value (priority) for the element.
   * @returns True if the element was found and updated, false otherwise.
   */
  public updatePriority(oldValue: T, newValue: T): boolean {
    // O(1): Find the index of the old value
    const idx = this.valueToHeapIndex.get(oldValue);
    if (idx === undefined) return false;

    // If the value is the same, no action is needed
    if (this.compare(oldValue, newValue) === 0) return true;

    // Remove old map entry and add new map entry
    this.valueToHeapIndex.delete(oldValue);
    this.valueToHeapIndex.set(newValue, idx);

    this.heap[idx] = newValue;

    // O(log N): Restore heap property. One of these will run.
    // If the new value is larger, it moves up. If smaller, it moves down.
    this.heapifyDown(idx);
    this.heapifyUp(idx);
    return true;
  }

  /**
   * Builds a heap from an array of elements.
   * Time Complexity: O(N).
   * @param arr - The array of elements to build the heap from.
   */
  public buildHeap(arr: T[]): void {
    this.heap = [...arr];
    this.valueToHeapIndex.clear(); // O(1) map clear

    // O(N): Build the index map
    this.heap.forEach((value, index) => {
      this.valueToHeapIndex.set(value, index);
    });

    const n = this.heap.length;
    // O(N): Build the heap structure
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapifyDown(i);
    }
  }

  /**
   * Clears all elements from the heap.
   * Time Complexity: O(1).
   */
  public clear(): void {
    this.heap = [];
    this.valueToHeapIndex.clear();
  }

  /**
   * Returns a shallow copy of the heap array.
   * Time Complexity: O(N).
   * @returns A copy of the internal array.
   */
  public toArray(): readonly T[] {
    return [...this.heap];
  }

  /**
   * Validates the MaxHeap property.
   * Time Complexity: O(N).
   * @returns True if the heap property holds for all nodes, false otherwise.
   */
  public isValid(): boolean {
    for (let i = 0; i < this.heap.length; i++) {
      const left = this.getLeftChildIndex(i);
      const right = this.getRightChildIndex(i);

      // Check if parent is less than left child
      if (
        left < this.heap.length &&
        this.compare(this.heap[i], this.heap[left]) < 0
      ) {
        return false;
      }
      // Check if parent is less than right child
      if (
        right < this.heap.length &&
        this.compare(this.heap[i], this.heap[right]) < 0
      ) {
        return false;
      }
    }
    return true;
  }

  /**
   * Iterator that yields elements in priority order (drains the heap).
   * Time Complexity: O(N log N) in total.
   * @returns An iterator for the heap elements.
   */
  public *[Symbol.iterator](): Iterator<T> {
    while (!this.isEmpty()) {
      yield this.extractMax()!;
    }
  }

  /**
   * Restores the MaxHeap property by moving an element up the heap.
   * Time Complexity: O(log N).
   * @param idx - The index of the element to be moved up.
   */
  private heapifyUp(idx: number): void {
    while (idx > 0) {
      const parentIdx = this.getParentIndex(idx);
      // Check if child (idx) is GREATER than parent (parentIdx). If not, heap property is satisfied.
      if (this.compare(this.heap[idx], this.heap[parentIdx]) <= 0) {
        break;
      }
      this.swap(idx, parentIdx); // O(1) swap including index map update
      idx = parentIdx;
    }
  }

  /**
   * Restores the MaxHeap property by moving an element down the heap.
   * Time Complexity: O(log N).
   * @param idx - The index of the element to be moved down.
   */
  private heapifyDown(idx: number): void {
    const n = this.heap.length;
    while (true) {
      let largest = idx;
      const leftIdx = this.getLeftChildIndex(idx);
      const rightIdx = this.getRightChildIndex(idx);

      // Find the LARGEST among parent, left, and right

      // If left child exists AND left child is LARGER than the current largest
      if (
        leftIdx < n &&
        this.compare(this.heap[leftIdx], this.heap[largest]) > 0
      ) {
        largest = leftIdx;
      }

      // If right child exists AND right child is LARGER than the current largest
      if (
        rightIdx < n &&
        this.compare(this.heap[rightIdx], this.heap[largest]) > 0
      ) {
        largest = rightIdx;
      }

      if (largest === idx) {
        break; // Heap property satisfied
      }

      this.swap(idx, largest); // O(1) swap including index map update
      idx = largest;
    }
  }

  /**
   * Swaps two elements in the heap array and updates their indices in the map.
   * Time Complexity: O(1).
   * @param i - The index of the first element.
   * @param j - The index of the second element.
   */
  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;

    // O(1): Update indices in the map
    this.valueToHeapIndex.set(this.heap[i], i);
    this.valueToHeapIndex.set(this.heap[j], j);
  }

  /**
   * Calculates the parent index for a given node index.
   * Time Complexity: O(1).
   * @param idx - The index of the child node.
   * @returns The index of the parent node.
   */
  private getParentIndex(idx: number): number {
    return Math.floor((idx - 1) / 2);
  }

  /**
   * Calculates the left child index for a given node index.
   * Time Complexity: O(1).
   * @param idx - The index of the parent node.
   * @returns The index of the left child.
   */
  private getLeftChildIndex(idx: number): number {
    return 2 * idx + 1;
  }

  /**
   * Calculates the right child index for a given node index.
   * Time Complexity: O(1).
   * @param idx - The index of the parent node.
   * @returns The index of the right child.
   */
  private getRightChildIndex(idx: number): number {
    return 2 * idx + 2;
  }
}

export default MaxHeap;
