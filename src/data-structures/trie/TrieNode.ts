class TrieNode {
  private children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map<string, TrieNode>();
    this.isEndOfWord = false;
  }

  getChild(char: string): TrieNode | undefined {
    return this.children.get(char);
  }

  setChild(char: string, node: TrieNode): void {
    this.children.set(char, node);
  }

  hasChild(char: string): boolean {
    return this.children.has(char);
  }

  getChildren(): Map<string, TrieNode> {
    return this.children;
  }
}

export default TrieNode;
