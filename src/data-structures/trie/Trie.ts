/**
 * Represents a node in the Trie data structure.
 */
class Node {
  children: Map<string, Node>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map<string, Node>();
    this.isEndOfWord = false;
  }
}

/**
 * A Trie (prefix tree) data structure for efficient string storage and retrieval.
 * Supports insertion, deletion, search, prefix matching, and autocomplete operations.
 */
class Trie {
  private root: Node;

  /**
   * Creates a new Trie instance.
   * @constructor
   * @timeComplexity O(1)
   * @spaceComplexity O(1)
   */
  constructor() {
    this.root = new Node();
  }

  /**
   * Inserts a word into the Trie.
   * @param {string} word - The word to insert
   * @returns {void}
   * @timeComplexity O(m) where m is the length of the word
   * @spaceComplexity O(m) in worst case when all characters need new nodes
   * @example
   * trie.insert("hello");
   * trie.insert("world");
   */
  insert(word: string): void {
    if (!word) return;

    let currentNode = this.root;
    for (const char of word) {
      let childNode = currentNode.children.get(char);
      if (!childNode) {
        childNode = new Node();
        currentNode.children.set(char, childNode);
      }
      currentNode = childNode;
    }
    currentNode.isEndOfWord = true;
  }

  /**
   * Searches for an exact word match in the Trie.
   * @param {string} word - The word to search for
   * @returns {boolean} True if the word exists in the Trie, false otherwise
   * @timeComplexity O(m) where m is the length of the word
   * @spaceComplexity O(1)
   * @example
   * trie.search("hello"); // true if "hello" was inserted
   * trie.search("hell");  // false if only "hello" was inserted
   */
  search(word: string): boolean {
    const node = this.findNode(word);

    return node !== null && node.isEndOfWord;
  }

  /**
   * Checks if any word in the Trie starts with the given prefix.
   * @param {string} prefix - The prefix to search for
   * @returns {boolean} True if at least one word starts with the prefix
   * @timeComplexity O(m) where m is the length of the prefix
   * @spaceComplexity O(1)
   * @example
   * trie.startsWith("hel"); // true if "hello" was inserted
   */
  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== null;
  }

  /**
   * Helper method to find a node corresponding to a given prefix/word.
   * @private
   * @param {string} prefix - The prefix to traverse
   * @returns {Node | null} The node at the end of the prefix, or null if not found
   * @timeComplexity O(m) where m is the length of the prefix
   * @spaceComplexity O(1)
   */
  private findNode(prefix: string): Node | null {
    let currentNode = this.root;

    for (const char of prefix) {
      const childNode = currentNode.children.get(char);
      if (!childNode) return null;
      currentNode = childNode;
    }

    return currentNode;
  }

  /**
   * Returns all words in the Trie that start with the given prefix.
   * @param {string} prefix - The prefix to match (empty string returns all words up to maxResults)
   * @param {number} [maxResults=100] - Maximum number of results to return
   * @returns {string[]} Array of words matching the prefix
   * @timeComplexity O(p + n*k) where p is prefix length, n is number of matching words, k is average word length
   * @spaceComplexity O(n*k) for storing results
   * @example
   * trie.autocomplete("he"); // ["hello", "help", "hero"]
   * trie.autocomplete("he", 2); // ["hello", "help"] (limited to 2 results)
   * trie.autocomplete(""); // [] (returns empty array, use getAllWords() instead)
   */
  autocomplete(prefix: string, maxResults: number = 100): string[] {
    const results: string[] = [];

    // For empty prefix with getAllWords(), start from root
    const startNode = prefix === '' ? this.root : this.findNode(prefix);
    if (!startNode) return results;

    const dfs = (node: Node, currentWord: string): boolean => {
      if (results.length >= maxResults) return false;

      if (node.isEndOfWord) {
        results.push(prefix + currentWord);
        if (results.length >= maxResults) return false;
      }

      for (const [char, child] of node.children) {
        if (!dfs(child, currentWord + char)) return false;
      }

      return true;
    };

    dfs(startNode, '');

    return results;
  }

  /**
   * Deletes a word from the Trie, removing unnecessary nodes.
   * @param {string} word - The word to delete
   * @returns {boolean} True if the word was found and deleted, false otherwise
   * @timeComplexity O(m) where m is the length of the word
   * @spaceComplexity O(m) for storing the path during deletion
   * @example
   * trie.delete("hello"); // true if "hello" existed
   * trie.delete("world"); // false if "world" didn't exist
   */
  delete(word: string): boolean {
    if (!word) return false;

    const path: Array<{ node: Node; char: string }> = [];
    let currentNode = this.root;

    // Build the path
    for (const char of word) {
      const childNode = currentNode.children.get(char);
      if (!childNode) return false;

      path.push({ node: currentNode, char });
      currentNode = childNode;
    }

    // Word doesn't exist
    if (!currentNode.isEndOfWord) return false;

    // If node has children, just unmark it
    if (currentNode.children.size > 0) {
      currentNode.isEndOfWord = false;

      return true;
    }

    // Backtrack and delete nodes
    for (let i = path.length - 1; i >= 0; i--) {
      const { node, char } = path[i];
      node.children.delete(char);

      // Stop if parent has other children or is end of another word
      if (node.isEndOfWord || node.children.size > 0) break;
    }

    return true;
  }

  /**
   * Returns all words stored in the Trie.
   * @returns {string[]} Array of all words in the Trie
   * @timeComplexity O(n*k) where n is number of words, k is average word length
   * @spaceComplexity O(n*k) for storing all words
   * @example
   * trie.getAllWords(); // ["hello", "help", "world"]
   */
  getAllWords(): string[] {
    return this.autocomplete('', Infinity);
  }

  /**
   * Returns the total number of words in the Trie.
   * @returns {number} Count of words in the Trie
   * @timeComplexity O(n) where n is the total number of nodes
   * @spaceComplexity O(h) where h is the height of the Trie (call stack depth)
   * @example
   * trie.size(); // 3 if three words are stored
   */
  size(): number {
    let count = 0;

    const dfs = (node: Node): void => {
      if (node.isEndOfWord) count++;
      for (const child of node.children.values()) {
        dfs(child);
      }
    };

    dfs(this.root);

    return count;
  }
}

export default Trie;
