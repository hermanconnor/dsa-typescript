import { describe, it, expect, beforeEach } from 'vitest';
import Trie from './Trie';

describe('Trie', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = new Trie();
  });

  describe('constructor', () => {
    it('should create an empty trie', () => {
      expect(trie.size()).toBe(0);
      expect(trie.getAllWords()).toEqual([]);
    });
  });

  describe('insert', () => {
    it('should insert a single word', () => {
      trie.insert('hello');
      expect(trie.search('hello')).toBe(true);
      expect(trie.size()).toBe(1);
    });

    it('should insert multiple words', () => {
      trie.insert('hello');
      trie.insert('world');
      trie.insert('help');
      expect(trie.search('hello')).toBe(true);
      expect(trie.search('world')).toBe(true);
      expect(trie.search('help')).toBe(true);
      expect(trie.size()).toBe(3);
    });

    it('should handle overlapping words', () => {
      trie.insert('hello');
      trie.insert('hell');
      expect(trie.search('hello')).toBe(true);
      expect(trie.search('hell')).toBe(true);
      expect(trie.size()).toBe(2);
    });

    it('should handle duplicate insertions', () => {
      trie.insert('hello');
      trie.insert('hello');
      expect(trie.search('hello')).toBe(true);
      expect(trie.size()).toBe(1);
    });

    it('should handle empty string insertion', () => {
      trie.insert('');
      expect(trie.size()).toBe(0);
    });

    it('should handle single character words', () => {
      trie.insert('a');
      trie.insert('b');
      expect(trie.search('a')).toBe(true);
      expect(trie.search('b')).toBe(true);
      expect(trie.size()).toBe(2);
    });
  });

  describe('search', () => {
    beforeEach(() => {
      trie.insert('hello');
      trie.insert('world');
      trie.insert('help');
    });

    it('should find existing words', () => {
      expect(trie.search('hello')).toBe(true);
      expect(trie.search('world')).toBe(true);
      expect(trie.search('help')).toBe(true);
    });

    it('should not find non-existent words', () => {
      expect(trie.search('hell')).toBe(false);
      expect(trie.search('helping')).toBe(false);
      expect(trie.search('wor')).toBe(false);
    });

    it('should not find prefixes of words', () => {
      expect(trie.search('hel')).toBe(false);
      expect(trie.search('worl')).toBe(false);
    });

    it('should handle empty string search', () => {
      expect(trie.search('')).toBe(false);
    });

    it('should handle case sensitivity', () => {
      trie.insert('Hello');
      expect(trie.search('Hello')).toBe(true);
      expect(trie.search('hello')).toBe(true); // lowercase was inserted earlier
      expect(trie.search('HELLO')).toBe(false);
    });
  });

  describe('startsWith', () => {
    beforeEach(() => {
      trie.insert('hello');
      trie.insert('world');
      trie.insert('help');
    });

    it('should find existing prefixes', () => {
      expect(trie.startsWith('hel')).toBe(true);
      expect(trie.startsWith('wor')).toBe(true);
      expect(trie.startsWith('he')).toBe(true);
    });

    it('should find complete words as prefixes', () => {
      expect(trie.startsWith('hello')).toBe(true);
      expect(trie.startsWith('world')).toBe(true);
    });

    it('should not find non-existent prefixes', () => {
      expect(trie.startsWith('abc')).toBe(false);
      expect(trie.startsWith('wz')).toBe(false);
    });

    it('should handle empty string prefix', () => {
      expect(trie.startsWith('')).toBe(true);
    });
  });

  describe('autocomplete', () => {
    beforeEach(() => {
      trie.insert('hello');
      trie.insert('help');
      trie.insert('helper');
      trie.insert('hero');
      trie.insert('world');
    });

    it('should return all words with matching prefix', () => {
      const results = trie.autocomplete('hel');
      expect(results).toHaveLength(3);
      expect(results).toContain('hello');
      expect(results).toContain('help');
      expect(results).toContain('helper');
    });

    it('should return empty array for non-existent prefix', () => {
      const results = trie.autocomplete('xyz');
      expect(results).toEqual([]);
    });

    it('should limit results to maxResults', () => {
      const results = trie.autocomplete('he', 2);
      expect(results).toHaveLength(2);
    });

    it('should return single word if only one matches', () => {
      const results = trie.autocomplete('world');
      expect(results).toEqual(['world']);
    });

    it('should return all words for empty prefix up to limit', () => {
      const results = trie.autocomplete('', 10);
      expect(results).toHaveLength(5);
      expect(results).toContain('hello');
      expect(results).toContain('help');
      expect(results).toContain('helper');
      expect(results).toContain('hero');
      expect(results).toContain('world');
    });

    it('should handle complete word as prefix', () => {
      const results = trie.autocomplete('help');
      expect(results).toHaveLength(2);
      expect(results).toContain('help');
      expect(results).toContain('helper');
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      trie.insert('hello');
      trie.insert('hell');
      trie.insert('help');
      trie.insert('hero');
    });

    it('should delete a word that exists', () => {
      expect(trie.delete('hello')).toBe(true);
      expect(trie.search('hello')).toBe(false);
      expect(trie.size()).toBe(3);
    });

    it('should not delete a word that does not exist', () => {
      expect(trie.delete('world')).toBe(false);
      expect(trie.size()).toBe(4);
    });

    it('should preserve prefix words when deleting', () => {
      trie.delete('hello');
      expect(trie.search('hell')).toBe(true);
      expect(trie.search('help')).toBe(true);
    });

    it('should not affect longer words when deleting prefix', () => {
      trie.delete('hell');
      expect(trie.search('hello')).toBe(true);
    });

    it('should handle deleting all words', () => {
      trie.delete('hello');
      trie.delete('hell');
      trie.delete('help');
      trie.delete('hero');
      expect(trie.size()).toBe(0);
      expect(trie.getAllWords()).toEqual([]);
    });

    it('should return false for empty string', () => {
      expect(trie.delete('')).toBe(false);
    });

    it('should not delete partial matches', () => {
      expect(trie.delete('hel')).toBe(false);
      expect(trie.search('hello')).toBe(true);
      expect(trie.search('hell')).toBe(true);
    });

    it('should handle deleting word with shared prefix', () => {
      trie.delete('help');
      expect(trie.search('help')).toBe(false);
      expect(trie.search('hello')).toBe(true);
      expect(trie.startsWith('hel')).toBe(true);
    });
  });

  describe('getAllWords', () => {
    it('should return empty array for empty trie', () => {
      expect(trie.getAllWords()).toEqual([]);
    });

    it('should return all words in the trie', () => {
      trie.insert('hello');
      trie.insert('world');
      trie.insert('help');
      const words = trie.getAllWords();
      expect(words).toHaveLength(3);
      expect(words).toContain('hello');
      expect(words).toContain('world');
      expect(words).toContain('help');
    });

    it('should handle nested words', () => {
      trie.insert('cat');
      trie.insert('cats');
      trie.insert('catastrophe');
      const words = trie.getAllWords();
      expect(words).toHaveLength(3);
      expect(words).toContain('cat');
      expect(words).toContain('cats');
      expect(words).toContain('catastrophe');
    });
  });

  describe('size', () => {
    it('should return 0 for empty trie', () => {
      expect(trie.size()).toBe(0);
    });

    it('should return correct count after insertions', () => {
      trie.insert('hello');
      expect(trie.size()).toBe(1);
      trie.insert('world');
      expect(trie.size()).toBe(2);
      trie.insert('help');
      expect(trie.size()).toBe(3);
    });

    it('should not count duplicates', () => {
      trie.insert('hello');
      trie.insert('hello');
      trie.insert('hello');
      expect(trie.size()).toBe(1);
    });

    it('should update count after deletions', () => {
      trie.insert('hello');
      trie.insert('world');
      trie.insert('help');
      expect(trie.size()).toBe(3);
      trie.delete('world');
      expect(trie.size()).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('should handle special characters', () => {
      trie.insert('hello-world');
      trie.insert('test@email');
      expect(trie.search('hello-world')).toBe(true);
      expect(trie.search('test@email')).toBe(true);
    });

    it('should handle numbers', () => {
      trie.insert('test123');
      trie.insert('456test');
      expect(trie.search('test123')).toBe(true);
      expect(trie.search('456test')).toBe(true);
    });

    it('should handle unicode characters', () => {
      trie.insert('café');
      trie.insert('日本語');
      expect(trie.search('café')).toBe(true);
      expect(trie.search('日本語')).toBe(true);
    });

    it('should handle long words', () => {
      const longWord = 'a'.repeat(1000);
      trie.insert(longWord);
      expect(trie.search(longWord)).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('should handle complex workflow', () => {
      // Insert words
      trie.insert('apple');
      trie.insert('application');
      trie.insert('apply');
      trie.insert('banana');

      // Check searches
      expect(trie.search('apple')).toBe(true);
      expect(trie.search('app')).toBe(false);

      // Check autocomplete
      const appWords = trie.autocomplete('app');
      expect(appWords).toHaveLength(3);

      // Delete a word
      trie.delete('apply');
      expect(trie.search('apply')).toBe(false);

      // Verify autocomplete after deletion
      const remainingAppWords = trie.autocomplete('app');
      expect(remainingAppWords).toHaveLength(2);
      expect(remainingAppWords).toContain('apple');
      expect(remainingAppWords).toContain('application');

      // Check size
      expect(trie.size()).toBe(3);
    });

    it('should handle dictionary-like usage', () => {
      const words = ['the', 'there', 'their', 'they', 'them', 'then'];
      words.forEach((word) => trie.insert(word));

      expect(trie.size()).toBe(6);
      expect(trie.autocomplete('the')).toHaveLength(6);
      expect(trie.autocomplete('ther')).toHaveLength(1); // Only 'there'
      expect(trie.autocomplete('thei')).toHaveLength(1); // Only 'their'
      expect(trie.autocomplete('the', 3)).toHaveLength(3); // Limited results

      // Verify specific completions
      const therWords = trie.autocomplete('ther');
      expect(therWords).toContain('there');

      const theiWords = trie.autocomplete('thei');
      expect(theiWords).toContain('their');
    });
  });
});
