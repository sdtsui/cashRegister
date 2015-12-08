Unfinished: 

0. Architectural Misses:
  - Would like Tabulation/total logic to be in CashRegister, not TransactionsService.
  - CashRegister is stateless, so all methods could be on the class instead of the instance.
  - CashRegister is stateless, so 40% of the code (scanning and adding) could be in another service (a 'scanner').

1. Method naming on CashRegister Class could be improved

2. Useful, but missing implementation details:
  2.1 Removal methods for my discounts and inventory services
    - remove Discounts
    - remove Items

3. Logic in endTransaction, using checkIfTransactionValid, has unnecessary fetching because it overlaps with DisplayTransaction

4. EndTransaction: Error checking.
  Originally, I thought we'd let transactions keep track of which  But given how CashRegister is written, I can see why it would want to do error checking instead of expecting validation form TransactionsService.

5. TransactionsController method naming is somewhat unidiomatic. Querying primarily by ID, by no findByID function?
________________________________

Un-documented Assumptions: 
1.  All services return objects / parsed JSON, not JSON itself.

2. Notes for Docs: Outline business outcomes / benefits of modularity: 
  - Each service could scale and keep track of every method that is called, like an ERP package.
  - No single service needs to know. 
