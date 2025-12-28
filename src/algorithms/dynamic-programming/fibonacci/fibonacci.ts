/**
The Problem

Find the nth Fibonacci number, where:

- F(0) = 0
- F(1) = 1
- F(n) = F(n-1) + F(n-2)

 */

// ============================================
// APPROACH 1: TOP-DOWN with MEMOIZATION
// ============================================
// Time Complexity: O(n)
// Space Complexity: O(n)
export function fibonacciMemo(
  n: number,
  memo: Map<number, number> = new Map(),
): number {
  // Base cases
  if (n <= 1) return n;

  // Check if we've already calculated this
  if (memo.has(n)) {
    return memo.get(n)!;
  }

  // Calculate and store in memo
  const result = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  memo.set(n, result);

  return result;
}

// ============================================
// APPROACH 2: BOTTOM-UP TABULATION
// ============================================
// Time Complexity: O(n)
// Space Complexity: O(n)
export function fibonacciDP(n: number): number {
  if (n <= 1) return n;

  // Create a table to store results
  const dp: number[] = Array(n + 1).fill(0);

  // Base cases
  dp[0] = 0;
  dp[1] = 1;

  // Build up from the bottom
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

// ============================================
// APPROACH 3: SPACE-OPTIMIZED
// ============================================
// Time Complexity: O(n)
// Space Complexity: O(1)
export function fibonacciOptimized(n: number): number {
  if (n <= 1) return n;

  // We only need the last two values
  let prev2 = 0; // F(n-2)
  let prev1 = 1; // F(n-1)

  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    // Shift the window forward
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}
