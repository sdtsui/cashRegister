

## Overview of Services

All of the methods outlined in this specification accept a callback, should accept `cb` as their last parameter. 

#### Discounts & Inventory Service: 

The discount and inventory services provide an interface for the Cash Register to check for the existence of inventory, and validity of discounts.


##### Inventory:
Methods used: 
  *`FindOne()`*

  Looks for a specific itemID in the inventory, returning JSON representing the item
  {
    id: 
    name:
    description:
    unit: 
    rate: 
  }

  *`checkIfItemsInStock()`*
  Accepts an array and returns 
    err, 
    allInStock, 
      -true or false, if all items are in stock
    missingItems, 
      -an array of out-of-stock items

##### Discounts:
Methods used: 
  *`FindOne()`*

  Looks for a specific discountID in the Discounts Service, returning JSON representing the discount
  ```
  {
    id: ,
    name:,
    description:,
    type: ,
    value:,
  }

  ```
  a percentage discount might be:
  ```
  {
    id: 01,
    name: 'employees',
    description: '15%, discount for employees',
    type: 'percentage' ,
    value: 15,
  }
  ```
  an x-for-y discount might be

  ```
  {
    id: 02,
    name: '3for1',
    description: 'buy three get one free',
    type: ,
    value: {
      x : 3,
      y : 1
      },
  }
  ```
  *`checkIfDiscountsValid()`*
  Accepts an array and returns 
    err, 
    allValid, 
      -true or false, if all items are in stock
    invalidDiscounts, 
      -an array of invalid discounts, by ID


#### Transactions Service:

Methods Used: 
`*findOne()*`
  accepts an ID or transaction object, 
  finds one transaction with a matching ID and returns it

`*createNew()*`
  creates a new transaction, returning the transaction

`*applyDiscounts()*`
  returning the transaction as JSON, with two additional properties:
    - .freeItems, a list of item ids and quantities of additional, cost-less items (from discounts)
    - .discountSavings, a list of negative cost values (from discounts), to be added to the total cost

`*updateOne()*`
  accepts only a transaction object, using an ID
  finds one transaction and overrides the internal state of the transaction

  not perfect right now, as it could easily override existing transactions, trusting its caller to perform validation.

  Transaction service should handle possible erroneous overriding either by storing old copies of transactions and enabling the frontend to query for them, or building out basic error checking on top of CRUD functionality for our Transactions service. 

##### Transactions: 
  TransactionService expects JSON from the database, and will convert it into an object.
  An example would be: 
  {
    id: 1,
    completed: false,
    itemIDList: [],
    couponIDList: [],
  }

  Note that the transactionService doesn't hold a total. That is always calculated upon request, when the cashRegister needs to display a total.
  If the information is not cached (not implemented), the cashRegister will need to first query the ItemService for human-readable names and rates (by quantity/weight). After that, it will query the TransactionService.

  This is preferrable to storing the items, rates, and discount-application rules in the transaction, because all changes can to those services can be self-contained, and any operations on a transaction will not require passing transactions around: only the cashRegister (or other interface) needs to query a service for desired information/functionality  (like applying discounts, or logic for calculating totals).