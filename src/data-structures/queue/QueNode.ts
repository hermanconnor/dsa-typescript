class QueNode<T> {
  value: T;
  next: QueNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export default QueNode;
