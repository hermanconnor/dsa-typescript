import QueNode from './QueNode';

class Queue<T> {
  private head: QueNode<T> | null;
  private tail: QueNode<T> | null;
  private length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
}

export default Queue;
