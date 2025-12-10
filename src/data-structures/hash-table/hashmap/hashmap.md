# What Is a Hashmap?

A **hashmap** (also called a **hash table**) is a data structure that stores **key–value pairs** and provides **very fast lookup, insertion, and deletion**, typically in **O(1)** average time.

You can think of it like a super-efficient dictionary:

- You give it a **key**, it instantly gives you the **value**.

Examples:

- `"username" → 10324`
- `"color" → "blue"`
- `42 → "answer"`

## Why use a Hash Map?

The primary advantage of a hash map is its **speed**. Ideally, operations like adding a new pair, finding a value, or removing a pair take **constant time**, or $O(1)$, on average. This makes it incredibly useful for tasks like counting frequencies, indexing databases, or caching.

## Components of a Hash Map

The fast performance comes from how a hash map converts a key into a physical address in memory using two main components: the **Hash Function** and the **Array/Bucket Structure**.

### 1. The Hash Function

This is the core of the hash map. The **hash function** takes a key (like a string, number, or object) and converts it into an integer index that corresponds to a location (or **bucket**) in the underlying array.

$$\text{Index} = \text{HashFunction}(\text{Key})$$

- **Goal:** To distribute keys as uniformly as possible across the available array indices. A good hash function is fast and minimizes **collisions**.

### 2. The Array (Buckets)

The hash map uses an underlying array (or list) where all the key-value pairs are ultimately stored. Each slot in this array is called a **bucket** or a **slot**.

- When you insert a key-value pair, the hash function tells the map exactly which bucket to place the pair in.
- When you look up a key, the hash function calculates the index, and the map goes **directly** to that bucket to find the value.

---

## 💥 Handling Collisions

A **collision** occurs when the hash function generates the **same index** for two different keys. Since two different pieces of data can't occupy the exact same spot in the array, hash maps need a strategy to handle this.

The two most common methods are:

### A. Separate Chaining (Common)

In this method, each bucket in the array doesn't hold a single value, but rather a **list** or **linked list** of key-value pairs.

- If a collision occurs, the new key-value pair is simply added to the linked list at that bucket's index.
- **Lookup:** The map goes to the index, then searches down the linked list for the specific key.

### B. Open Addressing (Probing)

In this method, every bucket holds at most **one** key-value pair. If a collision occurs (the calculated index is already occupied), the map looks for the next available, empty bucket using a **probing** technique:

1.  **Linear Probing:** Check the next slot in the array (index + 1, index + 2, etc.).
2.  **Quadratic Probing:** Check slots at increasing quadratic distances (index + $1^2$, index + $2^2$, etc.).

---

# Summary

A **hashmap**:

- Stores **key–value pairs**
- Uses a **hash function** + **array** underneath
- Supports **O(1)** average-time lookups, inserts, and deletes
- Handles collisions via **chaining** or **open addressing**
- Resizes to stay fast
