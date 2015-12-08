
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

5.
???
DisplayTransaction : should give us a list of all items
DisplayTransactionTotal: should give us only the total
DisplayTransaction("list" // "total") , if no flag, returns both

DisplayTransaction : displays entire current transaction, items named and discounts applied
DisplayTransactionCost: displays cost
DisplayTransactionList: displays items


6. Write down how the logic in endTransaction, using checkIfTransactionValid, has unnecessary fetching because it overlaps with DisplayTransaction

7. Obvious markers /****/

8. Notes for Docs: in endTransaction, completion of a transaction still won't require error checking on our end, only the TransactionService.
It should only send over incomplete Transactions with findOne??? NOPE. We need error checking. Make a note for next steps: ::: 
  Paragraph: originally, I thought we'd let transactions keep track of which 
  But given how CashRegister is written, I can see why it would want to do error checking to keep the TransactionsService API simple...

9. Notes for Docs: Outline business outcomes / benefits of modularity: 
  - Each service could scale and keep track of every method that is called, like an ERP package.
  - No single service needs to know. 


10. Samller Files? 


11. Checking a lot of different services: shouldn't I just find a way to map over the required services? Might need order...<head></head>


12. search for all instances of 'type' : remove or delete.

13. thinkabout : how would I make this a smaller file? 

14. findOne should be findOne by ID?

15: Cleanup: 80 lines....