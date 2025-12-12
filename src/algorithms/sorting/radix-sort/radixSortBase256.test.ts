import { describe, expect, it } from 'vitest';
import { radixSortBase256 } from './radixSortBase256';

describe('radixSortBase256', () => {
  it('should sort basic array', () => {
    const arr = [170, 45, 75, 90, 802, 24, 2, 66];
    const result = radixSortBase256(arr);
    expect(result).toEqual([2, 24, 45, 66, 75, 90, 170, 802]);
  });

  it('should sort array with max 32-bit values', () => {
    const arr = [4294967295, 0, 2147483647, 1];
    const result = radixSortBase256(arr);
    expect(result).toEqual([0, 1, 2147483647, 4294967295]);
  });

  it('should handle large arrays efficiently', () => {
    const arr = Array.from({ length: 50000 }, () =>
      Math.floor(Math.random() * 1000000),
    );

    const result = radixSortBase256(arr);

    // Verify it's sorted
    for (let i = 1; i < result.length; i++) {
      expect(result[i]).toBeGreaterThanOrEqual(result[i - 1]);
    }
  });

  it('should sort array with duplicates', () => {
    const arr = [100, 50, 100, 25, 50, 25];
    const result = radixSortBase256(arr);
    expect(result).toEqual([25, 25, 50, 50, 100, 100]);
  });

  it('should handle single element', () => {
    const arr = [42];
    const result = radixSortBase256(arr);
    expect(result).toEqual([42]);
  });

  it('should early exit for small numbers', () => {
    const arr = [10, 5, 8, 3, 1];
    const result = radixSortBase256(arr);
    expect(result).toEqual([1, 3, 5, 8, 10]);
  });
});
