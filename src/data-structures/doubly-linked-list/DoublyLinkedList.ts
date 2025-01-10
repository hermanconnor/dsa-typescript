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

  push(value: T): void {
    const newNode = new DLLNode(value);

    if (this.head) {
      this.tail!.next = newNode;
      newNode.prev = this.tail;
    } else {
      this.head = newNode;
    }

    this.tail = newNode;
    this.length++;
  }

  pop(): T | null {
    if (this.length === 0) return null;

    const removedNode = this.tail!;

    if (this.tail) {
      this.tail = this.tail.prev;

      if (this.tail) {
        this.tail.next = null;
      } else {
        this.head = null;
      }
    }

    this.length--;

    return removedNode ? removedNode.value : null;
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

  public printList(): void {
    if (this.isEmpty) {
      console.log('');
      return;
    }

    const values: (T | string)[] = [];

    let current = this.head;
    while (current) {
      values.push(current.value);
      current = current.next;
    }

    values.push('null');

    console.log(values.join(' → '));
  }
}

export default DoublyLinkedList;
