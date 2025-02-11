import { beforeEach, describe, expect, it } from 'vitest';
import HashTable from '../src/data-structures/hash-table/HashTable';

describe('HashTable', () => {
  let hashTable: HashTable<string, number>;

  beforeEach(() => {
    hashTable = new HashTable();
  });

  it('set should insert a key-value pair', () => {
    hashTable.set('car', 1);

    expect(hashTable.get('car')).toBe(1);
  });

  it('set should update the value for an existing key', () => {
    hashTable.set('car', 1);
    hashTable.set('car', 10);

    expect(hashTable.get('car')).toBe(10);
  });

  it('get should return undefined for a non-existent key', () => {
    expect(hashTable.get('boat')).toBeUndefined();
  });

  it('get should retrieve a key-value pair', () => {
    hashTable.set('car', 1);
    hashTable.set('bike', 2);

    expect(hashTable.get('car')).toBe(1);
    expect(hashTable.get('bike')).toBe(2);
  });

  it('delete should not delete anything if the key does not exist', () => {
    hashTable.delete('airplane');

    expect(hashTable.get('airplane')).toBeUndefined(); // Should still be undefined
  });

  it('delete should delete a key-value pair', () => {
    hashTable.set('car', 1);
    hashTable.delete('car');

    expect(hashTable.get('car')).toBeUndefined();
  });

  it('should handle empty string as key', () => {
    hashTable.set('', 0);

    expect(hashTable.get('')).toBe(0);
  });

  it('should handle number keys', () => {
    const hashTable = new HashTable<number, string>();

    hashTable.set(1, 'one');
    expect(hashTable.get(1)).toBe('one');
  });

  it('should handle object keys (if applicable)', () => {
    const objectHashTable = new HashTable<object, boolean>();
    const keyObj = { name: 'test' };

    objectHashTable.set(keyObj, true);

    expect(objectHashTable.get(keyObj)).toBe(true);
  });

  it('resize should resize the table when load factor exceeds threshold', () => {
    const hashTable = new HashTable<string, number>(5); // Start with a small size

    hashTable.set('car', 1);
    hashTable.set('motorcycle', 2);
    hashTable.set('plane', 3);
    hashTable.set('train', 4);
    hashTable.set('boat', 5); // This should likely trigger a resize

    expect(hashTable.size).toBeGreaterThan(5); // Check that it's greater than the initial size

    // Verify that the existing key-value pairs are still accessible
    expect(hashTable.get('car')).toBe(1);
    expect(hashTable.get('motorcycle')).toBe(2);
    expect(hashTable.get('plane')).toBe(3);
    expect(hashTable.get('train')).toBe(4);
    expect(hashTable.get('boat')).toBe(5);
  });

  it('should handle a large number of insertions and retrievals', () => {
    const largeHashTable = new HashTable<number, string>();
    const numItems = 1000;

    for (let i = 0; i < numItems; i++) {
      largeHashTable.set(i, `value${i}`);
    }

    for (let i = 0; i < numItems; i++) {
      expect(largeHashTable.get(i)).toBe(`value${i}`);
    }
  });

  it('should handle collisions correctly', () => {
    // Force a collision (if your hash function allows for it)
    const hashTableWithCollision = new HashTable<string, number>(5); // Small size to increase collision chance
    hashTableWithCollision.set('apple', 1);
    hashTableWithCollision.set('banana', 2); // Assuming 'apple' and 'banana' might collide

    // If you can't guarantee a collision, insert enough items to make collisions probable.
    // In a real hash table, you wouldn't necessarily know which keys collide.
    const manyItemsHashTable = new HashTable<string, number>();
    manyItemsHashTable.set('key1', 1);
    manyItemsHashTable.set('key2', 2);
    manyItemsHashTable.set('key3', 3);
    manyItemsHashTable.set('key4', 4);
    manyItemsHashTable.set('key5', 5);
    manyItemsHashTable.set('key6', 6);
    manyItemsHashTable.set('key7', 7);
    manyItemsHashTable.set('key8', 8);
    manyItemsHashTable.set('key9', 9);
    manyItemsHashTable.set('key10', 10);

    expect(hashTableWithCollision.get('apple')).toBe(1);
    expect(hashTableWithCollision.get('banana')).toBe(2);

    expect(manyItemsHashTable.get('key5')).toBe(5);
  });
});
