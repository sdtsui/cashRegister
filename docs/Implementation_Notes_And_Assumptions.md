### On Applying Coupons

Main advantage of coupon business logic inside Cash Register:
  - No need to pass the cart/transaction around and continue modifying it.

Main disadvantage: changing the business logic of applying coupons, limiting them, and tracking them, cannot be done without changing the internal code of the cash register.

Thus, a Transaction Object should store only a list of items, and a list of discounts (applied coupons).

Whenever the Cash Register needs to tell the frontend what the total list and cost of items is, it will ask the Transactions Service to apply all discounts, and return an transaction object with (1) free items appended, and (2). 

This has no effect on the cash register's state, and is only so the frontend can get an accurate picture of the transaction, with discounts applied.

#### On Purchases / Completing Transactions:

When the transaction is 'ended' or processed, the Transaction Service can internally apply discounts again, notifing the Discount and Inventory services for tracking internal purposes.

One consequence of this implemnetation is that the frontend can now query the Transaction Service directly if needed, if it wants to process a transaction. The Cash Register no longer has to serve as an interface for the entire checkout pipeline.
(Todo: write a test for this, using the Transaction Service mock?)

