import { describe, expect, it } from 'vitest';
import { radixSortWithNegatives } from './radixSortWithNegatives';

describe('radixSortWithNegatives', () => {
  it('should sort array with only negative numbers', () => {
    const arr = [-5, -1, -10, -3, -7];

    const result = radixSortWithNegatives(arr);

    expect(result).toEqual([-10, -7, -5, -3, -1]);
  });

  it('should sort array with only positive numbers', () => {
    const arr = [5, 1, 10, 3, 7];

    const result = radixSortWithNegatives(arr);

    expect(result).toEqual([1, 3, 5, 7, 10]);
  });

  it('should sort array with mixed positive and negative numbers', () => {
    const arr = [3, -1, 4, -5, 0, 2, -3];

    const result = radixSortWithNegatives(arr);

    expect(result).toEqual([-5, -3, -1, 0, 2, 3, 4]);
  });

  it('should handle zero correctly', () => {
    const arr = [-5, 0, 5, 0, -3];

    const result = radixSortWithNegatives(arr);

    expect(result).toEqual([-5, -3, 0, 0, 5]);
  });

  it('should sort large negative numbers', () => {
    const arr = [-1000000, -1, 0, 1, 1000000];

    const result = radixSortWithNegatives(arr);

    expect(result).toEqual([-1000000, -1, 0, 1, 1000000]);
  });

  it('should handle all negative duplicates', () => {
    const arr = [-5, -5, -5, -5];

    const result = radixSortWithNegatives(arr);

    expect(result).toEqual([-5, -5, -5, -5]);
  });

  it('should handle mix of duplicates', () => {
    const arr = [-2, 2, -2, 2, 0];

    const result = radixSortWithNegatives(arr);

    expect(result).toEqual([-2, -2, 0, 2, 2]);
  });

  it('should handle empty array', () => {
    const arr: number[] = [];

    const result = radixSortWithNegatives(arr);

    expect(result).toEqual([]);
  });

  it('should handle single negative number', () => {
    const arr = [-42];

    const result = radixSortWithNegatives(arr);

    expect(result).toEqual([-42]);
  });
});
