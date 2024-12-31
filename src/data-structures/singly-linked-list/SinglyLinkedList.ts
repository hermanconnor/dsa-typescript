import ListNode from './ListNode';

class SinglyLinkedList<T> {
  private head: ListNode<T> | null;
  private tail: ListNode<T> | null;
  private length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  unshift(value: T): void {
    const newNode = new ListNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this.length++;
  }

  push(value: T): void {
    const newNode = new ListNode(value);

    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  shift(): ListNode<T> | null {
    if (!this.head) return null;

    const removedNode = this.head;
    this.head = this.head.next;
    removedNode.next = null;

    if (!this.head) {
      this.tail = null;
    }

    this.length--;

    return removedNode;
  }

  pop(): ListNode<T> | null {
    if (!this.head) return null;

    if (this.head === this.tail) {
      const removedNode = this.head;
      this.head = null;
      this.tail = null;
      this.length--;
      return removedNode;
    }

    let current = this.head;
    while (current.next && current.next !== this.tail) {
      current = current.next;
    }

    const removedNode = this.tail;
    this.tail = current;
    this.tail.next = null;
    this.length--;

    return removedNode;
  }

  insertNodeAt(index: number, value: T): boolean {
    if (index < 0 || index > this.length) return false;

    if (index === 0) {
      this.unshift(value);
      return true;
    }

    if (index === this.length) {
      this.push(value);
      return true;
    }

    const newNode = new ListNode(value);
    const prevNode = this.getNodeAt(index - 1);

    if (!prevNode) return false;

    prevNode.next = newNode;
    newNode.next = prevNode.next;
    this.length++;
    return true;
  }

  removeNodeAt(index: number): ListNode<T> | null {
    if (index < 0 || index >= this.length) return null;
    if (index === 0) return this.shift();
    if (index === this.length - 1) return this.pop();

    const prevNode = this.getNodeAt(index - 1);

    if (prevNode && prevNode.next) {
      const removedNode = prevNode.next;

      prevNode.next = removedNode.next;
      removedNode.next = null;
      this.length--;
      return removedNode;
    }

    return null;
  }

  setNodeAt(index: number, value: T): boolean {
    const node = this.getNodeAt(index);

    if (!node) return false;

    node.value = value;
    return true;
  }

  getNodeAt(index: number): ListNode<T> | null {
    if (index < 0 || index >= this.length) return null;
    if (index === 0) return this.getHead();
    if (index === this.length - 1) return this.getTail();

    let current = this.head;

    for (let i = 0; i < index && current; i++) {
      current = current.next;
    }

    return current;
  }

  getHead(): ListNode<T> | null {
    return this.head;
  }

  getTail(): ListNode<T> | null {
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

export default SinglyLinkedList;
