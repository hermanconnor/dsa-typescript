import { beforeEach, describe, expect, it } from 'vitest';
import MinHeap from '../src/data-structures/heap/MinHeap';

describe('MinHeap', () => {
  let heap: MinHeap<number>;
  let stringHeap: MinHeap<string>;
  let objectHeap: MinHeap<{ price: number }>;

  beforeEach(() => {
    heap = new MinHeap();
    stringHeap = new MinHeap();
    objectHeap = new MinHeap((a, b) => a.price - b.price);
  });

  it('should create an empty min heap', () => {
    expect(heap.isEmpty()).toBe(true);
  });

  it('insert should insert elements and maintain min-heap property (numbers)', () => {
    heap.insert(5);
    heap.insert(3);
    heap.insert(10);
    heap.insert(1);

    expect(heap.peek()).toBe(1);
  });

  it('insert should insert elements and maintain min-heap property (strings)', () => {
    stringHeap = new MinHeap();

    stringHeap.insert('zebra');
    stringHeap.insert('apple');
    stringHeap.insert('cat');
    stringHeap.insert('dog');

    expect(stringHeap.peek()).toBe('apple');
  });

  it('insert should insert elements and maintain min-heap property (objects)', () => {
    objectHeap.insert({ price: 3 });
    objectHeap.insert({ price: 1 });
    objectHeap.insert({ price: 2 });
    objectHeap.insert({ price: 0 });

    expect(objectHeap.peek()).toEqual({ price: 0 });
  });

  it('extractMin should return null when extracting from an empty heap', () => {
    expect(heap.extractMin()).toBeNull();
  });

  it('extractMin should extract the minimum element and maintain min-heap property (numbers)', () => {
    heap.insert(5);
    heap.insert(3);
    heap.insert(10);
    heap.insert(1);

    expect(heap.extractMin()).toBe(1);
    expect(heap.peek()).toBe(3);
  });

  it('should extract the minimum element and maintain min-heap property (strings)', () => {
    stringHeap.insert('zebra');
    stringHeap.insert('apple');
    stringHeap.insert('cat');
    stringHeap.insert('dog');

    expect(stringHeap.extractMin()).toBe('apple');
    expect(stringHeap.peek()).toBe('cat');
  });

  it('should extract the minimum element and maintain min-heap property (objects)', () => {
    objectHeap.insert({ price: 3 });
    objectHeap.insert({ price: 1 });
    objectHeap.insert({ price: 2 });
    objectHeap.insert({ price: 0 });

    expect(objectHeap.extractMin()).toEqual({ price: 0 });
    expect(objectHeap.peek()).toEqual({ price: 1 });
  });

  it('should handle duplicate elements correctly', () => {
    heap.insert(5);
    heap.insert(3);
    heap.insert(5);
    heap.insert(1);

    expect(heap.extractMin()).toBe(1);
    expect(heap.extractMin()).toBe(3);
    expect(heap.extractMin()).toBe(5);
    expect(heap.extractMin()).toBe(5);
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

    expect(heap.peek()).toBe(1);
    expect(heap.extractMin()).toBe(1);
    expect(heap.extractMin()).toBe(2);
  });

  it('heapify should heapify an array of strings', () => {
    const array = ['zebra', 'apple', 'cat', 'dog'];

    stringHeap.heapify(array);

    expect(stringHeap.peek()).toBe('apple');
    expect(stringHeap.extractMin()).toBe('apple');
    expect(stringHeap.extractMin()).toBe('cat');
  });

  it('heapify should heapify an array of objects', () => {
    const array = [{ price: 3 }, { price: 1 }, { price: 2 }];

    objectHeap.heapify(array);

    expect(objectHeap.peek()).toEqual({ price: 1 });
    expect(objectHeap.extractMin()).toEqual({ price: 1 });
    expect(objectHeap.extractMin()).toEqual({ price: 2 });
  });

  it('peek should return the minimum element without removing it (numbers)', () => {
    heap.insert(5);
    heap.insert(3);

    expect(heap.peek()).toBe(3);
    expect(heap.size()).toBe(2); // Peek should not modify the heap
  });

  it('peek should return the minimum element without removing it (strings)', () => {
    stringHeap.insert('mango');
    stringHeap.insert('apple');

    expect(stringHeap.peek()).toBe('apple');
    expect(stringHeap.size()).toBe(2);
  });

  it('peek should return the minimum element without removing it (objects)', () => {
    objectHeap.insert({ price: 3 });
    objectHeap.insert({ price: 1 });

    expect(objectHeap.peek()).toEqual({ price: 1 });
    expect(objectHeap.peek()).toEqual({ price: 1 });
  });
});
