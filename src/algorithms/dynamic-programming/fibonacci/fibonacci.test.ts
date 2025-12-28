import { describe, it, expect } from 'vitest';
import { fibonacciMemo, fibonacciDP, fibonacciOptimized } from './fibonacci';

describe('Fibonacci Implementations', () => {
  // Known Fibonacci sequence values for testing
  const fibSequence = [
    { n: 0, expected: 0 },
    { n: 1, expected: 1 },
    { n: 2, expected: 1 },
    { n: 3, expected: 2 },
    { n: 4, expected: 3 },
    { n: 5, expected: 5 },
    { n: 6, expected: 8 },
    { n: 7, expected: 13 },
    { n: 8, expected: 21 },
    { n: 9, expected: 34 },
    { n: 10, expected: 55 },
    { n: 15, expected: 610 },
    { n: 20, expected: 6765 },
  ];

  describe('fibonacciMemo', () => {
    it.each(fibSequence)(
      'should return $expected for n = $n',
      ({ n, expected }) => {
        expect(fibonacciMemo(n)).toBe(expected);
      },
    );

    it('should handle base case n = 0', () => {
      expect(fibonacciMemo(0)).toBe(0);
    });

    it('should handle base case n = 1', () => {
      expect(fibonacciMemo(1)).toBe(1);
    });

    it('should use memoization effectively', () => {
      const memo = new Map<number, number>();
      fibonacciMemo(10, memo);

      // Memo should contain values from 2 to 10
      expect(memo.size).toBeGreaterThan(0);
      expect(memo.has(10)).toBe(true);
      expect(memo.get(10)).toBe(55);
    });

    it('should work with provided memo', () => {
      const memo = new Map<number, number>();
      memo.set(5, 5);

      const result = fibonacciMemo(6, memo);
      expect(result).toBe(8);
    });

    it('should handle larger values', () => {
      expect(fibonacciMemo(30)).toBe(832040);
    });
  });

  describe('fibonacciDP', () => {
    it.each(fibSequence)(
      'should return $expected for n = $n',
      ({ n, expected }) => {
        expect(fibonacciDP(n)).toBe(expected);
      },
    );

    it('should handle base case n = 0', () => {
      expect(fibonacciDP(0)).toBe(0);
    });

    it('should handle base case n = 1', () => {
      expect(fibonacciDP(1)).toBe(1);
    });

    it('should handle larger values', () => {
      expect(fibonacciDP(30)).toBe(832040);
    });

    it('should produce consistent results', () => {
      const n = 12;
      const result1 = fibonacciDP(n);
      const result2 = fibonacciDP(n);

      expect(result1).toBe(result2);
    });
  });

  describe('fibonacciOptimized', () => {
    it.each(fibSequence)(
      'should return $expected for n = $n',
      ({ n, expected }) => {
        expect(fibonacciOptimized(n)).toBe(expected);
      },
    );

    it('should handle base case n = 0', () => {
      expect(fibonacciOptimized(0)).toBe(0);
    });

    it('should handle base case n = 1', () => {
      expect(fibonacciOptimized(1)).toBe(1);
    });

    it('should handle larger values', () => {
      expect(fibonacciOptimized(30)).toBe(832040);
    });

    it('should produce consistent results', () => {
      const n = 12;
      const result1 = fibonacciOptimized(n);
      const result2 = fibonacciOptimized(n);

      expect(result1).toBe(result2);
    });
  });

  describe('All implementations should produce same results', () => {
    it.each(fibSequence)(
      'should all return $expected for n = $n',
      ({ n, expected }) => {
        const memoResult = fibonacciMemo(n);
        const dpResult = fibonacciDP(n);
        const optimizedResult = fibonacciOptimized(n);

        expect(memoResult).toBe(expected);
        expect(dpResult).toBe(expected);
        expect(optimizedResult).toBe(expected);
        expect(memoResult).toBe(dpResult);
        expect(dpResult).toBe(optimizedResult);
      },
    );

    it('should all produce same results for larger values', () => {
      const testValues = [25, 30, 35];

      testValues.forEach((n) => {
        const memoResult = fibonacciMemo(n);
        const dpResult = fibonacciDP(n);
        const optimizedResult = fibonacciOptimized(n);

        expect(memoResult).toBe(dpResult);
        expect(dpResult).toBe(optimizedResult);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle small consecutive values correctly', () => {
      for (let i = 0; i < 10; i++) {
        const memoResult = fibonacciMemo(i);
        const dpResult = fibonacciDP(i);
        const optimizedResult = fibonacciOptimized(i);

        expect(memoResult).toBe(dpResult);
        expect(dpResult).toBe(optimizedResult);
      }
    });

    it('should handle repeated calls with same value', () => {
      const n = 8;
      const results = [
        fibonacciMemo(n),
        fibonacciMemo(n),
        fibonacciDP(n),
        fibonacciDP(n),
        fibonacciOptimized(n),
        fibonacciOptimized(n),
      ];

      const expected = 21;
      results.forEach((result) => {
        expect(result).toBe(expected);
      });
    });
  });
});
