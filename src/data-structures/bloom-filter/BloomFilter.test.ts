import { describe, it, expect, beforeEach } from 'vitest';
import BloomFilter from './BloomFilter';

describe('BloomFilter', () => {
  describe('Constructor', () => {
    it('should create a filter with correct size and hash count', () => {
      const filter = new BloomFilter(1000, 0.01);
      const stats = filter.getStats();

      expect(stats.size).toBeGreaterThan(0);
      expect(stats.hashCount).toBeGreaterThan(0);
      expect(stats.bitsSet).toBe(0);
      expect(stats.fillRatio).toBe(0);
    });

    it('should calculate larger size for lower false positive rates', () => {
      const filter1 = new BloomFilter(1000, 0.01);
      const filter2 = new BloomFilter(1000, 0.001);

      expect(filter2.getStats().size).toBeGreaterThan(filter1.getStats().size);
    });

    it('should accept custom hash function', () => {
      const customHash = (item: string) => {
        let hash = 0;
        for (let i = 0; i < item.length; i++) {
          hash = (hash << 5) - hash + item.charCodeAt(i);
        }
        return hash;
      };

      const filter = new BloomFilter(100, 0.01, customHash);
      filter.add('test');
      expect(filter.contains('test')).toBe(true);
    });
  });

  describe('add() and contains()', () => {
    let filter: BloomFilter<string>;

    beforeEach(() => {
      filter = new BloomFilter(100, 0.01);
    });

    it('should return true for items that were added', () => {
      filter.add('apple');
      filter.add('banana');
      filter.add('cherry');

      expect(filter.contains('apple')).toBe(true);
      expect(filter.contains('banana')).toBe(true);
      expect(filter.contains('cherry')).toBe(true);
    });

    it('should return false for items that were not added', () => {
      filter.add('apple');

      expect(filter.contains('banana')).toBe(false);
      expect(filter.contains('cherry')).toBe(false);
      expect(filter.contains('date')).toBe(false);
    });

    it('should handle multiple additions of the same item', () => {
      filter.add('apple');
      filter.add('apple');
      filter.add('apple');

      expect(filter.contains('apple')).toBe(true);
    });

    it('should work with numeric values', () => {
      const numFilter = new BloomFilter<number>(100, 0.01);

      numFilter.add(42);
      numFilter.add(100);
      numFilter.add(-5);

      expect(numFilter.contains(42)).toBe(true);
      expect(numFilter.contains(100)).toBe(true);
      expect(numFilter.contains(-5)).toBe(true);
      expect(numFilter.contains(99)).toBe(false);
    });

    it('should work with boolean values', () => {
      const boolFilter = new BloomFilter<boolean>(10, 0.01);

      boolFilter.add(true);

      expect(boolFilter.contains(true)).toBe(true);
      expect(boolFilter.contains(false)).toBe(false);
    });

    it('should work with object values', () => {
      interface User {
        id: number;
        name: string;
      }

      const objFilter = new BloomFilter<User>(100, 0.01);
      const user1 = { id: 1, name: 'Alice' };
      const user2 = { id: 2, name: 'Bob' };

      objFilter.add(user1);

      expect(objFilter.contains({ id: 1, name: 'Alice' })).toBe(true);
      expect(objFilter.contains(user2)).toBe(false);
    });

    it('should handle empty strings', () => {
      filter.add('');
      expect(filter.contains('')).toBe(true);
    });

    it('should handle special characters', () => {
      filter.add('hello@world!');
      filter.add('test#123$%^');
      filter.add('émoji🎉');

      expect(filter.contains('hello@world!')).toBe(true);
      expect(filter.contains('test#123$%^')).toBe(true);
      expect(filter.contains('émoji🎉')).toBe(true);
    });
  });

  describe('clear()', () => {
    it('should remove all items from the filter', () => {
      const filter = new BloomFilter(100, 0.01);

      filter.add('apple');
      filter.add('banana');
      filter.add('cherry');

      expect(filter.contains('apple')).toBe(true);

      filter.clear();

      expect(filter.contains('apple')).toBe(false);
      expect(filter.contains('banana')).toBe(false);
      expect(filter.contains('cherry')).toBe(false);
      expect(filter.getStats().bitsSet).toBe(0);
    });

    it('should allow adding items after clearing', () => {
      const filter = new BloomFilter(100, 0.01);

      filter.add('apple');
      filter.clear();
      filter.add('banana');

      expect(filter.contains('apple')).toBe(false);
      expect(filter.contains('banana')).toBe(true);
    });
  });

  describe('getStats()', () => {
    it('should return accurate statistics for empty filter', () => {
      const filter = new BloomFilter(100, 0.01);
      const stats = filter.getStats();

      expect(stats.bitsSet).toBe(0);
      expect(stats.fillRatio).toBe(0);
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.hashCount).toBeGreaterThan(0);
    });

    it('should show increasing bits set as items are added', () => {
      const filter = new BloomFilter(100, 0.01);

      const stats1 = filter.getStats();
      filter.add('item1');
      const stats2 = filter.getStats();
      filter.add('item2');
      const stats3 = filter.getStats();

      expect(stats2.bitsSet).toBeGreaterThan(stats1.bitsSet);
      expect(stats3.bitsSet).toBeGreaterThanOrEqual(stats2.bitsSet);
      expect(stats3.fillRatio).toBeGreaterThan(stats1.fillRatio);
    });

    it('should have consistent size and hashCount', () => {
      const filter = new BloomFilter(100, 0.01);

      const stats1 = filter.getStats();
      filter.add('item1');
      filter.add('item2');
      const stats2 = filter.getStats();

      expect(stats2.size).toBe(stats1.size);
      expect(stats2.hashCount).toBe(stats1.hashCount);
    });
  });

  describe('False Positive Rate', () => {
    it('should have low false positive rate for expected number of items', () => {
      const expectedItems = 1000;
      const targetFalsePositiveRate = 0.01;
      const filter = new BloomFilter(expectedItems, targetFalsePositiveRate);

      // Add expected number of items
      for (let i = 0; i < expectedItems; i++) {
        filter.add(`item${i}`);
      }

      // Test items not in the filter
      let falsePositives = 0;
      const testCount = 10000;

      for (let i = expectedItems; i < expectedItems + testCount; i++) {
        if (filter.contains(`item${i}`)) {
          falsePositives++;
        }
      }

      const actualFalsePositiveRate = falsePositives / testCount;

      // Allow some variance, should be within 3x the target rate
      expect(actualFalsePositiveRate).toBeLessThan(targetFalsePositiveRate * 3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small expected items count', () => {
      const filter = new BloomFilter(1, 0.01);
      filter.add('single');

      expect(filter.contains('single')).toBe(true);
    });

    it('should handle very large strings', () => {
      const filter = new BloomFilter(100, 0.01);
      const largeString = 'a'.repeat(10000);

      filter.add(largeString);
      expect(filter.contains(largeString)).toBe(true);
    });

    it('should distinguish between similar strings', () => {
      const filter = new BloomFilter(100, 0.01);

      filter.add('test');

      expect(filter.contains('test')).toBe(true);
      expect(filter.contains('test1')).toBe(false);
      expect(filter.contains('Test')).toBe(false);
      expect(filter.contains('tes')).toBe(false);
    });

    it('should handle zero and negative numbers', () => {
      const filter = new BloomFilter<number>(100, 0.01);

      filter.add(0);
      filter.add(-1);
      filter.add(-100);

      expect(filter.contains(0)).toBe(true);
      expect(filter.contains(-1)).toBe(true);
      expect(filter.contains(-100)).toBe(true);
    });
  });

  describe('Custom Hash Function', () => {
    it('should work correctly with custom hash function', () => {
      const simpleHash = (item: string) => {
        let hash = 0;
        for (let i = 0; i < item.length; i++) {
          hash += item.charCodeAt(i);
        }
        return hash;
      };

      const filter = new BloomFilter(100, 0.01, simpleHash);

      filter.add('test');
      filter.add('hello');

      expect(filter.contains('test')).toBe(true);
      expect(filter.contains('hello')).toBe(true);
      expect(filter.contains('world')).toBe(false);
    });

    it('should handle custom hash for complex types', () => {
      interface Point {
        x: number;
        y: number;
      }

      const pointHash = (point: Point) => {
        return point.x * 31 + point.y;
      };

      const filter = new BloomFilter<Point>(100, 0.01, pointHash);

      filter.add({ x: 10, y: 20 });
      filter.add({ x: 5, y: 15 });

      expect(filter.contains({ x: 10, y: 20 })).toBe(true);
      expect(filter.contains({ x: 5, y: 15 })).toBe(true);
      expect(filter.contains({ x: 1, y: 1 })).toBe(false);
    });
  });
});
