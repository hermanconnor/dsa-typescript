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
}

export default StackList;
