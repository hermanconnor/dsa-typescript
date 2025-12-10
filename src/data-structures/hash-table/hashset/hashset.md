# What Is a HashSet?

A **hashset** (often simply called a "set" in many programming languages when it's backed by a hash table) is an unordered collection of **unique elements**. It lets you check whether an element is present in **O(1)** average time.

Think of it like:

- A bag where you can put items in,
- But duplicates are automatically ignored,
- And you can instantly test if something is inside.

In essence, a hash set is typically implemented using a hashmap where:

- The **element** you want to store in the set is used as the **key**.
- The **value** associated with that key is irrelevant or a dummy placeholder (e.g., a boolean `true`, `null`, or a fixed constant).

## Key Features of a Hash Set

1.  **Uniqueness:** A hash set guarantees that no duplicate elements can be stored. If you try to add an element that already exists, the operation is simply ignored.
2.  **Fast Operations:** Similar to hash maps, the average-case time complexity for common operations is $O(1)$:
    - **Add/Insert:** Add a new element.
    - **Remove/Delete:** Remove an element.
    - **Contains/Lookup:** Check if an element is present in the set.
3.  **Unordered:** The order in which elements are inserted is **not** maintained. The internal arrangement is based on the hash function's output.

## How it Works Internally

A hash set leverages the same underlying mechanism as a hash map: **hashing** and **buckets**.

### 1. Hashing the Element

When you try to **add** an element (e.g., the string `"banana"`), the element is passed through a **hash function** to determine its index (bucket) in the internal array.

$$\text{Index} = \text{HashFunction}(\text{"banana"})$$

### 2. Checking for Duplicates (Uniqueness)

Before inserting, the hash set performs a check:

- It calculates the index using the hash function.
- It goes directly to that bucket.
- If the element is **already present** (which requires checking within the linked list/chain if collisions occurred), the insertion is skipped.
- If the element is **not present**, it is inserted into that bucket.

### 3. Lookup Operation

When you check if an element **contains** (e.g., `"apple"`):

1.  The hash function calculates the index for `"apple"`.
2.  The set jumps directly to that index.
3.  It searches the elements at that bucket for an exact match.
4.  If found, it immediately returns `true` ($O(1)$ average time). If not found after checking all elements in the bucket's chain, it returns `false`

## Common Use Cases

Hash sets are incredibly useful whenever you need to deal with a collection where membership and uniqueness are critical.

- **De-duplication:** Quickly removing duplicate entries from a list.
- **Counting Unique Items:** Easily finding the count of distinct elements in a stream of data.
- **Set Operations:** Performing mathematical set operations efficiently:
  - **Union:** Combining all unique elements from two sets.
  - **Intersection:** Finding elements common to both sets.
  - **Difference:** Finding elements in one set but not the other.
- **Frequency Checking:** As an initial step in algorithms that count frequencies, ensuring you only process a unique item once.

# Summary

A **hashset**:

- Stores **unique elements**
- Uses hashing for **O(1)** average operations
- Ignores duplicates
- Is usually built on top of a **hashmap**
- Is ideal for fast membership checks and deduplication
