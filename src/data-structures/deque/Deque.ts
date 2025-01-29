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

  addLast(value: T): void {
    const newNode = new DequeNode(value);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;

      if (this.tail) {
        this.tail.next = newNode;
      }

      this.tail = newNode;
    }

    this.length++;
  }

  removeFirst(): T | null {
    if (this.isEmpty()) return null;

    const removedValue = this.head?.value ?? null;

    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } else {
      if (this.head) {
        this.head = this.head.next;

        if (this.head) {
          this.head.prev = null;
        }
      }
    }

    this.length--;

    return removedValue;
  }

  removeLast(): T | null {
    if (this.isEmpty()) return null;

    const removedValue = this.tail?.value ?? null;

    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } else {
      if (this.tail) {
        this.tail = this.tail.prev;

        if (this.tail) {
          this.tail.next = null;
        }
      }
    }

    this.length--;

    return removedValue;
  }

  peekFirst(): T | null {
    return this.head?.value ?? null;
  }

  peekLast(): T | null {
    return this.tail?.value ?? null;
  }

  size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }
}

export default Deque;
