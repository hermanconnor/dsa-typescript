class Stack<T> {
  private items: T[];

  constructor() {
    this.items = [];
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
