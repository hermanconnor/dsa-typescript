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

    const removedNode = this.tail;

    if (removedNode) {
      this.tail = removedNode.prev;

      if (this.tail) {
        this.tail.next = null;
      } else {
        this.head = null;
      }
    }

    this.length--;

    return removedNode ? removedNode.value : null;
  }

  unshift(value: T): void {
    const newNode = new DLLNode(value);

    if (this.length === 0) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head!.prev = newNode;
      this.head = newNode;
    }

    this.length++;
  }

  shift(): T | null {
    if (!this.head) return null;

    const removedNode = this.head;
    this.head = this.head.next;

    if (this.head) {
      this.head.prev = null;
    }

    removedNode.next = null;

    if (!this.head) {
      this.tail = null;
    }

    this.length--;

    return removedNode.value;
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

    const newNode = new DLLNode(value);
    const prevNode = this.getNodeAt(index - 1);

    if (!prevNode) return false;

    const afterNode = prevNode.next;

    prevNode.next = newNode;
    newNode.prev = prevNode;
    newNode.next = afterNode;

    if (afterNode) {
      afterNode.prev = newNode;
    }

    this.length++;
    return true;
  }

  removeNodeAt(index: number): T | null {
    if (index < 0 || index >= this.length) return null;
    if (index === 0) return this.shift();
    if (index === this.length - 1) return this.pop();

    const nodeToRemove = this.getNodeAt(index);

    if (!nodeToRemove) return null;

    const before = nodeToRemove.prev;
    const after = nodeToRemove.next;

    if (before) {
      before.next = after;
    }

    if (after) {
      after.prev = before;
    }

    nodeToRemove.next = null;
    nodeToRemove.prev = null;

    this.length--;
    return nodeToRemove.value;
  }

  setNodeValueAt(index: number, value: T): boolean {
    const node = this.getNodeAt(index);

    if (node) {
      node.value = value;
      return true;
    }

    return false;
  }

  getNodeAt(index: number): DLLNode<T> | null {
    if (index < 0 || index >= this.length) return null;
    if (index === 0) return this.getHead();
    if (index === this.length - 1) return this.getTail();

    let temp: DLLNode<T> | null;

    if (index < this.length / 2) {
      temp = this.head;

      for (let i = 0; i < index; i++) {
        if (temp) {
          temp = temp.next;
        }
      }
    } else {
      temp = this.tail;

      for (let i = this.length - 1; i > index; i--) {
        if (temp) {
          temp = temp.prev;
        }
      }
    }

    return temp;
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
