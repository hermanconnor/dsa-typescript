import TrieNode from './TrieNode';

class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let currentNode = this.root;

    for (const char of word) {
      let childNode = currentNode.getChild(char);

      if (!childNode) {
        childNode = new TrieNode();
        currentNode.setChild(char, childNode);
      }

      currentNode = childNode;
    }

    currentNode.isEndOfWord = true;
  }

  search(word: string): boolean {
    let currentNode = this.root;

    for (const char of word) {
      const childNode = currentNode.getChild(char);

      if (!childNode) return false;

      currentNode = childNode;
    }

    return currentNode.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    let currentNode = this.root;

    for (const char of prefix) {
      const childNode = currentNode.getChild(char);

      if (!childNode) return false;

      currentNode = childNode;
    }

    return true;
  }

  public autocomplete(prefix: string): string[] {
    if (!prefix) return [];

    const results: string[] = [];
    let currentNode = this.root;

    // Traverse to the end of the prefix
    for (const char of prefix) {
      const childNode = currentNode.getChild(char);
      if (!childNode) return []; // No words with this prefix

      currentNode = childNode;
    }

    // Helper function to recursively find words
    const findWords = (node: TrieNode, currentWord: string) => {
      if (node.isEndOfWord) {
        results.push(prefix + currentWord); // Add the complete word
      }

      // Traverse the children nodes and continue the search for other possible completions
      for (const [char, child] of node.getChildren()) {
        findWords(child, currentWord + char);
      }
    };

    findWords(currentNode, ''); // Start the recursive search

    return results;
  }

  delete(word: string): void {
    let currentNode = this.root;
    const path: TrieNode[] = []; // Store the path to the node

    // 1. Find the node corresponding to the word
    for (const char of word) {
      const childNode = currentNode.getChild(char);
      if (!childNode) return; // Word not found

      path.push(currentNode); // Store the current node in the path
      currentNode = childNode;
    }

    // 2. Word not found
    if (!currentNode.isEndOfWord) return;

    // 3. Case 1: Node has children
    if (currentNode.getChildren().size > 0) {
      currentNode.isEndOfWord = false; // Just mark as not end of word
      return;
    }

    // 4. Case 2: Node has no children (leaf node)
    // Backtrack and delete nodes until a node with children or isEndOfWord is encountered
    let i = path.length - 1;
    while (i >= 0) {
      const parentNode = path[i];
      const charToDelete = word[i]; // Correct char to delete from parent

      parentNode.getChildren().delete(charToDelete); // Remove the child

      if (parentNode.isEndOfWord || parentNode.getChildren().size > 0) {
        break; // Stop backtracking
      }

      i--;
    }
  }
}

export default Trie;
