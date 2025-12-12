import { describe, expect, it } from 'vitest';
import { jumpSearch } from './jumpSearch';

describe('jumpSearch', () => {
  it('should find element in a small sorted array', () => {
    const arr = [1, 3, 5, 7, 9];

    expect(jumpSearch(arr, 5)).toBe(2);
    expect(jumpSearch(arr, 1)).toBe(0);
    expect(jumpSearch(arr, 9)).toBe(4);
  });

  it('should return -1 for element not in array', () => {
    const arr = [1, 3, 5, 7, 9];

    expect(jumpSearch(arr, 4)).toBe(-1);
    expect(jumpSearch(arr, 0)).toBe(-1);
    expect(jumpSearch(arr, 10)).toBe(-1);
  });

  it('should handle empty array', () => {
    expect(jumpSearch([], 5)).toBe(-1);
  });

  it('should handle single element array', () => {
    expect(jumpSearch([5], 5)).toBe(0);
    expect(jumpSearch([5], 3)).toBe(-1);
  });

  it('should find first element', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    expect(jumpSearch(arr, 1)).toBe(0);
  });

  it('should find last element', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    expect(jumpSearch(arr, 9)).toBe(8);
  });

  it('should work with larger arrays', () => {
    const arr = Array.from({ length: 100 }, (_, i) => i * 2); // [0, 2, 4, 6, ..., 198]

    expect(jumpSearch(arr, 50)).toBe(25);
    expect(jumpSearch(arr, 0)).toBe(0);
    expect(jumpSearch(arr, 198)).toBe(99);
    expect(jumpSearch(arr, 99)).toBe(-1); // Odd number not in array
  });

  it('should handle array where target is in first block', () => {
    const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17];

    expect(jumpSearch(arr, 3)).toBe(1);
    expect(jumpSearch(arr, 7)).toBe(3);
  });

  it('should handle array where target is in middle block', () => {
    const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25];

    expect(jumpSearch(arr, 13)).toBe(6);
    expect(jumpSearch(arr, 15)).toBe(7);
  });

  it('should handle array where target is in last block', () => {
    const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

    expect(jumpSearch(arr, 17)).toBe(8);
    expect(jumpSearch(arr, 19)).toBe(9);
  });

  it('should work with two element array', () => {
    expect(jumpSearch([1, 2], 1)).toBe(0);
    expect(jumpSearch([1, 2], 2)).toBe(1);
    expect(jumpSearch([1, 2], 3)).toBe(-1);
  });

  it('should handle array with duplicate values', () => {
    const arr = [1, 2, 2, 2, 5, 7, 9];
    // Returns first occurrence
    expect(jumpSearch(arr, 2)).toBe(1);
  });

  it('should handle negative numbers', () => {
    const arr = [-10, -5, 0, 5, 10, 15, 20];

    expect(jumpSearch(arr, -5)).toBe(1);
    expect(jumpSearch(arr, 0)).toBe(2);
    expect(jumpSearch(arr, 15)).toBe(5);
    expect(jumpSearch(arr, -15)).toBe(-1);
  });

  it('should work with arrays where length is perfect square', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // Length 16, sqrt = 4

    expect(jumpSearch(arr, 4)).toBe(3);
    expect(jumpSearch(arr, 8)).toBe(7);
    expect(jumpSearch(arr, 12)).toBe(11);
    expect(jumpSearch(arr, 16)).toBe(15);
  });

  it('should handle target smaller than all elements', () => {
    const arr = [10, 20, 30, 40, 50];

    expect(jumpSearch(arr, 5)).toBe(-1);
  });

  it('should handle target larger than all elements', () => {
    const arr = [10, 20, 30, 40, 50];

    expect(jumpSearch(arr, 100)).toBe(-1);
  });
});
