class DequeNode<T> {
  value: T;
  prev: DequeNode<T> | null;
  next: DequeNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export default DequeNode;
