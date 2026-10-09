// Trie (prefix tree) for fast autocomplete suggestions.
// Each node holds child characters and a flag marking the end of a word.
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // Insert a word into the trie. O(k) where k is word length.
  insert(word) {
    if (!word) return;
    let node = this.root;
    const lower = word.toLowerCase();
    for (const char of lower) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  // Walk down the trie following the prefix's characters. O(k).
  _findPrefixNode(prefix) {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children[char]) return null;
      node = node.children[char];
    }
    return node;
  }

  // Collect every complete word stored under a given node.
  _collectWords(node, prefix, results, limit) {
    if (results.length >= limit) return;
    if (node.isEndOfWord) results.push(prefix);
    for (const char in node.children) {
      if (results.length >= limit) return;
      this._collectWords(node.children[char], prefix + char, results, limit);
    }
  }

  // Return up to `limit` words that start with `prefix`.
  getSuggestions(prefix, limit = 6) {
    if (!prefix) return [];
    const node = this._findPrefixNode(prefix);
    if (!node) return [];
    const results = [];
    this._collectWords(node, prefix.toLowerCase(), results, limit);
    return results;
  }
}

export default Trie;
