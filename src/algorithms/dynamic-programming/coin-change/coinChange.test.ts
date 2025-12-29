import { describe, it, expect } from 'vitest';
import { coinChange } from './coinChange';

describe('coinChange', () => {
  it('should return the minimum number of coins for a standard case', () => {
    // 11 = 5 + 5 + 1 (3 coins)
    expect(coinChange([1, 2, 5], 11)).toBe(3);
  });

  it('should return 1 if the amount matches a coin denomination', () => {
    expect(coinChange([1, 2, 5], 5)).toBe(1);
  });

  it('should return 0 if the amount is 0', () => {
    expect(coinChange([1, 2, 5], 0)).toBe(0);
  });

  it('should return -1 if the amount cannot be reached', () => {
    // You can't make 3 cents using only 2-cent coins
    expect(coinChange([2], 3)).toBe(-1);
  });

  it('should handle large denominations correctly', () => {
    // 6249 = 25*249 + 24 (this tests if it finds the optimal path)
    expect(coinChange([186, 419, 83, 408], 6249)).toBe(20);
  });

  it('should work when coins are not in sorted order', () => {
    expect(coinChange([5, 1, 2], 11)).toBe(3);
  });
});
