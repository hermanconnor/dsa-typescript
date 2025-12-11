import { describe, expect, it } from 'vitest';
import { exponentialSearch } from './exponentialSearch';

describe('exponentialSearch', () => {
  it('should return -1 when the array is empty', () => {
    const arr: number[] = [];
    const target = 10;

    const result = exponentialSearch(arr, target);

    expect(result).toBe(-1);
  });

  it('should return the correct index when the array has one element', () => {
    const arr = [100];
    const target = 100;

    const result = exponentialSearch(arr, target);

    expect(result).toBe(0);
  });

  it('should return -1 when the array has one element but the target is not present', () => {
    const arr = [100];
    const target = 200;

    const result = exponentialSearch(arr, target);

    expect(result).toBe(-1);
  });

  it('should return the correct index when the target is found', () => {
    const arr = [10, 20, 30, 40, 50];
    const target = 30;

    const result = exponentialSearch(arr, target);

    expect(result).toBe(2);
  });

  it('should return -1 when the target is not found', () => {
    const arr = [10, 20, 30, 40, 50];
    const target = 60;

    const result = exponentialSearch(arr, target);

    expect(result).toBe(-1);
  });

  it('should return 0 when the target is at the first index', () => {
    const arr = [10, 20, 30, 40, 50];
    const target = 10;

    const result = exponentialSearch(arr, target);

    expect(result).toBe(0);
  });

  it('should return the last index when the target is at the last index', () => {
    const arr = [10, 20, 30, 40, 50];
    const target = 50;

    const result = exponentialSearch(arr, target);

    expect(result).toBe(4);
  });

  it('should return the middle index when the target is in the middle of the array', () => {
    const arr = [10, 20, 30, 40, 50];
    const target = 30;

    const result = exponentialSearch(arr, target);

    expect(result).toBe(2);
  });

  it('should correctly find the target in an array with both negative and positive numbers', () => {
    const arr = [-10, -5, 0, 5, 10];
    const target = -5;

    const result = exponentialSearch(arr, target);

    expect(result).toBe(1);
  });

  it('should return -1 when the target is smaller than all elements', () => {
    const arr = [10, 20, 30, 40, 50];
    const target = 5;

    const result = exponentialSearch(arr, target);

    expect(result).toBe(-1);
  });

  it('should return -1 when the target is larger than all elements', () => {
    const arr = [10, 20, 30, 40, 50];
    const target = 60;

    const result = exponentialSearch(arr, target);

    expect(result).toBe(-1);
  });

  it('should correctly find the target in an array of floating-point numbers', () => {
    const arr = [1.5, 2.5, 3.5, 4.5, 5.5];
    const target = 3.5;

    const result = exponentialSearch(arr, target);

    expect(result).toBe(2);
  });

  it('should find the target in an array with a large range of numbers', () => {
    const arr = Array.from({ length: 1000000 }, (_, i) => i * 2);
    const target = 1000000;

    const result = exponentialSearch(arr, target);

    expect(result).toBe(500000);
  });
});
