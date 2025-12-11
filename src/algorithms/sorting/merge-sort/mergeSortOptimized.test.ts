import { expect, describe, it } from 'vitest';
import { mergeSortOptimized } from './mergeSortOptimized';

// The threshold used in the implementation
const INSERTION_SORT_THRESHOLD = 10;

describe('mergeSortOptimized', () => {
  it('should sort a standard array of unique positive integers', () => {
    const unsorted = [5, 2, 8, 1, 9, 4, 7, 3, 6];
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    expect(mergeSortOptimized(unsorted)).toEqual(expected);
  });

  it('should sort an array including duplicates', () => {
    const unsorted = [5, 2, 8, 1, 9, 4, 7, 3, 6, 5, 2];
    const expected = [1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 9];

    expect(mergeSortOptimized(unsorted)).toEqual(expected);
  });

  it('should sort an array with negative numbers and zero', () => {
    const unsorted = [-5, 0, 10, -1, 3, -100];
    const expected = [-100, -5, -1, 0, 3, 10];

    expect(mergeSortOptimized(unsorted)).toEqual(expected);
  });

  it('should handle an empty array', () => {
    const arr: number[] = [];

    expect(mergeSortOptimized(arr)).toEqual([]);
    // Ensure the original empty array reference is returned (in-place property)
    expect(mergeSortOptimized(arr)).toBe(arr);
  });

  it('should handle an array with a single element', () => {
    const arr = [42];
    expect(mergeSortOptimized(arr)).toEqual([42]);
    // Ensure the original array reference is returned (in-place property)
    expect(mergeSortOptimized(arr)).toBe(arr);
  });

  it('should handle an array that is already sorted (Best Case)', () => {
    const sorted = [1, 2, 3, 4, 5];
    const originalRef = sorted;

    expect(mergeSortOptimized(sorted)).toEqual([1, 2, 3, 4, 5]);
    // Ensure it remains the same array reference
    expect(sorted).toBe(originalRef);
  });

  it('should handle an array sorted in reverse order (Worst Case)', () => {
    const reversed = [5, 4, 3, 2, 1];
    const expected = [1, 2, 3, 4, 5];

    expect(mergeSortOptimized(reversed)).toEqual(expected);
  });

  it('should handle an array with all same elements', () => {
    const same = [7, 7, 7, 7, 7];

    expect(mergeSortOptimized(same)).toEqual([7, 7, 7, 7, 7]);
  });

  it(`should use insertion sort for small arrays (n < ${INSERTION_SORT_THRESHOLD})`, () => {
    // Array size right at the threshold boundary
    const smallArr = [9, 1, 8, 2, 7];
    const expected = [1, 2, 7, 8, 9];
    // This indirectly tests the insertionSort helper is called for small subarrays.
    expect(mergeSortOptimized(smallArr)).toEqual(expected);
  });

  it('should correctly sort an array exactly at the threshold size', () => {
    // Array size of 10
    const thresholdArr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    expect(mergeSortOptimized(thresholdArr)).toEqual(expected);
  });
});
