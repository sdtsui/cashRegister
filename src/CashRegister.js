'use strict';

let TransactionsController = require("./services/Transactions.js");
let InventoryController = require("./services/Inventory.js");
let DiscountsController = require("./services/Discounts.js");

let __CONTROLLERS = {
  "item" : InventoryController,
  "discounts" : DiscountsController,
  "transactions" : TransactionsController,
}
/**
 * CashRegister is a Cash Register service layer. 
 * It supports: 
 *   - scanning of items by quantity and weight.
 *   - adding discounts by "percentage of total cost", and "x-for-y"
 *   - querying for the total cost, or a current list of items
 *
 * CashRegister is loosely coupled with the following child (for now) services:
 *   - Transactions: which keeps track of items and discounts for individual transactions
 *   - Inventory: which keeps track of stock and details of items
 *   - Discounts: which keeps track of coupons (aka discounts), 
 *   and logic for applying them to transactions
 */
class CashRegister {

  constuctor() {
  } 

  //retrieves a controller: currently used for item and discounts.
  //Almost fully reusable:  logic in add still conforms 
  //to 'item' and 'discount' specifications
  static getController(type) {
    return __CONTROLLERS[type];
  }


  /**
   * [Creates a new transaction, using the transactionController.]
   * @param  {Function} cb [expects the new transaction object (parsed JSON)]
   */
  startTransaction(cb) {
    TransactionsController.createNew()
      .then((err, transaction) => {
        if(!err) {
          return cb && cb(null, transaction);
        }
        return cb && cb(err, null);
      })
  }

  /**
   * Ends a transaction by first checking if it is valid:
   *   if valid:
   *     find all items : apply them, returning a new transaction
   *     find all discounts : apply them, returning a new transaction 
   * @param  {[number]}   id [transaction ID]
   * @param  {Function} cb [expects a processed, human-readable transaction]
   */
  endTransaction(id, cb) {
    CashRegister.checkIfTransactionIsValid(id,
      (err, isValid, validTransaction)=> {
        if (err) {
          return cb && cb(err, null);
        }
        if (!!isValid) {
          //if valid, complete it and update transactions
          validTransaction.completed = true;
          CashRegister.updateTransaction(validTransaction, 
            (err, completedTransaction) => {
              if (err) {
                return cb && cb(err, null);
              }
              //successful update, now display invoke callback with 
              //a readable transaction
              CashRegister.displayTransaction(completedTransaction, 
                (err, processedTransaction) => {
                  if (err) {
                    return cb && cb(err, null);
                  }
                  return cb && cb(null, processedTransaction);
              });
          });
          
        }
    });
  }

  /**
   * "Scans" an item or discount, 
   * returning the details of an item or discount (parsed JSON)
   * @param  {[number]}   itemID [itemID]
   * @param  {Function} cb     [callback, accepts (err, item or discount)]
   * item spec {id: , name:, description:, unit: , rate}
   * discount spec {id: , name: ,description:, type:, value: }
   */
  scan(type, ID, cb) {
    if (!type) {
      let err = "Type is required to scan."
      return cb && cb (err, null);
    }
    let controller = CashRegister.getController(type);
    controller.findOne(ID, (err, found) => {
      if (err) {
        return cb && cb(err, null);
      }
      if (!!found) {
        return cb && cb(null, found);
      }
      return cb && cb(null, null);
    });
  }

  scanItem(itemID, cb) {
    let scanItemFn = this.scan.bind(this, "item");
    return scanItemFn(discountID, cb);
  }
  scanDiscount(discountID, cb) {
    let scanDiscountFn = this.scan.bind(this, "discount");
    return scanDiscountFn(discountID, cb);
  }

  /**
   * [Adds an item or discount to a specific transaction.]
   * @param {[number]}   transactionID [transactionID]
   * @param {[number]}   ID  [itemID or discountID]
   * @param {[number]}   quant    [quantity purchased, independent of unit]
   * @param {Function} cb       [callback, expects transaction object]
   */
  add(type, transactionID, ID, quantOrVal, cb) {
    this.scanItem(type, ID, (err, item) => {
      if (!!err || !item) {
        return cb && cb(err, null);
      }
      //scan successful
      let controller = CashRegister.getController(type);
      controller.findOne(transactionID,
        (err, transaction) => {
          if (!!err || !transaction) {
            return cb && cb(err, null);
          }
          //Tech Debt: limits this function to only items and discount specs.
          //Function signature 'quantOrVal' has the same problem.
          //Conclusion: transaction should have just {items, and discounts}
          let listName = (type === 'item') ? 'itemList' : 'discountList';
          let valueName = (type === 'item') ? 'quant' : 'value';
          let newEntry = {};
          newEntry["ID"] = ID;
          newEntry[valueName] = quantOrVal
          transaction[listName].push(newEntry);

          CashRegister.updateTransaction(transaction, (err, trans) => {
            if(err) {
              return cb && cb(err, null);
            }
            cb(err, trans);
          });
        }
      );
      
    });
  }

  addDiscount(transactionID, discountID, value, cb) {
    let addDiscountFn = this.add.bind(this, "discount");
    return addDiscountFn(transactionID, discountID, value, cb);
  }

  addItem(transactionID, itemID, quant, cb) {
    let addItemFn = this.add.bind(this, "item");
    return addItemFn(transactionID, itemID, quant, cb);
  }

  /**
   * Updates a transaction, so the transaction with a matching ID will have 
   * the same properties.
   * @param  {[transaction]}    [transaction object]
   * @param  {Function} cb          [callback expects the same (updated) transaction]
   */
  static updateTransaction(transaction, cb) {
    TransactionsController.updateOne(transaction,
      (err, updatedTransaction)=> {
        if (err) {
          return cb && cb(err, null);
        }
        return cb && cb(null, updatedTransaction);
      }
    );
  }

  /**
   * Checks if a transaction associated with an ID is valid.
   * Assumes validity logic is in the transaction service.
   * @param  {[number]}   id [id]
   * @param  {Function} cb [callback, expects a transaction object (parsed JSON)]
   */
  static checkIfTransactionIsValid(id, cb) {
    TransactionsController.checkIfValid(id, (err, transaction) => {
      if (err) {
        return cb && cb(err, null);
      }
      return cb && cB(null, transaction);
    })
  }
  
  /**
   * Fetches a transaction:
   *   - converts data into human-readable format by fetching details
   *   from inventory and discount services
   *   - performs totalling logic, and application of discounts
   * @param  {[string]}   flag ['cost', 'list', or undefined]
   * @param  {[number]}   id   []
   * @param  {Function} cb   [expects an expanded, human-readable transaction]
   */
  static displayTransaction(flag, id, cb) {
    TransactionsController.findOne(id, (err, transaction) => {
      if (err) {
        return cb && cb(err, null);
      }
      CashRegister.checkIfTransactionIsValid(transaction, 
        //if transaction is valid
        (err, transaction) => {
          if (err) {
            return cb && cb(err, null);
          }
          let id = transaction.id; 

          if (!!flag) {
            if (flag === 'cost') {
              TransactionsController.totalTransaction(id, (err, total) => {
                if (err || !total) {
                  return cb && cb(err, null);
                }
                return cb && cb(null, total);
              });
            }

            if (flag === 'items') {
              TransactionsController.getTransactionList(id, (err, list) => {
                if (err || !list) {
                  return cb && cb(err, null);
                }
                return cb && cb(null, total);
              });
            }
          }
          // no flag, return some (TBD) finalized state of
          // the transaction, holding items, discounts, and 
          // application of discounts
          TransactionsController.tabulateTransaction(id, (err, transaction) => {
            if (err || !transaction) {
              return cb && cb(err, null);
            }
            return cb && cb(null, transaction);
          });
        }
      );
    });
  }

  //calls displayTransaction with 'cost' flag, invoking a callback with the total cost
  static displayTransactionCost(id, cb) {
    CashRegister.displayTransaction.bind(this, "cost")(id, cb);
  }

  //calls displayTransaction with 'items' flag, invoking a callback with the list of items
  static displayTransactionList(id, cb) {
    CashRegister.displayTransaction.bind(this, "list")(id, cb);
  }
  
}

module.exports = CashRegister;