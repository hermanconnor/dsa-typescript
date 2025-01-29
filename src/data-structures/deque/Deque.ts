import DequeNode from './DequeNode';

class Deque<T> {
  private head: DequeNode<T> | null;
  private tail: DequeNode<T> | null;
  private length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  addFirst(value: T): void {
    const newNode = new DequeNode(value);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;

      if (this.head) {
        this.head.prev = newNode;
      }

      this.head = newNode;
    }

    this.length++;
  }

  peekFirst(): T | null {
    return this.head?.value ?? null;
  }

  size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }
}

export default Deque;
