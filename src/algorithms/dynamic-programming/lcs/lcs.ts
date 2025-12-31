/**
The Problem

Given two strings, find the length of their longest common subsequence. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous.

Example:

- String 1: "ABCDGH"
- String 2: "AEDFHR"
- LCS: "ADH" (length = 3)
 */

export function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;

  // Step 1: Create a 2D DP table
  // dp[i][j] = LCS length of text1[0...i-1] and text2[0...j-1]
  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));

  // Step 2: Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // If characters match, add 1 to the previous diagonal value
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // If they don't match, take the max of excluding either character
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // The bottom-right cell contains the final answer
  return dp[m][n];
}

// ============================================
// OPTIMIZED VERSION
// Time Complexity: O(m * n), Where 'm' and 'n' are the lengths of text1 and text2.
// Space Complexity: O(min(m, n)), We only maintain a single 1D array of size equal to the shorter string
// ============================================

export function longestCommonSubsequenceOptimized(
  text1: string,
  text2: string,
): number {
  // 1. SWAP OPTIMIZATION
  // We want to use the least amount of memory. Since our memory usage
  // depends on the length of text2, we make sure text2 is the shorter one.
  if (text1.length < text2.length) {
    [text1, text2] = [text2, text1];
  }

  const m = text1.length;
  const n = text2.length;

  // 2. EDGE CASE
  // If one string is empty, the longest common sequence is 0.
  if (n === 0) return 0;

  // 3. THE "MEMORY" ARRAY (DP Table)
  // Instead of a big grid (2D array), we use a single row (1D array).
  // dp[j] stores the best result found so far for text2 up to index j.
  const dp: number[] = new Array(n + 1).fill(0);

  // 4. THE OUTER LOOP (Rows)
  // We iterate through every character of the first string (text1).
  for (let i = 1; i <= m; i++) {
    // This variable acts as the "top-left" neighbor in a traditional grid.
    // It stores the result from the previous row and previous column.
    let prevUpLeft = 0;

    // 5. THE INNER LOOP (Columns)
    // We compare the current character of text1 with every character of text2.
    for (let j = 1; j <= n; j++) {
      // We save the current value before we overwrite it.
      // This "temp" will become the "prevUpLeft" for the next character.
      const temp = dp[j];

      // 6. THE CORE LOGIC
      // If the characters match, we take the result from the "diagonal"
      // (prevUpLeft) and add 1 to it.
      if (text1[i - 1] === text2[j - 1]) {
        dp[j] = prevUpLeft + 1;
      } else {
        // If they DON'T match, we take the best value we've seen so far:
        // either from the spot "above" (dp[j]) or the spot to the "left" (dp[j-1]).
        dp[j] = Math.max(dp[j], dp[j - 1]);
      }

      // Update the diagonal tracker for the next iteration of the inner loop.
      prevUpLeft = temp;
    }
  }

  // 7. THE RESULT
  // The very last number in our array is the length of the longest sequence.
  return dp[n];
}
