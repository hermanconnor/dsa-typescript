# What is Dynamic Programming?

Dynamic Programming (DP) is a method used to solve complex problems by breaking them down into simpler, overlapping subproblems. Its core goal is to solve each subproblem only once and store the result, thereby avoiding redundant computations and significantly improving efficiency, especially for problems that would otherwise have exponential time complexity.

## Key Concepts of Dynamic Programming

1. **Optimal Substructure**:
   The problem can be broken down into smaller subproblems that can be solved independently and combined to solve the original problem. This means that the solution to the larger problem can be constructed from solutions to smaller subproblems.

2. **Overlapping Subproblems**:
   This occurs when the same subproblems are solved multiple times. Instead of recalculating the same solution over and over, dynamic programming stores the results of these subproblems to reuse them. This is typically done in a **memoization** or **tabulation** manner.

## Two Main Approaches

Dynamic Programming is implemented using two primary methods for storing and reusing subproblem solutions:

### 1. Memoization (Top-Down)

- **Approach:** This method uses **recursion** starting from the main problem and going "down" to the subproblems.
- **Storage:** It uses a cache (like an array or hash map) to **store the results** of subproblems as they are computed. Before making a recursive call, it first checks the cache; if the solution is already there, it returns the stored value instead of recalculating.
- **Analogy:** It's like solving a problem recursively, but keeping a memo pad of all the answers you've already figured out.

### 2. Tabulation (Bottom-Up)

- **Approach:** This method uses an **iterative** approach, starting from the smallest, most trivial subproblems and working "up" to the main problem.
- **Storage:** It typically fills an array or table (the **DP table**) with the solutions for all necessary subproblems in a systematic order. The solution for a larger subproblem is directly computed from the already-computed solutions of smaller subproblems.
- **Analogy:** It's like filling out a table in order, row by row, where each new entry only depends on the entries you've already completed.

### Why use Dynamic Programming?

Dynamic programming can make previously intractable problems solvable by reducing the time complexity from exponential or factorial to something more manageable like O(n) or O(n^2).
