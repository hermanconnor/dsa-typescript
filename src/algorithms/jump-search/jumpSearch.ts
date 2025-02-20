export function jumpSearch(arr: number[], target: number): number {
  const n = arr.length;

  if (n === 0) return -1;

  let step = Math.floor(Math.sqrt(n)); // Calculate the step size (block size)
  let prev = 0; // Keep track of the previous jump point

  // Jump ahead by the step size in each iteration
  while (prev < n && arr[Math.min(step, n) - 1] < target) {
    // If the value at the current step is less than the target, jump ahead by another step
    prev = step; // Set prev to the current step (this will be the starting point for the next jump)
    step += Math.floor(Math.sqrt(n)); // Increase the step by another block size

    // If prev exceeds or goes beyond the array length, the target is not in the array
    if (prev >= n) {
      return -1;
    }
  }

  // If we found a block where the target might be, we perform a linear search within that block
  for (let i = prev; i < Math.min(step, n); i++) {
    if (arr[i] === target) {
      return i;
    }
  }

  // Target not found
  return -1;
}
