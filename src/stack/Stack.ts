class Stack<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  /**
   * Pushes a new item onto the top of the stack.
   * @param item The item to be pushed onto the stack.
   */
  public push(item: T): void {
    this.items.push(item);
  }

  /**
   * Removes and returns the item at the top of the stack
   * @returns The item removed from the top of the stack,
   *          or undefined if the stack is empty.
   */
  public pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * Returns the item at the top of the stack without removing it.
   * @returns The item at the top of the stack,
   *          or undefined if the stack is empty.
   */
  public peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  /**
   * Returns the number of items currently in the stack.
   * @returns The number of items in the stack.
   */
  public size(): number {
    return this.items.length;
  }

  /**
   * Checks if the stack is empty.
   * @returns True if the stack is empty, false otherwise.
   */
  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Removes all items from the stack.
   */
  public clear(): void {
    this.items = [];
  }
}

export default Stack;
