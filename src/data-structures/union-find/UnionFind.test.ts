import { describe, it, expect, beforeEach } from 'vitest';
import UnionFind from './UnionFind';

describe('UnionFind', () => {
  describe('Constructor', () => {
    it('should create a UnionFind with valid size', () => {
      const uf = new UnionFind(5);

      expect(uf.getSize()).toBe(5);
      expect(uf.getComponentCount()).toBe(5);
    });

    it('should initialize each element as its own parent', () => {
      const uf = new UnionFind(5);

      const parent = uf.getParent();

      expect(parent).toEqual([0, 1, 2, 3, 4]);
    });

    it('should throw error for size <= 0', () => {
      expect(() => new UnionFind(0)).toThrow('Size must be a positive number');
      expect(() => new UnionFind(-5)).toThrow('Size must be a positive number');
    });

    it('should handle size of 1', () => {
      const uf = new UnionFind(1);

      expect(uf.getSize()).toBe(1);
      expect(uf.getComponentCount()).toBe(1);
    });
  });

  describe('find()', () => {
    let uf: UnionFind;

    beforeEach(() => {
      uf = new UnionFind(10);
    });

    it('should return the element itself when it is its own root', () => {
      expect(uf.find(0)).toBe(0);
      expect(uf.find(5)).toBe(5);
      expect(uf.find(9)).toBe(9);
    });

    it('should return the root after union operations', () => {
      uf.union(0, 1);
      uf.union(1, 2);

      const root = uf.find(0);

      expect(uf.find(1)).toBe(root);
      expect(uf.find(2)).toBe(root);
    });

    it('should perform path compression', () => {
      // Create a chain: 0 -> 1 -> 2 -> 3
      uf.union(0, 1);
      uf.union(1, 2);
      uf.union(2, 3);

      const root = uf.find(0);

      // After finding 3, path compression should flatten the tree
      uf.find(3);

      // All nodes should now point closer to or directly at the root
      expect(uf.find(3)).toBe(root);
    });

    it('should throw RangeError for negative index', () => {
      expect(() => uf.find(-1)).toThrow(RangeError);
      expect(() => uf.find(-1)).toThrow('Element index -1 is out of bounds');
    });

    it('should throw RangeError for index >= size', () => {
      expect(() => uf.find(10)).toThrow(RangeError);
      expect(() => uf.find(100)).toThrow('Element index 100 is out of bounds');
    });
  });

  describe('union()', () => {
    let uf: UnionFind;

    beforeEach(() => {
      uf = new UnionFind(10);
    });

    it('should merge two different sets and return true', () => {
      expect(uf.union(0, 1)).toBe(true);
      expect(uf.isConnected(0, 1)).toBe(true);
    });

    it('should return false when elements are already in the same set', () => {
      uf.union(0, 1);

      expect(uf.union(0, 1)).toBe(false);
      expect(uf.union(1, 0)).toBe(false);
    });

    it('should decrease component count after union', () => {
      expect(uf.getComponentCount()).toBe(10);

      uf.union(0, 1);
      expect(uf.getComponentCount()).toBe(9);

      uf.union(2, 3);
      expect(uf.getComponentCount()).toBe(8);

      uf.union(0, 2); // Merges two components
      expect(uf.getComponentCount()).toBe(7);
    });

    it('should not decrease component count when uniting same set', () => {
      uf.union(0, 1);
      expect(uf.getComponentCount()).toBe(9);

      uf.union(0, 1); // Already connected
      expect(uf.getComponentCount()).toBe(9);
    });

    it('should handle transitive unions', () => {
      uf.union(0, 1);
      uf.union(1, 2);
      uf.union(2, 3);

      expect(uf.isConnected(0, 3)).toBe(true);
      expect(uf.getComponentCount()).toBe(7);
    });

    it('should merge multiple disjoint components correctly', () => {
      // Create two separate components
      uf.union(0, 1);
      uf.union(1, 2);

      uf.union(5, 6);
      uf.union(6, 7);

      expect(uf.getComponentCount()).toBe(6);
      expect(uf.isConnected(0, 2)).toBe(true);
      expect(uf.isConnected(5, 7)).toBe(true);
      expect(uf.isConnected(0, 5)).toBe(false);

      // Merge the two components
      uf.union(2, 5);

      expect(uf.getComponentCount()).toBe(5);
      expect(uf.isConnected(0, 7)).toBe(true);
    });

    it('should throw RangeError for invalid indices', () => {
      expect(() => uf.union(-1, 5)).toThrow(RangeError);
      expect(() => uf.union(5, -1)).toThrow(RangeError);
      expect(() => uf.union(10, 5)).toThrow(RangeError);
      expect(() => uf.union(5, 10)).toThrow(RangeError);
    });

    it('should handle union by rank correctly', () => {
      // When ranks are equal, one tree goes under the other and rank increases
      uf.union(0, 1);
      uf.union(2, 3);

      const beforeCount = uf.getComponentCount();
      uf.union(0, 2);

      expect(uf.getComponentCount()).toBe(beforeCount - 1);
      expect(uf.isConnected(0, 3)).toBe(true);
    });
  });

  describe('isConnected()', () => {
    let uf: UnionFind;

    beforeEach(() => {
      uf = new UnionFind(10);
    });

    it('should return true for connected elements', () => {
      uf.union(0, 1);
      uf.union(1, 2);

      expect(uf.isConnected(0, 1)).toBe(true);
      expect(uf.isConnected(0, 2)).toBe(true);
      expect(uf.isConnected(1, 2)).toBe(true);
    });

    it('should return false for disconnected elements', () => {
      uf.union(0, 1);
      uf.union(3, 4);

      expect(uf.isConnected(0, 3)).toBe(false);
      expect(uf.isConnected(1, 4)).toBe(false);
      expect(uf.isConnected(2, 5)).toBe(false);
    });

    it('should return true when element is checked against itself', () => {
      expect(uf.isConnected(0, 0)).toBe(true);
      expect(uf.isConnected(5, 5)).toBe(true);
    });

    it('should work correctly after multiple unions', () => {
      uf.union(0, 1);
      uf.union(2, 3);
      uf.union(4, 5);
      uf.union(1, 3);
      uf.union(3, 5);

      // All of 0,1,2,3,4,5 should be connected
      expect(uf.isConnected(0, 5)).toBe(true);
      expect(uf.isConnected(1, 4)).toBe(true);
      expect(uf.isConnected(2, 5)).toBe(true);

      // 6 should not be connected to the group
      expect(uf.isConnected(0, 6)).toBe(false);
    });

    it('should throw RangeError for invalid indices', () => {
      expect(() => uf.isConnected(-1, 5)).toThrow(RangeError);
      expect(() => uf.isConnected(5, -1)).toThrow(RangeError);
      expect(() => uf.isConnected(10, 5)).toThrow(RangeError);
      expect(() => uf.isConnected(5, 10)).toThrow(RangeError);
    });
  });

  describe('getComponentSize()', () => {
    let uf: UnionFind;

    beforeEach(() => {
      uf = new UnionFind(10);
    });

    it('should return 1 for isolated elements', () => {
      expect(uf.getComponentSize(0)).toBe(1);
      expect(uf.getComponentSize(5)).toBe(1);
      expect(uf.getComponentSize(9)).toBe(1);
    });

    it('should return correct size after union', () => {
      uf.union(0, 1);

      expect(uf.getComponentSize(0)).toBe(2);
      expect(uf.getComponentSize(1)).toBe(2);
    });

    it('should update size correctly for multiple unions', () => {
      uf.union(0, 1);
      uf.union(1, 2);

      expect(uf.getComponentSize(0)).toBe(3);
      expect(uf.getComponentSize(1)).toBe(3);
      expect(uf.getComponentSize(2)).toBe(3);
    });

    it('should handle merging two large components', () => {
      // Create component of size 3: {0, 1, 2}
      uf.union(0, 1);
      uf.union(1, 2);

      // Create component of size 2: {5, 6}
      uf.union(5, 6);

      // Merge them
      uf.union(2, 5);

      expect(uf.getComponentSize(0)).toBe(5);
      expect(uf.getComponentSize(1)).toBe(5);
      expect(uf.getComponentSize(2)).toBe(5);
      expect(uf.getComponentSize(5)).toBe(5);
      expect(uf.getComponentSize(6)).toBe(5);
    });

    it('should throw RangeError for invalid index', () => {
      expect(() => uf.getComponentSize(-1)).toThrow(RangeError);
      expect(() => uf.getComponentSize(10)).toThrow(RangeError);
    });
  });

  describe('getComponentCount()', () => {
    let uf: UnionFind;

    beforeEach(() => {
      uf = new UnionFind(10);
    });

    it('should start with n components for n elements', () => {
      expect(uf.getComponentCount()).toBe(10);
    });

    it('should decrease by 1 after each successful union', () => {
      expect(uf.getComponentCount()).toBe(10);

      uf.union(0, 1);
      expect(uf.getComponentCount()).toBe(9);

      uf.union(2, 3);
      expect(uf.getComponentCount()).toBe(8);
    });

    it('should not change when uniting elements in same set', () => {
      uf.union(0, 1);
      uf.union(1, 2);

      expect(uf.getComponentCount()).toBe(8);

      uf.union(0, 2); // Already connected
      expect(uf.getComponentCount()).toBe(8);
    });

    it('should reach 1 when all elements are connected', () => {
      for (let i = 0; i < 9; i++) {
        uf.union(i, i + 1);
      }

      expect(uf.getComponentCount()).toBe(1);
    });
  });

  describe('getParent()', () => {
    let uf: UnionFind;

    beforeEach(() => {
      uf = new UnionFind(5);
    });

    it('should return a copy of the parent array', () => {
      const parent = uf.getParent();

      expect(parent).toEqual([0, 1, 2, 3, 4]);
    });

    it('should return independent copy (not reference)', () => {
      const parent1 = uf.getParent();
      parent1[0] = 999;

      const parent2 = uf.getParent();

      expect(parent2[0]).toBe(0);
    });

    it('should reflect changes after union operations', () => {
      uf.union(0, 1);
      const parent = uf.getParent();

      // Either 0 or 1 should be the parent of the other
      expect(parent[0] === 1 || parent[1] === 0).toBe(true);
    });
  });

  describe('getSize()', () => {
    it('should return the total number of elements', () => {
      expect(new UnionFind(5).getSize()).toBe(5);
      expect(new UnionFind(100).getSize()).toBe(100);
      expect(new UnionFind(1).getSize()).toBe(1);
    });

    it('should not change after union operations', () => {
      const uf = new UnionFind(10);

      expect(uf.getSize()).toBe(10);

      uf.union(0, 1);
      uf.union(2, 3);

      expect(uf.getSize()).toBe(10);
    });
  });

  describe('reset()', () => {
    let uf: UnionFind;

    beforeEach(() => {
      uf = new UnionFind(10);
    });

    it('should reset to initial state', () => {
      uf.union(0, 1);
      uf.union(2, 3);
      uf.union(4, 5);

      uf.reset();

      expect(uf.getComponentCount()).toBe(10);
      expect(uf.getParent()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should allow reuse after reset', () => {
      uf.union(0, 1);
      expect(uf.isConnected(0, 1)).toBe(true);

      uf.reset();
      expect(uf.isConnected(0, 1)).toBe(false);

      uf.union(2, 3);
      expect(uf.isConnected(2, 3)).toBe(true);
      expect(uf.getComponentCount()).toBe(9);
    });

    it('should reset component sizes to 1', () => {
      uf.union(0, 1);
      uf.union(1, 2);

      expect(uf.getComponentSize(0)).toBe(3);

      uf.reset();

      expect(uf.getComponentSize(0)).toBe(1);
      expect(uf.getComponentSize(1)).toBe(1);
      expect(uf.getComponentSize(2)).toBe(1);
    });
  });

  describe('Edge Cases and Stress Tests', () => {
    it('should handle a large number of elements', () => {
      const uf = new UnionFind(1000);

      expect(uf.getSize()).toBe(1000);
      expect(uf.getComponentCount()).toBe(1000);
    });

    it('should handle connecting all elements in a chain', () => {
      const uf = new UnionFind(100);

      for (let i = 0; i < 99; i++) {
        uf.union(i, i + 1);
      }

      expect(uf.getComponentCount()).toBe(1);
      expect(uf.isConnected(0, 99)).toBe(true);
      expect(uf.getComponentSize(0)).toBe(100);
    });

    it('should handle star topology (all connected to center)', () => {
      const uf = new UnionFind(100);

      for (let i = 1; i < 100; i++) {
        uf.union(0, i);
      }

      expect(uf.getComponentCount()).toBe(1);
      expect(uf.getComponentSize(0)).toBe(100);
    });

    it('should maintain correctness with random operations', () => {
      const uf = new UnionFind(50);

      // Perform random unions
      const pairs = [
        [0, 5],
        [5, 10],
        [10, 15],
        [20, 25],
        [25, 30],
        [35, 40],
        [40, 45],
      ];

      pairs.forEach(([a, b]) => {
        uf.union(a, b);
      });

      // Verify expected connections
      expect(uf.isConnected(0, 15)).toBe(true);
      expect(uf.isConnected(20, 30)).toBe(true);
      expect(uf.isConnected(35, 45)).toBe(true);

      // Verify expected disconnections
      expect(uf.isConnected(0, 20)).toBe(false);
      expect(uf.isConnected(15, 35)).toBe(false);
    });
  });
});
