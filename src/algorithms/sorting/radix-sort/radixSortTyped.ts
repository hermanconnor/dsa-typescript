/**
 * Radix Sort optimized for Typed Arrays (Uint32Array) using base-256 (byte-wise) passes.
 *
 * Typed Arrays offer better performance for raw number manipulation in JavaScript
 * environments (e.g., Node.js or WebAssembly). This version uses Uint32Array,
 * which is explicitly non-negative, and is optimized for 32-bit integers.
 *
 * @param {Uint32Array} arr The Uint32Array of non-negative 32-bit integers to be sorted.
 * @returns {Uint32Array} The sorted Uint32Array.
 * @complexity Time: O(K * N), where K=4. O(K * (N + B)) where B=256.
 * @complexity Space: O(N + B) for the output and count typed arrays.
 */
export function radixSortTyped(arr: Uint32Array): Uint32Array {
  const n = arr.length;

  if (n <= 1) return arr;

  // Find max value
  let max = 0;
  for (let i = 0; i < n; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }

  // Use Typed Arrays for auxiliary structures: output and count
  let output: Uint32Array = new Uint32Array(n);
  const count = new Uint32Array(256); // Base-256 radix

  // 4 passes for 32-bit integers
  for (let shift = 0; shift < 32; shift += 8) {
    // Early exit optimization
    if (max >> shift === 0) break;

    count.fill(0);

    // --- 1. Counting Phase ---
    for (let i = 0; i < n; i++) {
      // Extracts the relevant byte (0-255)
      count[(arr[i] >> shift) & 0xff]++;
    }

    // --- 2. Cumulative Count Phase ---
    for (let i = 1; i < 256; i++) {
      count[i] += count[i - 1];
    }

    // --- 3. Placement Phase (Stable Sort) ---
    for (let i = n - 1; i >= 0; i--) {
      const byte = (arr[i] >> shift) & 0xff;
      // Use the cumulative count to find the correct, stable position.
      output[--count[byte]] = arr[i];
    }

    // Swap references (the key to making this version performant by avoiding data copy)
    // arr holds the partially sorted data from 'output' now, and 'output' becomes the next scratchpad.
    const temp = arr;
    arr = output;
    output = temp;
  }

  // The result is in 'arr'
  return arr;
}
