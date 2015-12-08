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

  /**
   * [Creates a new transaction, using the transactionController.]
   * @param  {Function} cb [expects the new transaction object (parsed JSON)]
   * @return {[type]}      [description]
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

  static getController(type) {
    return __CONTROLLERS[type];
  }

  /**
   * "Scans" an item or discount, 
   * returning the details of an item or discount (parsed JSON)
   * @param  {[number]}   itemID [itemID]
   * @param  {Function} cb     [callback, accepts (err, item or discount)]
   * item spec {id: , name:, description:, unit: , rate}
   * discount spec {id: , name: ,description:, type:, value: }
   * @return {[type]}          []
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
   * @param  {[type]}   transaction [transaction object]
   * @param  {Function} cb          [callback expects the same (updated) transaction]
   * @return {[type]}               [description]
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
   * @param  {[type]}   id [id]
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
   * Breaker 2: 
   *
   * pseudocode: fetch a transaction, then fetch items, then apply discount
   */
  //calls displayTransaction with a 'cost' flag, invoking a callback with the total cost
  static displayTransactionCost(id, cb) {
    CashRegister.displayTransaction(id, cb, "cost");
  }

  //pseudocode: fetch a transaction, then fetch items, return the list. Partial
  //calls displayTransaction with a 'items' flag, invoking a callback with the list of items
  static displayTransactionList(id, cb) {
    CashRegister.displayTransaction(id, cb, "items");
  }


  //gets a transaction using findOne
  //Todo: complete error checking with this function, and removal of all instances of:
  //  `TransactionsController.findOne` in CashRegister code.
  //  More explicit code commenting
  static getTransaction(id, cb, flag) {
    if (!!flag) {
      //flag exists
      if (flag !== 'cost' || flag !== 'items') {
      //not cost or items
      let err = new Error("get Flag must be 'cost', 'items', or undefined");
      cb (err, null);
      }
    }
    TransactionsController.findOne(id, 
      (err, transactionJSON) => {
        if (!flag) {
          //no flag, want only JSON
          cb(err, transactionJSON);
        } else {
          let transaction = JSON.parse(transactionJSON);
          //flag exists, fetch cost or return list
          let result = (flag === "cost") ? calc_cost(transaction) : 
          calc_list(transaction);
          cb(err, result);
        }
      }
    );



    /**
     * Incomplete: will refactor, so this logic is in transaction service
     */
    //returns a total cost number
    function calc_cost(){
      //iterate through the list, tabulating cost
      //apply discount how?
      //
      // for %s, add a discount item with a negative value
    }

    //returns a list of items, including free items from discounts
    function calc_list(transaction){
      return transaction.itemList;
      //iterate through the list, getting total
    }
    //refactor into transactionsController
  }

}

module.exports = CashRegister;