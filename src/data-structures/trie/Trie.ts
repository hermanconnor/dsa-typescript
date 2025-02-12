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
}

export default Trie;
