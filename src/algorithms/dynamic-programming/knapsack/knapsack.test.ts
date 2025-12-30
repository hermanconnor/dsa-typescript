import { describe, it, expect } from 'vitest';
import { knapsack, knapsackOptimized } from './knapsack';

// A helper to run tests against both implementations
const implementations = [
  { name: 'Standard 2D Knapsack', fn: knapsack },
  { name: 'Optimized 1D Knapsack', fn: knapsackOptimized },
];

implementations.forEach(({ name, fn }) => {
  describe(`Knapsack Implementation: ${name}`, () => {
    it('should find the maximum value in a standard scenario', () => {
      const items = [
        { name: 'Apple', weight: 1, value: 10 },
        { name: 'Orange', weight: 2, value: 20 },
        { name: 'Banana', weight: 3, value: 30 },
      ];
      const capacity = 5;

      // Best combo: Orange (2) + Banana (3) = Weight 5, Value 50
      expect(fn(items, capacity)).toBe(50);
    });

    it('should return 0 if no items fit', () => {
      const items = [{ weight: 10, value: 100 }];
      const capacity = 5;
      expect(fn(items, capacity)).toBe(0);
    });

    it('should return 0 if the items list is empty', () => {
      expect(fn([], 10)).toBe(0);
    });

    it('should handle a capacity of 0', () => {
      const items = [{ weight: 1, value: 10 }];
      expect(fn(items, 0)).toBe(0);
    });

    it('should take all items if capacity is large enough', () => {
      const items = [
        { weight: 1, value: 10 },
        { weight: 1, value: 20 },
      ];
      const capacity = 10;
      expect(fn(items, capacity)).toBe(30);
    });

    it('should correctly choose a high-value heavy item over multiple low-value light items', () => {
      const items = [
        { weight: 1, value: 10 },
        { weight: 1, value: 10 },
        { weight: 3, value: 100 },
      ];
      const capacity = 3;
      // Best choice is the weight 3 item (Value 100)
      // rather than two weight 1 items (Value 20)
      expect(fn(items, capacity)).toBe(100);
    });
  });
});
