/**
 * High-performance version of Radix Sort using base-256 (byte-wise) passes.
 *
 * Base-256 is efficient for standard 32-bit integers because the number of passes (K)
 * is fixed and small (4 passes: 4 bytes * 8 bits/byte = 32 bits), while the radix (B=256)
 * is still manageable.
 *
 * @param {number[]} arr The array of non-negative integers (assumes 32-bit integers) to be sorted.
 * @returns {number[]} The sorted array.
 * @complexity Time: O(K * N), where N is the number of elements and K is the
 * fixed number of passes (K=4 for 32-bit integers). More precisely O(K * (N + B))
 * where B is the radix (here B=256).
 * @complexity Space: O(N + B) for the output and count arrays.
 */
export function radixSortBase256(arr: number[]): number[] {
  const n = arr.length;

  if (n <= 1) return arr;

  // Find max to determine if we can skip some passes
  let max = arr[0];
  for (let i = 1; i < n; i++) {
    if (arr[i] > max) max = arr[i];
  }

  // Pointers for the two working buffers (source and destination)
  let src = arr;
  let dst = new Array(n);
  // Count array (size 256 for base-256 bytes 0-255).
  const count = new Array(256);

  // Sort by each byte (4 passes for 32-bit integers: shift 0, 8, 16, 24)
  for (let shift = 0; shift < 32; shift += 8) {
    // Optimization: Early exit if all remaining more-significant bits are zero.
    if (max >> shift === 0) break;

    count.fill(0); // Reset count array for the current byte pass

    // --- 1. Counting Phase ---
    // Count occurrences of each byte value (0-255) at the current 'shift' position.
    for (let i = 0; i < n; i++) {
      // (src[i] >> shift) extracts the byte starting at 'shift' position.
      // & 0xff masks it to get the value in the 0-255 range.
      count[(src[i] >> shift) & 0xff]++;
    }

    // --- 2. Cumulative Count Phase ---
    // Compute cumulative count to get starting positions.
    for (let i = 1; i < 256; i++) {
      count[i] += count[i - 1];
    }

    // --- 3. Placement Phase ---
    // Build the destination array (dst) from the source array (src).
    // Iterating backwards ensures stability.
    for (let i = n - 1; i >= 0; i--) {
      const byte = (src[i] >> shift) & 0xff;
      // Place the element at the position indicated by the cumulative count.
      dst[--count[byte]] = src[i];
    }

    // Swap buffers: the sorted data is now in 'src', and 'dst' is the scratchpad for the next pass.
    [src, dst] = [dst, src];
  }

  // The final result is in 'src'.
  return src;
}
