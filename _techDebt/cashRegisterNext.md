
Note: 

Opt1: 
Cut scope: focus on product review; Max 2h for cleanup and mocking. 
- Does not need to be functional ? 


Opt2: 
- Single functional test case inserting and checking. 2h refactor, 30m test case writing, 2h mocking, 1h code cleanup?



Code smells to fix:
0. refactor out of promises. remove all instances of .then

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