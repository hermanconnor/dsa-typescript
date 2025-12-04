import MinHeap from '../heap/MinHeap';

/**
 * Priority Queue item wrapper with tie-breaking support.
 * The internal heap stores these wrappers, not the raw value T.
 */
interface PriorityQueueItem<T> {
  value: T;
  priority: number;
  counter: number; // For FIFO tie-breaking (smaller counter = arrived earlier)
}

/**
 * Enhanced Priority Queue with FIFO tie-breaking and value tracking.
 * Lower priority numbers = higher priority (processed first).
 *
 * This implementation uses a MinHeap (with index tracking) for ordering and a Map
 * (`entryFinder`) for O(1) existence checks and retrieval of the internal queue item wrapper.
 * This structure enables optimal O(log N) performance for all major operations.
 */
class PriorityQueue<T> {
  private heap: MinHeap<PriorityQueueItem<T>>;
  // Map for O(1) lookup of a value's corresponding PriorityQueueItem object
  private entryFinder: Map<T, PriorityQueueItem<T>>;
  // Counter for guaranteed FIFO ordering in case of equal priority
  private counter: number;

  /**
   * Creates a new Priority Queue.
   * Time Complexity: O(1) for initialization, or O(N) if initialized with items (due to buildFromArray).
   * @param items Optional array of items to initialize with.
   * Can be T[] (uses priority 0) or Array<{value: T, priority: number}>.
   */
  constructor(items?: T[] | Array<{ value: T; priority: number }>) {
    // The heap's comparison function prioritizes lower 'priority' first.
    // If priorities are equal, it uses the 'counter' for FIFO tie-breaking.
    this.heap = new MinHeap<PriorityQueueItem<T>>((a, b) => {
      const priorityDiff = a.priority - b.priority;
      if (priorityDiff !== 0) return priorityDiff;
      return a.counter - b.counter; // FIFO: smaller counter is older, thus higher priority
    });

    this.entryFinder = new Map();
    this.counter = 0;

    if (items && items.length > 0) {
      this.buildFromArray(items);
    }
  }

  /**
   * Efficiently builds the queue from an array.
   * Time Complexity: O(N) where N is the number of items.
   * @param items The array of elements or priority objects to initialize the queue with.
   */
  private buildFromArray(
    items: T[] | Array<{ value: T; priority: number }>,
  ): void {
    const firstItem = items[0];
    const hasPriority =
      firstItem && typeof firstItem === 'object' && 'priority' in firstItem;

    const queueItems: PriorityQueueItem<T>[] = items.map((item) => {
      let value: T;
      let priority: number;

      if (hasPriority) {
        const priorityItem = item as { value: T; priority: number };
        value = priorityItem.value;
        priority = priorityItem.priority;
      } else {
        value = item as T;
        priority = 0; // Default priority
      }

      const queueItem: PriorityQueueItem<T> = {
        value,
        priority,
        counter: this.counter++,
      };

      // Also track in the entryFinder
      this.entryFinder.set(value, queueItem);
      return queueItem;
    });

    // O(N) operation to build the heap efficiently
    this.heap.buildHeap(queueItems);
  }

  /**
   * Adds an item to the queue with a given priority.
   * If the item already exists, its old entry is removed and the new one is added (effectively an update).
   * Time Complexity: O(log N) in all cases (insertion or update).
   * @param value - The value to enqueue.
   * @param priority - The priority of the value (lower number = higher priority).
   */
  public enqueue(value: T, priority: number): void {
    // O(1) check
    if (this.entryFinder.has(value)) {
      // O(log N) removal using the optimized heap
      this.remove(value);
    }

    const item: PriorityQueueItem<T> = {
      value,
      priority,
      counter: this.counter++,
    };

    // O(log N) insertion
    this.heap.insert(item);
    // O(1) map update
    this.entryFinder.set(value, item);
  }

  /**
   * Removes and returns the highest priority item.
   * Time Complexity: O(log N), dominated by the `extractMin` operation.
   * @returns The highest priority value, or undefined if the queue is empty.
   */
  public dequeue(): T | undefined {
    // O(log N)
    const item = this.heap.extractMin();
    if (item) {
      // O(1)
      this.entryFinder.delete(item.value);
      return item.value;
    }
    return undefined;
  }

  /**
   * Returns the highest priority item without removing it.
   * Time Complexity: O(1).
   * @returns The highest priority value, or undefined if the queue is empty.
   */
  public peek(): T | undefined {
    // O(1)
    const item = this.heap.peek();
    return item?.value;
  }

  /**
   * Returns the priority of the next item to be dequeued.
   * Time Complexity: O(1).
   * @returns The priority number, or undefined if the queue is empty.
   */
  public peekPriority(): number | undefined {
    // O(1)
    const item = this.heap.peek();
    return item?.priority;
  }

  /**
   * Checks if a specific value exists in the queue.
   * Time Complexity: O(1).
   * @param value - The value to check for existence.
   * @returns True if the value is in the queue, false otherwise.
   */
  public contains(value: T): boolean {
    // O(1)
    return this.entryFinder.has(value);
  }

  /**
   * Gets the priority of a specific item.
   * Time Complexity: O(1).
   * @param value - The value to find the priority for.
   * @returns The priority number, or undefined if the item is not found.
   */
  public getPriority(value: T): number | undefined {
    // O(1)
    return this.entryFinder.get(value)?.priority;
  }

  /**
   * Returns the number of items in the queue.
   * Time Complexity: O(1).
   * @returns The current size of the queue.
   */
  public size(): number {
    return this.heap.size();
  }

  /**
   * Checks if the queue is empty.
   * Time Complexity: O(1).
   * @returns True if the queue is empty, false otherwise.
   */
  public isEmpty(): boolean {
    return this.heap.isEmpty();
  }

  /**
   * Removes all items from the queue.
   * Time Complexity: O(1).
   */
  public clear(): void {
    this.heap.clear();
    this.entryFinder.clear();
    this.counter = 0;
  }

  /**
   * Updates the priority of an item.
   * This is achieved by removing the old entry and inserting a new one with the updated priority.
   * Time Complexity: O(log N), due to O(1) map lookup followed by O(log N) heap remove and insert operations.
   * @param value - The value whose priority is to be updated.
   * @param newPriority - The new priority number.
   * @returns True if the item was found and updated, false otherwise.
   */
  public updatePriority(value: T, newPriority: number): boolean {
    // O(1) lookup
    const oldItem = this.entryFinder.get(value);
    if (!oldItem) return false;

    // O(log N) removal using the item object reference
    this.heap.remove(oldItem);

    // O(1) map cleanup
    this.entryFinder.delete(value);

    // Create new item with new priority and fresh counter for correct tie-breaking
    const newItem: PriorityQueueItem<T> = {
      value,
      priority: newPriority,
      counter: this.counter++,
    };

    // O(log N) insertion
    this.heap.insert(newItem);
    // O(1) map update
    this.entryFinder.set(value, newItem);
    return true;
  }

  /**
   * Removes a specific item from the queue.
   * Time Complexity: O(log N), due to O(1) map lookup followed by the optimized O(log N) heap removal.
   * @param value - The value to be removed.
   * @returns True if the item was found and removed, false otherwise.
   */
  public remove(value: T): boolean {
    // O(1) lookup
    const item = this.entryFinder.get(value);
    if (!item) return false;

    // O(log N) removal using the item object reference
    const removed = this.heap.remove(item);

    if (removed) {
      // O(1) map removal
      this.entryFinder.delete(value);
    }
    return removed;
  }

  /**
   * Returns all values in the queue as an array (without modifying the queue order).
   * Time Complexity: O(N).
   * @returns A new array containing only the queue item values.
   */
  public toArray(): readonly T[] {
    // O(N)
    return this.heap.toArray().map((item) => item.value);
  }

  /**
   * Iterator that yields items in priority order (highest priority first).
   * Note: This operation drains (empties) the queue.
   * Time Complexity: O(N log N) in total, as it performs N calls to `dequeue`, each being O(log N).
   * @returns An iterator for the queue values.
   */
  public *[Symbol.iterator](): Iterator<T> {
    while (!this.isEmpty()) {
      yield this.dequeue()!;
    }
  }
}

export default PriorityQueue;
