# What is a Hash Table?

A hash table (also known as a hash map or dictionary) is a data structure that stores key-value pairs.It is a highly efficient way of implementing associative arrays, or mappings, from a set of keys to values. Hash tables allow for very fast retrieval of values given their corresponding keys. Think of it like a real-world dictionary: you look up a word (key) to find its definition (value).

## Key Concepts

1. **Key:** The unique identifier used to access a value. Keys can be of various data types (strings, numbers, objects, etc.). Ideally, they should be immutable (not change after being added to the hash table).

2. **Value:** The data associated with a key. Values can be any data type.

3. **Hash Function:** A function that takes a key as input and returns an integer, called a hash code. This hash code is used as an index into the hash table's underlying array (often called buckets or slots). A _good_ hash function distributes keys evenly across the array to minimize collisions (explained below).

4. **Bucket (Slot):** Each element in the hash table's underlying array is a bucket. Ideally, each bucket should hold only one key-value pair. However, collisions can occur.

5. **Collision:** When two or more keys map to the same bucket (have the same hash code). Effective hash table implementations have strategies to handle collisions.

- **Collision Handling**: If two keys map to the same hash index, a collision occurs. There are two main methods to handle collisions:
  - **Chaining**: Using linked lists (or other data structures) to store multiple values at the same index.
  - **Open Addressing**: Finding another open slot within the array to store the value.

### This implementation uses _chaining_ to handle collisions. Each bucket stores an array (list) of key-value pairs that hash to the same index.

## Resizing

Over time, as the hash table gets more elements, the number of collisions may increase, leading to degraded performance. To address this, the hash table can **resize** when it reaches a certain threshold (e.g., 75% full). Resizing involves creating a larger table and rehashing all existing keys into the new table.
