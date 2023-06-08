function binarySearch(arr, target) {
    let low = 0;
    let high = arr.length - 1;
  
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const sku = arr[mid];
  
      if (sku === target) {
        return mid; // SKU found at index mid
      } else if (sku < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  
    return -1; // SKU not found
}

export default {
    binarySearch };