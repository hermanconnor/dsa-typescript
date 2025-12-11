import { describe, expect, it } from 'vitest';
import { mergeSort } from './mergeSort';

describe('mergeSort', () => {
  it('should return an empty array if the input is empty', () => {
    const input: number[] = [];

    const output = mergeSort(input);

    expect(output).toEqual([]);
  });

  it('should sort an array of numbers', () => {
    const input = [4, 2, 7, 1, 3];

    const output = mergeSort(input);

    expect(output).toEqual([1, 2, 3, 4, 7]);
  });

  it('should return the same array if it is already sorted', () => {
    const input = [1, 2, 3, 4, 5];

    const output = mergeSort(input);

    expect(output).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle an array with duplicate elements', () => {
    const input = [4, 2, 2, 5, 3, 3];

    const output = mergeSort(input);

    expect(output).toEqual([2, 2, 3, 3, 4, 5]);
  });

  it('should sort an array with negative numbers', () => {
    const input = [3, -1, 4, -2, 5];

    const output = mergeSort(input);

    expect(output).toEqual([-2, -1, 3, 4, 5]);
  });

  it('should return the same array if it has only one element', () => {
    const input = [42];

    const output = mergeSort(input);

    expect(output).toEqual([42]);
  });

  it('should return the same array if all elements are identical', () => {
    const input = [5, 5, 5, 5, 5];

    const output = mergeSort(input);

    expect(output).toEqual([5, 5, 5, 5, 5]);
  });

  it('should correctly sort a large array', () => {
    const input = Array.from({ length: 1000 }, () =>
      Math.floor(Math.random() * 1000),
    );

    const output = mergeSort(input);

    expect(output).toEqual(input.sort((a, b) => a - b));
  });

  it('should correctly sort an array with zero', () => {
    const input = [0, 2, -3, 1];

    const output = mergeSort(input);

    expect(output).toEqual([-3, 0, 1, 2]);
  });

  it('should sort a reverse ordered array', () => {
    const input = [5, 4, 3, 2, 1];

    const output = mergeSort(input);

    expect(output).toEqual([1, 2, 3, 4, 5]);
  });
});
