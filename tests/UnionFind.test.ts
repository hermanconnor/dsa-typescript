import { beforeEach, describe, expect, it } from 'vitest';
import UnionFind from '../src/data-structures/union-find/UnionFind';

describe('UnionFind', () => {
  let uf: UnionFind;

  beforeEach(() => {
    uf = new UnionFind(5);
  });

  it('should initialize each element as its own parent', () => {
    for (let i = 0; i < 5; i++) {
      expect(uf.find(i)).toBe(i);
    }
  });

  it('find should compress path during find operation', () => {
    uf.union(0, 1);
    uf.union(1, 2);
    uf.union(2, 3);
    uf.union(3, 4);

    const parent = uf.getParent();

    // After these unions, 0 should be the root of all
    expect(uf.find(4)).toBe(uf.find(0)); // 0 should be the root

    // Path compression: After the find, 4 should directly point to 0
    expect(parent[4]).toBe(0);
  });

  it('union should union two sets and make them connected', () => {
    uf.union(0, 1);

    expect(uf.isConnected(0, 1)).toBe(true);
    expect(uf.find(0)).toBe(uf.find(1)); // Check they are part of the same set
  });

  it('union should not change the structure when unioning already connected elements', () => {
    uf.union(0, 1);

    const root0Before = uf.find(0);
    const root1Before = uf.find(1);
    uf.union(0, 1);

    expect(uf.find(0)).toBe(root0Before);
    expect(uf.find(1)).toBe(root1Before);
  });

  it('union should apply union by rank', () => {
    uf.union(0, 1);
    uf.union(2, 3);
    uf.union(1, 2);

    expect(uf.find(3)).toBe(uf.find(0));
  });

  it('isConnected should return true for connected elements', () => {
    uf.union(0, 1);
    uf.union(1, 2);

    expect(uf.isConnected(0, 2)).toBe(true);
    expect(uf.isConnected(0, 3)).toBe(false);
  });

  it('should handle the case with a single element', () => {
    const uf = new UnionFind(1);

    expect(uf.find(0)).toBe(0); // Only one element, it should be its own root
    expect(uf.isConnected(0, 0)).toBe(true); // It should be connected to itself
  });

  it('find should throw an error when finding an invalid element index', () => {
    expect(() => uf.find(-1)).toThrowError('Element index -1 is out of bounds');
    expect(() => uf.find(5)).toThrowError('Element index 5 is out of bounds');
  });

  it('union should throw an error when unioning with an invalid element index', () => {
    expect(() => uf.union(-1, 0)).toThrowError(
      'Element index -1 or 0 is out of bounds',
    );

    expect(() => uf.union(0, 5)).toThrowError(
      'Element index 0 or 5 is out of bounds',
    );

    expect(() => uf.union(5, 6)).toThrowError(
      'Element index 5 or 6 is out of bounds',
    );
  });

  it('union should throw an error when trying to union with an out-of-bounds index', () => {
    expect(() => uf.union(2, 6)).toThrowError(
      'Element index 2 or 6 is out of bounds',
    );
  });

  it('should correctly handle multiple union', () => {
    const uf = new UnionFind(10);
    uf.union(0, 1);
    uf.union(1, 2);
    uf.union(3, 4);
    uf.union(2, 4); // Now 0, 1, 2, 3, 4 should all be connected

    expect(uf.isConnected(0, 4)).toBe(true);
    expect(uf.isConnected(0, 5)).toBe(false);
  });

  it('should return true when all elements are connected', () => {
    uf.union(0, 1);
    uf.union(1, 2);
    uf.union(2, 3);
    uf.union(3, 4);

    expect(uf.isConnected(0, 4)).toBe(true);
  });

  it('should handle union of multiple pairs independently', () => {
    const uf = new UnionFind(10);

    uf.union(0, 1);
    uf.union(2, 3);
    uf.union(4, 5);

    expect(uf.isConnected(0, 1)).toBe(true);
    expect(uf.isConnected(2, 3)).toBe(true);
    expect(uf.isConnected(0, 2)).toBe(false);
  });
});
