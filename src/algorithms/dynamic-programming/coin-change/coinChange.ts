/**
The Problem

Given an array of coin denominations and a target amount, find the minimum number of coins needed to make that amount. If it's impossible, return -1.

Example:

- Coins: [1, 2, 5]
- Amount: 11
- Answer: 3 coins (5 + 5 + 1)
 */

/**
 * Calculates the fewest number of coins needed to make up a given amount.
 * Time Complexity: O(amount * coins.length)
 * We iterate through every amount from 1 to amount, and for each, we check every coin.
 * Space Complexity: O(amount)
 * We create an array (dp) of size amount + 1 to store the intermediate results.
 */
export function coinChange(coins: number[], amount: number): number {
  // Step 1: Create DP array
  // dp[i] = minimum coins needed to make amount i
  const dp: number[] = Array(amount + 1).fill(Infinity);

  // Step 2: Base case - 0 coins needed to make amount 0
  dp[0] = 0;

  // Step 3: Calculate the minimum coins for every sub-amount from 1 up to the target.
  for (let currentAmount = 1; currentAmount <= amount; currentAmount++) {
    // Try every coin denomination available to see if it can help make the currentAmount.
    for (const coin of coins) {
      // Only use the coin if its value isn't larger than the amount we are trying to make.
      if (coin <= currentAmount) {
        // 'remaining' is the balance left after using one 'coin'.
        // We look up 'dp[remaining]' to see the best way we already found to make that balance.
        const remaining = currentAmount - coin;

        // Update the current amount's best (minimum) coin count.
        // It's either the current value OR (1 new coin + whatever coins made the remaining amount).
        dp[currentAmount] = Math.min(dp[currentAmount], dp[remaining] + 1);
      }
    }
  }

  // If the target amount is still Infinity, it means no combination of coins worked.
  // Otherwise, return the calculated minimum stored at dp[amount].
  return dp[amount] === Infinity ? -1 : dp[amount];
}
