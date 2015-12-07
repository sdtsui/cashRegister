Code smells to fix:


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

