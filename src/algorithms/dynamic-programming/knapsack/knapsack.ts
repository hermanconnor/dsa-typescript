/**
The Problem

You have a knapsack with a weight capacity and a set of items. Each item has:

- A weight
- A value

You want to maximize the total value without exceeding the weight capacity. The "0-1" means you can either take an item or leave it (no partial items or duplicates).

Example:

- Capacity: 10 kg
- Items:
  - Item 1: weight=2, value=6
  - Item 2: weight=2, value=10
  - Item 3: weight=3, value=12
  
- Answer: Take items 2 and 3 → total value = 22, total weight = 5
 */

interface Item {
  weight: number;
  value: number;
  name?: string;
}

// Time Complexity: O(n * capacity)
// Space Complexity: O(n * capacity)
export function knapsack(items: Item[], capacity: number): number {
  const n = items.length;

  // Step 1: Create 2D DP table
  // dp[i][w] = max value using first i items with capacity w
  const dp: number[][] = Array(n + 1)
    .fill(0)
    .map(() => Array(capacity + 1).fill(0));

  // 2. Start filling the table
  // i represents the current item we are considering
  for (let i = 1; i <= n; i++) {
    const currentItem = items[i - 1]; // Get the actual item data

    // w represents the "current capacity" of an imaginary smaller bag
    for (let w = 0; w <= capacity; w++) {
      // OPTION A: Don't take the item
      // The value remains whatever we could get with the PREVIOUS item at this weight.
      const dontTake = dp[i - 1][w];

      let take = 0;
      // OPTION B: Take the item (if it fits!)
      if (currentItem.weight <= w) {
        // Find how much space is left if we put this item in
        const remainingCapacity = w - currentItem.weight;

        // Total value = This item's value + best value we found earlier for the remaining space
        take = currentItem.value + dp[i - 1][remainingCapacity];
      }

      // 3. Decision Time
      // Store the winner (the higher value) in our table for this item/weight combo
      dp[i][w] = Math.max(dontTake, take);
    }
  }

  // 4. The Answer
  // The very last cell in the table holds the maximum value for all items and full capacity.
  return dp[n][capacity];
}

// ============================================
// SPACE OPTIMIZED VERSION
// Space-optimized version using only 1D array
// Since we only need the previous row, we can optimize to O(capacity)
// ============================================

// Time Complexity: O(n * capacity)
// Space Complexity: O(capacity)
export function knapsackOptimized(items: Item[], capacity: number): number {
  // 1. Create a single row of memory
  // Instead of a full grid, we just track the best value for each weight 0 to 'capacity'.
  const dp: number[] = Array(capacity + 1).fill(0);

  // 2. Look at each item one by one
  for (const item of items) {
    // 3. Iterate BACKWARDS
    // We start from the maximum capacity and work down to the item's weight.
    for (let w = capacity; w >= item.weight; w--) {
      // dp[w] (on the right) is the "old" value from the previous item.
      // item.value + dp[w - item.weight] is the "new" potential value.

      // We update the current spot with whichever is better.
      dp[w] = Math.max(dp[w], item.value + dp[w - item.weight]);
    }
  }

  // 4. The result is the very last number in our list.
  return dp[capacity];
}
