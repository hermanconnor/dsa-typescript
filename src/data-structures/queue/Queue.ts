import QueNode from './QueNode';

class Queue<T> {
  private head: QueNode<T> | null;
  private tail: QueNode<T> | null;
  private length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  enqueue(value: T): void {
    const newNode = new QueNode(value);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      if (this.tail) {
        this.tail.next = newNode;
      }

      this.tail = newNode;
    }

    this.length++;
  }

  getHead() {
    return this.head;
  }

  getTail() {
    return this.tail;
  }

  size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }
}

export default Queue;
