import { beforeEach, describe, expect, it } from 'vitest';
import MaxHeap from '../src/data-structures/heap/MaxHeap';

describe('MxHeap', () => {
  let heap: MaxHeap<number>;
  let stringHeap: MaxHeap<string>;
  let objectHeap: MaxHeap<{ price: number }>;

  beforeEach(() => {
    heap = new MaxHeap();
    stringHeap = new MaxHeap();
    objectHeap = new MaxHeap((a, b) => b.price - a.price);
  });

  it('should create an empty max heap', () => {
    expect(heap.isEmpty()).toBe(true);
  });

  it('insert should insert elements and maintain max-heap property (numbers)', () => {
    heap.insert(5);
    heap.insert(3);
    heap.insert(10);
    heap.insert(1);

    expect(heap.peek()).toBe(10);
  });

  it('insert should insert elements and maintain max-heap property (strings)', () => {
    stringHeap = new MaxHeap();

    stringHeap.insert('zebra');
    stringHeap.insert('apple');
    stringHeap.insert('cat');
    stringHeap.insert('dog');

    expect(stringHeap.peek()).toBe('zebra');
  });

  it('insert should insert elements and maintain max-heap property (objects)', () => {
    objectHeap.insert({ price: 0 });
    objectHeap.insert({ price: 1 });
    objectHeap.insert({ price: 2 });
    objectHeap.insert({ price: 3 });

    expect(objectHeap.peek()).toEqual({ price: 3 });
  });

  it('extractMax should return null when extracting from an empty heap', () => {
    expect(heap.extractMax()).toBeNull();
  });

  it('extractMax should extract the maximum element and maintain max-heap property (numbers)', () => {
    heap.insert(5);
    heap.insert(3);
    heap.insert(10);
    heap.insert(1);

    expect(heap.extractMax()).toBe(10);
    expect(heap.peek()).toBe(5);
  });

  it('should extract the maximum element and maintain max-heap property (strings)', () => {
    stringHeap.insert('zebra');
    stringHeap.insert('apple');
    stringHeap.insert('cat');
    stringHeap.insert('dog');

    expect(stringHeap.extractMax()).toBe('zebra');
    expect(stringHeap.peek()).toBe('dog');
  });

  it('should extract the maximum element and maintain max-heap property (objects)', () => {
    objectHeap.insert({ price: 3 });
    objectHeap.insert({ price: 1 });
    objectHeap.insert({ price: 2 });
    objectHeap.insert({ price: 0 });

    expect(objectHeap.extractMax()).toEqual({ price: 3 });
    expect(objectHeap.peek()).toEqual({ price: 2 });
  });

  it('should handle duplicate elements correctly', () => {
    heap.insert(5);
    heap.insert(3);
    heap.insert(5);
    heap.insert(1);

    expect(heap.extractMax()).toBe(5);
    expect(heap.extractMax()).toBe(5);
    expect(heap.extractMax()).toBe(3);
    expect(heap.extractMax()).toBe(1);
  });

  it('heapify should handle an empty array in heapify', () => {
    const array: number[] = [];

    heap.heapify(array);

    expect(heap.isEmpty()).toBe(true);
  });

  it('heapify should handle an empty array in heapify for strings', () => {
    const array: string[] = [];

    stringHeap.heapify(array);

    expect(heap.isEmpty()).toBe(true);
  });

  it('heapify should handle an empty array in heapify for objects', () => {
    const array: { price: number }[] = [];

    objectHeap.heapify(array);

    expect(objectHeap.isEmpty()).toBe(true);
  });

  it('heapify should heapify an array of numbers', () => {
    const array = [5, 2, 8, 1, 9, 4];

    heap.heapify(array);

    expect(heap.peek()).toBe(9);
    expect(heap.extractMax()).toBe(9);
    expect(heap.extractMax()).toBe(8);
  });

  it('heapify should heapify an array of strings', () => {
    const array = ['zebra', 'apple', 'cat', 'dog'];

    stringHeap.heapify(array);

    expect(stringHeap.peek()).toBe('zebra');
    expect(stringHeap.extractMax()).toBe('zebra');
    expect(stringHeap.extractMax()).toBe('dog');
  });

  it('heapify should heapify an array of objects', () => {
    const array = [{ price: 3 }, { price: 1 }, { price: 2 }];

    objectHeap.heapify(array);

    expect(objectHeap.peek()).toEqual({ price: 3 });
    expect(objectHeap.extractMax()).toEqual({ price: 3 });
    expect(objectHeap.extractMax()).toEqual({ price: 2 });
  });

  it('peek should return the maximum element without removing it (numbers)', () => {
    heap.insert(5);
    heap.insert(3);

    expect(heap.peek()).toBe(5);
    expect(heap.size()).toBe(2); // Peek should not modify the heap
  });

  it('peek should return the maximum element without removing it (strings)', () => {
    stringHeap.insert('mango');
    stringHeap.insert('apple');

    expect(stringHeap.peek()).toBe('mango');
    expect(stringHeap.size()).toBe(2);
  });

  it('peek should return the maximum element without removing it (objects)', () => {
    objectHeap.insert({ price: 3 });
    objectHeap.insert({ price: 1 });

    expect(objectHeap.peek()).toEqual({ price: 3 });
    expect(objectHeap.peek()).toEqual({ price: 3 });
  });
});
