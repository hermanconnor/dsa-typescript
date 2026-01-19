/**
 * A function that hashes an item of type T to a number.
 * @template T - The type of item to hash
 */
type HashFunction<T> = (item: T) => number;

/**
 * A space-efficient probabilistic data structure for testing set membership.
 * Bloom filters can tell you definitively if an element is NOT in a set,
 * but can only tell you if an element MIGHT be in a set (with configurable false positive rate).
 *
 * @template T - The type of items stored in the filter (defaults to string)
 *
 * Space Complexity: O(m) where m is the size of the bit array
 * The size m is calculated as: -n*ln(p) / (ln(2)^2) where n is expected items and p is false positive rate
 */
class BloomFilter<T = string> {
  private bits: Uint8Array;
  private readonly size: number;
  private readonly hashCount: number;
  private readonly customHashFn?: HashFunction<T>;

  /**
   * Creates a new Bloom filter optimized for the expected number of items and false positive rate.
   *
   * @param expectedItems - The expected number of items to be added to the filter
   * @param falsePositiveRate - The desired false positive probability (default: 0.01 or 1%)
   * @param hashFn - Optional custom hash function for the items
   *
   * Time Complexity: O(m/8) where m is the calculated bit array size (for initializing the Uint8Array)
   * Space Complexity: O(m/8) for the bit array storage
   */
  constructor(
    expectedItems: number,
    falsePositiveRate: number = 0.01,
    hashFn?: HashFunction<T>,
  ) {
    // m = -n*ln(p) / (ln(2)^2)
    this.size = Math.ceil(
      (-expectedItems * Math.log(falsePositiveRate)) / Math.pow(Math.log(2), 2),
    );

    // k = (m/n) * ln(2)
    this.hashCount = Math.round((this.size / expectedItems) * Math.log(2)) || 1;
    this.bits = new Uint8Array(Math.ceil(this.size / 8));
    this.customHashFn = hashFn;
  }

  /**
   * Adds an item to the Bloom filter by setting k bits (where k is the hash count).
   *
   * @param item - The item to add to the filter
   *
   * Time Complexity: O(k * L) where k is hashCount and L is the length of the stringified item
   * Space Complexity: O(1) - no additional space beyond the existing bit array
   */
  add(item: T): void {
    const { h1, h2 } = this.getHashes(item);

    for (let i = 0; i < this.hashCount; i++) {
      // Kirsch-Mitzenmacher Optimization: h_i(x) = (h1 + i * h2) % m
      const combinedHash = (h1 + i * h2) >>> 0;

      this.setBit(combinedHash % this.size);
    }
  }

  /**
   * Checks if an item might be in the set.
   * Returns false if the item is definitely NOT in the set.
   * Returns true if the item MIGHT be in the set (could be a false positive).
   *
   * @param item - The item to check
   * @returns true if the item might be in the set, false if it's definitely not
   *
   * Time Complexity: O(k * L) where k is hashCount and L is the length of the stringified item
   * Space Complexity: O(1) - no additional space required
   */
  contains(item: T): boolean {
    const { h1, h2 } = this.getHashes(item);

    for (let i = 0; i < this.hashCount; i++) {
      const combinedHash = (h1 + i * h2) >>> 0;

      if (!this.getBit(combinedHash % this.size)) {
        return false;
      }
    }

    return true;
  }

  getStats(): {
    size: number;
    hashCount: number;
    bitsSet: number;
    fillRatio: number;
  } {
    let bitsSet = 0;

    for (let i = 0; i < this.bits.length; i++) {
      let byte = this.bits[i];

      while (byte > 0) {
        byte &= byte - 1;
        bitsSet++;
      }
    }

    return {
      size: this.size,
      hashCount: this.hashCount,
      bitsSet,
      fillRatio: bitsSet / this.size,
    };
  }

  /**
   * Clears all bits in the filter, resetting it to an empty state.
   *
   * Time Complexity: O(m/8) where m is the bit array size
   * Space Complexity: O(1) - modifies existing array in place
   */
  clear(): void {
    this.bits.fill(0);
  }

  /**
   * Converts an item to a string representation for hashing.
   *
   * @param item - The item to stringify
   * @returns A string representation of the item
   *
   * Time Complexity: O(L) where L is the size of the item (for JSON.stringify in worst case)
   * Space Complexity: O(L) for the string representation
   */
  private stringify(item: T): string {
    if (typeof item === 'string') return item;
    if (typeof item === 'number' || typeof item === 'boolean') {
      return String(item);
    }

    return JSON.stringify(item);
  }

  /**
   * FNV-1a hash function implementation.
   *
   * @param str - The string to hash
   * @param seed - The initial hash seed value
   * @returns A 32-bit unsigned integer hash
   *
   * Time Complexity: O(L) where L is the length of the string
   * Space Complexity: O(1) - only uses a single hash variable
   */
  private fnv1a(str: string, seed: number): number {
    let hash = seed;

    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }

    return hash >>> 0;
  }

  /**
   * Generates two hash values using either a custom hash function or FNV-1a.
   * If a custom hash function is provided, it uses that for h1 and
   * a secondary internal hash for h2.
   *
   * @param item - The item to hash
   * @returns An object containing two hash values h1 and h2
   *
   * Time Complexity: O(L) where L is the length of the stringified item
   * Space Complexity: O(L) for the stringified representation (if not using custom hash)
   */
  private getHashes(item: T): { h1: number; h2: number } {
    if (this.customHashFn) {
      const h1 = this.customHashFn(item) >>> 0;
      // Generate a secondary hash by shifting/mixing the first
      const h2 = (h1 ^ (h1 >>> 16)) >>> 0;

      return { h1, h2 };
    }

    const str = this.stringify(item);

    return {
      h1: this.fnv1a(str, 0x811c9dc5),
      h2: this.fnv1a(str, 0x01000193),
    };
  }

  /**
   * Gets the value of a bit at the specified position in the bit array.
   *
   * @param position - The bit position to check (0 to size-1)
   * @returns true if the bit is set, false otherwise
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  private getBit(position: number): boolean {
    return (this.bits[position >> 3] & (1 << (position & 7))) !== 0;
  }

  /**
   * Sets a bit at the specified position in the bit array.
   *
   * @param position - The bit position to set (0 to size-1)
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  private setBit(position: number): void {
    this.bits[position >> 3] |= 1 << (position & 7);
  }
}

export default BloomFilter;
