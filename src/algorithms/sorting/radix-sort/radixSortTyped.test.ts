import { describe, it, expect } from 'vitest';
import { radixSortTyped } from './radixSortTyped';

describe('radixSortTyped', () => {
  it('should sort basic Uint32Array', () => {
    const arr = new Uint32Array([170, 45, 75, 90, 802, 24, 2, 66]);
    const result = radixSortTyped(arr);
    expect(Array.from(result)).toEqual([2, 24, 45, 66, 75, 90, 170, 802]);
  });

  it('should handle empty Uint32Array', () => {
    const arr = new Uint32Array([]);
    const result = radixSortTyped(arr);
    expect(Array.from(result)).toEqual([]);
  });

  it('should handle single element', () => {
    const arr = new Uint32Array([42]);
    const result = radixSortTyped(arr);
    expect(Array.from(result)).toEqual([42]);
  });

  it('should handle maximum Uint32 values', () => {
    const arr = new Uint32Array([4294967295, 0, 2147483647, 1, 4294967294]);
    const result = radixSortTyped(arr);
    expect(Array.from(result)).toEqual([
      0, 1, 2147483647, 4294967294, 4294967295,
    ]);
  });

  it('should handle duplicates', () => {
    const arr = new Uint32Array([100, 50, 100, 50, 100]);
    const result = radixSortTyped(arr);
    expect(Array.from(result)).toEqual([50, 50, 100, 100, 100]);
  });

  it('should handle large arrays', () => {
    const size = 100000;
    const arr = new Uint32Array(size);
    for (let i = 0; i < size; i++) {
      arr[i] = size - i;
    }
    const result = radixSortTyped(arr);

    // Verify sorted
    for (let i = 1; i < result.length; i++) {
      expect(result[i]).toBeGreaterThanOrEqual(result[i - 1]);
    }
    expect(result[0]).toBe(1);
    expect(result[size - 1]).toBe(size);
  });

  it('should handle all zeros', () => {
    const arr = new Uint32Array([0, 0, 0, 0]);
    const result = radixSortTyped(arr);
    expect(Array.from(result)).toEqual([0, 0, 0, 0]);
  });

  it('should handle reverse sorted array', () => {
    const arr = new Uint32Array([1000, 900, 800, 700, 600]);
    const result = radixSortTyped(arr);
    expect(Array.from(result)).toEqual([600, 700, 800, 900, 1000]);
  });
});
