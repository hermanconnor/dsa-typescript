import StackNode from './StackNode';

class StackList<T> {
  private top: StackNode<T> | null;
  private length: number;

  constructor() {
    this.top = null;
    this.length = 0;
  }

  push(value: T): void {
    const newNode = new StackNode(value);

    newNode.next = this.top;
    this.top = newNode;
    this.length++;
  }

  clear(): void {
    this.top = null;
    this.length = 0;
  }

  get size(): number {
    return this.length;
  }

  get isEmpty(): boolean {
    return this.length === 0;
  }
}

export default StackList;
