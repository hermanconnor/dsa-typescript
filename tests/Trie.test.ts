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

  it('startsWith should handle empty prefixes', () => {
    trie.insert('apple');

    expect(trie.startsWith('')).toBe(true); // Empty prefix should always match
  });

  it('startsWith should handle prefixes that are also words', () => {
    trie.insert('apple');
    trie.insert('app');

    expect(trie.startsWith('app')).toBe(true);
  });
});

describe('Trie autocomplete', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = new Trie();

    trie.insert('apple');
    trie.insert('app');
    trie.insert('apricot');
    trie.insert('banana');
    trie.insert('bat');
    trie.insert('car');
    trie.insert('cat');
  });

  it('should return empty array for no match', () => {
    expect(trie.autocomplete('xyz')).toEqual([]);
    expect(trie.autocomplete('')).toEqual([]);
  });

  it('autocomplete should autocomplete simple prefixes', () => {
    expect(trie.autocomplete('ap')).toEqual(['app', 'apple', 'apricot']);
    expect(trie.autocomplete('b')).toEqual(['banana', 'bat']);
    expect(trie.autocomplete('ca')).toEqual(['car', 'cat']);
  });

  it('autocomplete should autocomplete full words', () => {
    expect(trie.autocomplete('apple')).toEqual(['apple']);
    expect(trie.autocomplete('banana')).toEqual(['banana']);
  });

  it('autocomplete should handle prefixes that are also words', () => {
    expect(trie.autocomplete('app')).toEqual(['app', 'apple']);
  });

  it('autocomplete should handle case where prefix matches no complete word', () => {
    expect(trie.autocomplete('batm')).toEqual([]); // "batm" is a prefix, but not a word
  });

  it('should handle multiple completions', () => {
    expect(trie.autocomplete('a')).toEqual(['app', 'apple', 'apricot']);
  });
});
