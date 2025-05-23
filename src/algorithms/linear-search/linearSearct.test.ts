import { describe, expect, it } from 'vitest';
import { linearSearch } from './linearSearch';

describe('linearSearch', () => {
  it('should return -1 when the array is empty', () => {
    const arr: number[] = [];
    const target = 10;

    const result = linearSearch(arr, target);

    expect(result).toBe(-1);
  });

  it('should return the correct index when the array has one element', () => {
    const arr = [100];
    const target = 100;

    const result = linearSearch(arr, target);

    expect(result).toBe(0);
  });

  it('should return -1 when the array has one element but the target is not present', () => {
    const arr = [100];
    const target = 200;

    const result = linearSearch(arr, target);

    expect(result).toBe(-1);
  });

  it('should return the correct index when the target is found', () => {
    const arr = [10, 20, 30, 40, 50];
    const target = 30;

    const result = linearSearch(arr, target);

    expect(result).toBe(2);
  });

  it('should return -1 when the target is not found', () => {
    const arr = [10, 20, 30, 40, 50];
    const target = 60;

    const result = linearSearch(arr, target);

    expect(result).toBe(-1);
  });

  it('should return 0 when the target is at the first index', () => {
    const arr = [10, 20, 30, 40, 50];
    const target = 10;

    const result = linearSearch(arr, target);

    expect(result).toBe(0);
  });

  it('should return the last index when the target is at the last index', () => {
    const arr = [10, 20, 30, 40, 50];
    const target = 50;

    const result = linearSearch(arr, target);

    expect(result).toBe(4);
  });

  it('should return the index of the first occurrence when there are duplicates', () => {
    const arr = [10, 20, 30, 20, 40, 50];
    const target = 20;
    const result = linearSearch(arr, target);
    expect(result).toBe(1);
  });

  it('should correctly find the target in an array with both negative and positive numbers', () => {
    const arr = [-10, -5, 0, 5, 10];
    const target = -5;

    const result = linearSearch(arr, target);

    expect(result).toBe(1);
  });

  it('should return 0 when all elements are the same as the target', () => {
    const arr = [7, 7, 7, 7, 7];
    const target = 7;

    const result = linearSearch(arr, target);

    expect(result).toBe(0);
  });

  it('should return the correct index in a large array', () => {
    const arr = Array.from({ length: 1000000 }, (_, i) => i);
    const target = 999999;

    const result = linearSearch(arr, target);

    expect(result).toBe(999999);
  });

  it('should return -1 when the target is not present in a large array', () => {
    const arr = Array.from({ length: 1000000 }, (_, i) => i);
    const target = 1000001;

    const result = linearSearch(arr, target);

    expect(result).toBe(-1);
  });
});
