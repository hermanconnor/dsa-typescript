import { describe, it, expect } from 'vitest';
import { recursiveBinarySearch } from './recursiveBinarySearch';

describe('recursiveBinarySearch', () => {
  const numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

  it('should find the index of an element in the middle of the array', () => {
    expect(recursiveBinarySearch(numbers, 23)).toBe(5);
  });

  it('should find the first element (lower bound)', () => {
    expect(recursiveBinarySearch(numbers, 2)).toBe(0);
  });

  it('should find the last element (upper bound)', () => {
    expect(recursiveBinarySearch(numbers, 91)).toBe(9);
  });

  it('should return -1 if the element is not in the array', () => {
    expect(recursiveBinarySearch(numbers, 50)).toBe(-1);
  });

  it('should return -1 for an empty array', () => {
    expect(recursiveBinarySearch([], 10)).toBe(-1);
  });

  it('should work with a single-element array if the target matches', () => {
    expect(recursiveBinarySearch([100], 100)).toBe(0);
  });

  it('should work with strings in alphabetical order', () => {
    const fruits = ['apple', 'banana', 'cherry', 'date'];

    expect(recursiveBinarySearch(fruits, 'cherry')).toBe(2);
    expect(recursiveBinarySearch(fruits, 'elderberry')).toBe(-1);
  });
});
