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

  size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }
}

export default Deque;
