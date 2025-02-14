import { describe, expect, it } from 'vitest';
import bubbleSort from './bubbleSort';

describe('bubbleSort', () => {
  it('should return an empty array for null or undefined input', () => {
    expect(bubbleSort([])).toEqual([]);
  });

  it('should correctly sort an unsorted array', () => {
    const arr = [5, 3, 8, 4, 2];

    expect(bubbleSort(arr)).toEqual([2, 3, 4, 5, 8]);
  });

  it('should not modify an already sorted array', () => {
    const arr = [1, 2, 3, 4, 5];

    expect(bubbleSort(arr)).toEqual([1, 2, 3, 4, 5]);
  });

  it('should return the same array for an array with one element', () => {
    const arr = [42];

    expect(bubbleSort(arr)).toEqual([42]);
  });

  it('should return the same array for an array with identical elements', () => {
    const arr = [7, 7, 7, 7, 7];

    expect(bubbleSort(arr)).toEqual([7, 7, 7, 7, 7]);
  });

  it('should return an empty array if given an empty array', () => {
    const arr: number[] = [];

    expect(bubbleSort(arr)).toEqual([]);
  });

  it('should handle negative numbers correctly', () => {
    const arr = [3, -1, 4, -2, 0];

    expect(bubbleSort(arr)).toEqual([-2, -1, 0, 3, 4]);
  });

  it('should handle large numbers correctly', () => {
    const arr = [100000, 5, 999999, 0, 123456];

    expect(bubbleSort(arr)).toEqual([0, 5, 100000, 123456, 999999]);
  });

  it('should handle mixed positive and negative numbers correctly', () => {
    const arr = [5, -3, 2, -1, 0];

    expect(bubbleSort(arr)).toEqual([-3, -1, 0, 2, 5]);
  });
});
