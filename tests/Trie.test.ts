import { beforeEach, describe, expect, it } from 'vitest';
import Trie from '../src/data-structures/trie/Trie';

describe('Trie', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = new Trie();
  });

  it('insert should insert a single word', () => {
    trie.insert('hello');

    expect(trie.search('hello')).toBe(true);
  });

  it('insert should insert multiple words', () => {
    trie.insert('apple');
    trie.insert('app');
    trie.insert('banana');

    expect(trie.search('apple')).toBe(true);
    expect(trie.search('app')).toBe(true);
    expect(trie.search('banana')).toBe(true);
  });

  it('insert should handle empty strings', () => {
    trie.insert('');

    expect(trie.search('')).toBe(true);
  });

  it('insert should not insert duplicate words', () => {
    trie.insert('apple');
    trie.insert('apple'); // Insert again

    expect(trie.search('apple')).toBe(true);
  });

  it('search should return true for an existing word', () => {
    trie.insert('apple');

    expect(trie.search('apple')).toBe(true);
  });

  it('search should return false for a non-existing word', () => {
    trie.insert('apple');

    expect(trie.search('orange')).toBe(false);
  });

  it('search should return false for a word that is a prefix but not a complete word', () => {
    trie.insert('apple');

    expect(trie.search('app')).toBe(false);
  });

  it('search should handle empty strings', () => {
    trie.insert('');

    expect(trie.search('')).toBe(true);
    expect(trie.search('a')).toBe(false); // Empty string should not match 'a'
  });

  it('startsWith should return true if a prefix exists', () => {
    trie.insert('apple');

    expect(trie.startsWith('app')).toBe(true);
  });

  it('startsWith should return false if a prefix does not exist', () => {
    trie.insert('apple');

    expect(trie.startsWith('hello')).toBe(false);
  });
});
