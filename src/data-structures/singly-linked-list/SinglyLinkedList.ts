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

    newNode.next = this.head;
    this.head = newNode;

    if (!this.tail) {
      this.tail = newNode;
    }

    this.length++;
  }

  push(value: T): void {
    const newNode = new ListNode(value);

    if (this.tail) {
      this.tail.next = newNode;
    }

    this.tail = newNode;

    if (!this.head) {
      this.head = newNode;
    }

    this.length++;
  }
}

export default SinglyLinkedList;
