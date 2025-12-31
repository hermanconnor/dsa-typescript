import { describe, it, expect } from 'vitest';
import {
  longestCommonSubsequence,
  longestCommonSubsequenceOptimized,
} from './lcs';

describe('longestCommonSubsequence', () => {
  it('should return 0 for empty strings', () => {
    expect(longestCommonSubsequence('', '')).toBe(0);
    expect(longestCommonSubsequence('abc', '')).toBe(0);
    expect(longestCommonSubsequenceOptimized('', '')).toBe(0);
    expect(longestCommonSubsequenceOptimized('abc', '')).toBe(0);
  });

  it('should find LCS for standard examples', () => {
    // "ace" is a subsequence of "abcde"
    expect(longestCommonSubsequence('abcde', 'ace')).toBe(3);
    expect(longestCommonSubsequenceOptimized('abcde', 'ace')).toBe(3);

    // "abc" is a subsequence of "abc"
    expect(longestCommonSubsequence('abc', 'abc')).toBe(3);
    expect(longestCommonSubsequenceOptimized('abc', 'abc')).toBe(3);
  });

  it('should return 0 if there is no common subsequence', () => {
    expect(longestCommonSubsequence('abc', 'def')).toBe(0);
    expect(longestCommonSubsequenceOptimized('abc', 'def')).toBe(0);
  });

  it('should handle cases where text1 is shorter than text2', () => {
    // This tests the internal swap logic for O(min(m, n)) space
    expect(longestCommonSubsequence('ace', 'abcde')).toBe(3);
    expect(longestCommonSubsequenceOptimized('ace', 'abcde')).toBe(3);
  });

  it('should handle repeated characters', () => {
    expect(longestCommonSubsequence('bl', 'yby')).toBe(1);
    expect(longestCommonSubsequence('aaaaa', 'aaa')).toBe(3);
    expect(longestCommonSubsequenceOptimized('bl', 'yby')).toBe(1);
    expect(longestCommonSubsequenceOptimized('aaaaa', 'aaa')).toBe(3);
  });

  it('should work with long strings to verify performance stability', () => {
    const text1 = 'abcdefghij'.repeat(10); // 100 chars
    const text2 = 'acegij'.repeat(10); // 60 chars

    expect(longestCommonSubsequence(text1, text2)).toBe(60);
    expect(longestCommonSubsequenceOptimized(text1, text2)).toBe(60);
  });
});
