type HashFunction<T> = (item: T) => number;

class BloomFilter<T = string> {
  private bits: Uint8Array;
  private readonly size: number;
  private readonly hashCount: number;
  private readonly customHashFn?: HashFunction<T>;

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

  add(item: T): void {}

  contains(item: T): boolean {}

  private fnv1a(str: string, seed: number): number {}

  private getHashes(item: T): { h1: number; h2: number } {}

  private getBit(position: number): boolean {}

  private setBit(position: number): void {}
}

export default BloomFilter;
