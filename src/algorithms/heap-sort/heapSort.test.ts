import { describe, it, expect } from 'vitest';
import { heapSort } from './heapSort';

describe('heapSort', () => {
  it('should sort an empty array', () => {
    expect(heapSort([])).toEqual([]);
  });

  it('should sort an array with one element', () => {
    expect(heapSort([5])).toEqual([5]);
  });

  it('should sort an array of positive numbers', () => {
    expect(heapSort([5, 2, 8, 1, 9, 4])).toEqual([1, 2, 4, 5, 8, 9]);
  });

  it('should sort an array of negative numbers', () => {
    expect(heapSort([-5, -2, -8, -1, -9, -4])).toEqual([
      -9, -8, -5, -4, -2, -1,
    ]);
  });

  it('should sort an array with mixed positive and negative numbers', () => {
    expect(heapSort([-5, 2, -8, 1, -9, 4])).toEqual([-9, -8, -5, 1, 2, 4]);
  });

  it('should sort an array with duplicate elements', () => {
    expect(heapSort([5, 2, 8, 1, 5, 2, 9, 4, 1])).toEqual([
      1, 1, 2, 2, 4, 5, 5, 8, 9,
    ]);
  });

  it('should sort an already sorted array', () => {
    expect(heapSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sort a reverse sorted array', () => {
    expect(heapSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sort an array with a large number of elements', () => {
    const largeArray = Array.from({ length: 1000 }, () =>
      Math.floor(Math.random() * 1000),
    );
    const sortedLargeArray = [...largeArray].sort((a, b) => a - b); // Use native sort for comparison.
    expect(heapSort(largeArray)).toEqual(sortedLargeArray);
  });

  it('should handle floating-point numbers', () => {
    expect(heapSort([3.14, 2.71, 1.618, 0.577])).toEqual([
      0.577, 1.618, 2.71, 3.14,
    ]);
  });

  it('should handle zero', () => {
    expect(heapSort([0, 5, -2, 0, 8])).toEqual([-2, 0, 0, 5, 8]);
  });
});
