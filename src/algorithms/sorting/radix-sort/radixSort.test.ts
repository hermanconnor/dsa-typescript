import { describe, expect, it } from 'vitest';
import { radixSort } from './radixSort';

describe('radixSort', () => {
  it('should sort an empty array', () => {
    const arr: number[] = [];

    const result = radixSort(arr);

    expect(result).toEqual([]);
  });

  it('should sort a single-element array', () => {
    const arr = [42];

    const result = radixSort(arr);

    expect(result).toEqual([42]);
  });

  it('should sort a sorted array', () => {
    const arr = [1, 2, 3, 4, 5];

    const result = radixSort(arr);

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sort a reverse-sorted array', () => {
    const arr = [5, 4, 3, 2, 1];

    const result = radixSort(arr);

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sort an array with duplicates', () => {
    const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];

    const result = radixSort(arr);

    expect(result).toEqual([1, 1, 2, 3, 3, 4, 5, 5, 6, 9]);
  });

  it('should sort an array with all same elements', () => {
    const arr = [7, 7, 7, 7, 7];

    const result = radixSort(arr);

    expect(result).toEqual([7, 7, 7, 7, 7]);
  });

  it('should sort large numbers', () => {
    const arr = [1000000, 999999, 1, 50000, 100];

    const result = radixSort(arr);

    expect(result).toEqual([1, 100, 50000, 999999, 1000000]);
  });

  it('should sort numbers with varying digit counts', () => {
    const arr = [170, 45, 75, 90, 802, 24, 2, 66];

    const result = radixSort(arr);

    expect(result).toEqual([2, 24, 45, 66, 75, 90, 170, 802]);
  });

  it('should handle large arrays without stack overflow', () => {
    const arr = Array.from({ length: 100000 }, (_, i) => 100000 - i);

    const result = radixSort(arr);

    expect(result[0]).toBe(1);
    expect(result[result.length - 1]).toBe(100000);
    expect(result).toHaveLength(100000);
  });

  it('should maintain stability (preserve relative order of equal elements)', () => {
    // Note: This test assumes you track original indices somehow
    const arr = [10, 20, 10, 30, 10];

    const result = radixSort(arr);

    expect(result).toEqual([10, 10, 10, 20, 30]);
  });

  it('should handle array with zero', () => {
    const arr = [5, 0, 3, 0, 1];

    const result = radixSort(arr);

    expect(result).toEqual([0, 0, 1, 3, 5]);
  });
});

describe('Edge cases', () => {
  it('should handle powers of 2', () => {
    const arr = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];

    const result = radixSort([...arr].reverse());

    expect(result).toEqual(arr);
  });

  it('should handle powers of 10', () => {
    const arr = [1, 10, 100, 1000, 10000, 100000];

    const result = radixSort([...arr].reverse());

    expect(result).toEqual(arr);
  });

  it('should handle sequential numbers', () => {
    const arr = Array.from({ length: 1000 }, (_, i) => i);

    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    const result = radixSort(shuffled);

    expect(result).toEqual(arr);
  });
});
