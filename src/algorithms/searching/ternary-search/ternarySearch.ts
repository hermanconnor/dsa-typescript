export function ternarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid1 = Math.floor(left + (right - left) / 3);
    const mid2 = Math.floor(right - (right - left) / 3);

    // Check if the target is at one of the mid positions
    if (arr[mid1] === target) return mid1;
    if (arr[mid2] === target) return mid2;

    if (target < arr[mid1]) {
      // Search in the left part
      right = mid1 - 1;
    } else if (target > arr[mid2]) {
      // Search in the right part
      left = mid2 + 1;
    } else {
      // Search in the middle part
      left = mid1 + 1;
      right = mid2 - 1;
    }
  }

  // Target not found
  return -1;
}

/**
 * VERSION THAT RETURNS THE FIRST OCCURENCE IF
 * DUPLICATES ARE FOUND IN THE CENTER OF THE ARRAY
 * 
 * For this test that is commented out in test file
 * 
 * it('should return the index of the first occurrence when the array contains duplicates', () => {
    const arr = [10, 20, 30, 30, 40, 50];
    const target = 30;
    const result = ternarySearch(arr, target);
    expect(result).toBe(2);
  });
 */

// export function ternarySearch(arr: number[], target: number): number {
//   let left = 0;
//   let right = arr.length - 1;

//   while (left <= right) {
//     const mid1 = Math.floor(left + (right - left) / 3);
//     const mid2 = Math.floor(right - (right - left) / 3);

//     // Check if the target is at one of the mid positions
//     if (arr[mid1] === target) {
//       // To find the index of the first occurrence when the array contains duplicates
//       // Continue searching in the left half if a match is found at mid1
//       if (mid1 === 0 || arr[mid1 - 1] !== target) {
//         return mid1; // Found first occurrence
//       }

//       right = mid1 - 1; // Move to the left half
//     }

//     if (arr[mid2] === target) {
//       // To find the index of the first occurrence when the array contains duplicates
//       // Continue searching in the left half if a match is found at mid2
//       if (mid2 === 0 || arr[mid2 - 1] !== target) {
//         return mid2; // Found first occurrence
//       }

//       right = mid2 - 1; // Move to the left half
//     }

//     if (target < arr[mid1]) {
//       // Search in the left part
//       right = mid1 - 1;
//     } else if (target > arr[mid2]) {
//       // Search in the right part
//       left = mid2 + 1;
//     } else {
//       // Search in the middle part
//       left = mid1 + 1;
//       right = mid2 - 1;
//     }
//   }

//   // Target not found
//   return -1;
// }
