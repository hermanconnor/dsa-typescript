import DLLNode from './DLLNode';

class DoublyLinkedList<T> {
  private head: DLLNode<T> | null;
  private tail: DLLNode<T> | null;
  private length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  getHead(): DLLNode<T> | null {
    return this.head;
  }

  getTail(): DLLNode<T> | null {
    return this.tail;
  }

  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  get isEmpty(): boolean {
    return this.length === 0;
  }

  get size(): number {
    return this.length;
  }
}

export default DoublyLinkedList;
