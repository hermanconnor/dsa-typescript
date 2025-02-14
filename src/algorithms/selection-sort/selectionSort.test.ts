import { describe, expect, it } from 'vitest';
import { selectionSort } from './selectionSort';

describe('selectionSort', () => {
  it('should return an empty array if input is empty', () => {
    expect(selectionSort([])).toEqual([]);
  });

  it('should return the same array for a single element array', () => {
    expect(selectionSort([42])).toEqual([42]);
  });

  it('should sort an unsorted array', () => {
    const input = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];

    const output = selectionSort(input);

    expect(output).toEqual([1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]);
  });

  it('should return the same array if it is already sorted', () => {
    const input = [1, 2, 3, 4, 5];

    expect(selectionSort(input)).toEqual(input);
  });

  it('should sort an array with negative numbers', () => {
    const input = [3, -1, 4, -1, 5, -9, 2];

    const output = selectionSort(input);

    expect(output).toEqual([-9, -1, -1, 2, 3, 4, 5]);
  });

  it('should handle arrays with duplicates', () => {
    const input = [3, 1, 3, 1, 5, 5, 3];

    const output = selectionSort(input);

    expect(output).toEqual([1, 1, 3, 3, 3, 5, 5]);
  });

  it('should sort an array in reverse order', () => {
    const input = [9, 8, 7, 6, 5, 4, 3, 2, 1];

    const output = selectionSort(input);

    expect(output).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should handle an array with zeros and positive numbers', () => {
    const input = [0, 3, 2, 0, 5, 1];

    const output = selectionSort(input);

    expect(output).toEqual([0, 0, 1, 2, 3, 5]);
  });

  it('should correctly sort a large array', () => {
    const input = Array.from({ length: 1000 }, () =>
      Math.floor(Math.random() * 1000),
    );

    const output = selectionSort(input);

    expect(output).toEqual(input.sort((a, b) => a - b));
  });

  it('should return the same array if all elements are identical', () => {
    const input = [5, 5, 5, 5, 5];

    const output = selectionSort(input);

    expect(output).toEqual([5, 5, 5, 5, 5]);
  });
});
