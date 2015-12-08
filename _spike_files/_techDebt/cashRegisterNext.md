
Note: 
\
0. Architecture: 
 + Transaction Flow

1. error vs callbacks:

Each for ECCS: 
    if (error) {
      return callback && callback(error, null);
    }
    return callback && callback(null, course);

2. Long Method names, esp on Static

Missing implementation details:

1. Removal methods for my discounts and inventory services
  - remove Discounts
  - remove Items



3. ensure all services return JSON or objects, not either/both
  - discounts and inventory should match perfectly
  - transactions may not

4. Transaction Service no longer returns JSON, remove it from docs and code