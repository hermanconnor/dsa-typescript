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

  deleteHead(): void {
    if (!this.head) return;

    this.head = this.head.next;

    if (!this.head) {
      this.tail = null;
    }

    this.length--;
  }

  deleteTail(): void {
    if (!this.head) return;

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      return;
    }

    let current = this.head;
    while (current.next && current.next.next) {
      current = current.next;
    }

    current.next = null;
    this.tail = current;
    this.length--;
  }

  deleteAt(index: number): boolean {
    if (index < 0 || index >= this.length) return false;

    if (index === 0) {
      this.deleteHead();
      return true;
    }

    if (index === this.length - 1) {
      this.deleteTail();
      return true;
    }

    const prevNode = this.getNodeAt(index - 1);

    if (prevNode && prevNode.next) {
      const nodeToDelete = prevNode.next;
      prevNode.next = nodeToDelete.next;

      this.length--;
      return true;
    }

    return false;
  }

  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  reverse(): void {
    if (!this.head || !this.head.next) return;

    let prev: ListNode<T> | null = null;
    let next: ListNode<T> | null = null;
    let current: ListNode<T> | null = this.head;
    this.tail = current;

    while (current) {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }

    this.head = prev;
  }

  contains(value: T): boolean {
    let current = this.head;

    while (current) {
      if (current.value === value) {
        return true;
      }

      current = current.next;
    }

    return false;
  }

  indexOf(value: T): number {
    if (this.isEmpty) return -1;

    let current = this.head;
    let index = 0;

    while (current) {
      if (current.value === value) {
        return index;
      }

      index++;
      current = current.next;
    }

    return -1;
  }

  get isEmpty(): boolean {
    return this.length === 0;
  }

  get size(): number {
    return this.length;
  }

  printList(): void {
    if (this.isEmpty) {
      console.log('');
      return;
    }

    const list: (T | string)[] = [];

    let current = this.head;

    while (current) {
      list.push(current.value);
      current = current.next;
    }

    list.push('null');
    console.log(list.join(' → '));
  }
}

export default SinglyLinkedList;
