class Node<T> {
  value: T;
  next: Node<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

class StackList<T> {
  private top: Node<T> | null;
  private length: number;

  constructor() {
    this.top = null;
    this.length = 0;
  }

  push(value: T): void {
    const newNode = new Node(value);

    newNode.next = this.top;
    this.top = newNode;
    this.length++;
  }

  pop(): T | undefined {
    if (this.isEmpty()) {
      throw new Error('Stack is empty');
    }

    const poppedNode = this.top;

    this.top = this.top?.next ?? null;
    this.length--;

    return poppedNode?.value;
  }

  peek(): T | undefined {
    return this.top ? this.top.value : undefined;
  }

  clear(): void {
    this.top = null;
    this.length = 0;
  }

  size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }
}

export default StackList;
