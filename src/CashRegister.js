'use strict';

let TransactionsController = require("./services/Transactions.js");
let InventoryController = require("./services/Inventory.js");
let DiscountsController = require("./services/Discounts.js");

class CashRegister {
  constuctor() {
  } 

  startTransaction(cb) {
    TransactionsController.createNew()
      .then((err, transactionJSON) => {
        if(!err) {
          return cb && cb(null, transactionJSON);
        }
        return cb && cb(err, null);
      })
      //err, transationJSON
  }

  endTransaction(id, cb) {
    //must update. To be completed after updateTransaction
    CashRegister.checkIfTransactionIsValid(id,
      (err, isValid, transactionObj)=> {
        if (!!isValid) {
          transaction.completed = true;
          CashRegister.updateTransaction(transaction, cb);
        }
      });
  }

  scanItem(itemID, cb) {
    InventoryController.findOne(itemID, (err, item) => {
        if (err) {
          return cb && cb(err, null);
        }
        return cb && cb(null, item);
      });
  }

  addItem(trans_ID, item_ID, quant, cb) {
    //no error checking because it happens in scanAndAdd?
    //get and validate
    TransactionsController.findOne(trans_ID,
      (err, transactionJSON) => {
        //transactionJSON might be null
        if (!!transactionJSON) {
          let trans_obj = JSON.parse(transactionJSON);
          if (CashRegister.transactionJSON_isValid(trans_obj)){
            //if item already exists, increment or update?
            trans_obj.itemList.push(item_ID, quant);
            CashRegister.updateTransaction(trans_obj, (err, trans) => {
              cb(err, trans);
            });
          }
        }
      }
    );
  }

  scanAndAdd(id, flag, qty, cb) {
    //for item usage: expects: str, fn, 'item', num
    //for discount: expects: str, fn, 'discount', null
    if (!flag && typeof flag === 'string') {
      //flag exists
      if (flag === 'discount') {
        if (qty !== null) {
          let err = new Error("Discount should not have a quantity.");
          cb(err, null);
        } else {
          this.scanDiscount(id, () => {
            CashRegister.addDiscount(id, discount.id, (err, trans) => {
              //JSON??
              if (!err) {
                return cb(err, trans);
              }
              //ERROR MESSAGE HERE
            });
          });
        }

      }
      if (flag === 'item') {
        if (typeof qty !== 'number') {
          let err = new Error("Items must be added with a qty (number).")
          cb(err, null);
        } else {
          this.scanItem(id, (err, item) => {
            if (!err) {
              CashRegister.addItem(id, item.id, qty, (err, trans) => {
                if (!err){
                  return cb(err, trans);
                }
                //ERROR MESSAGE HERE
              });
            }
          });
        }
      }
    }
  }

  scanDiscount(couponID, cb) {
    DiscountsController.findOne(couponID)
      .then((err, discount) => {
        if (err) {
          throw new Error('errorText');
        }
        cb(err, discount);
      });
  }

  addDiscount(trans_ID, Discount_ID, cb) {
    //get and validate
    TransactionsController.findOne(trans_ID,
      (err, transactionJSON) => {
        //transactionJSON might be null
        if (!!transactionJSON) {
          let trans_obj = JSON.parse(transactionJSON);
          if (CashRegister.transactionJSON_isValid(trans_obj)){//???
            trans_obj.CouponList.push(Discount_ID);
            CashRegister.updateTransaction(trans_obj, (err, trans) => {
              cb(err, trans);
            });
          }
        }
      }
    );
  }
  
  static updateTransaction(trans_obj, cb) {
    //will use validate
    //could update completed?
    TransactionsController.updateOne(trans_obj,
      (err, transactionJSON)=> {
        let updated_transaction = JSON.parse(transactionJSON);
        cb(err, updated_transaction);
      }
    );
  }

  static checkIfTransactionIsValid(transaction, cb) {
    //if number, is an ID. if object, get ID.
    let getID = typeof transaction === 'number' ? transaction : 
      typeof transaction === 'object' ? transaction.id : null;
      //null is the error case
    let fetchedTransaction = null;

    //this is a transaction that exists in the DB
    TransactionController.getTransaction(transaction.id)
      //transaction doesn't exist, defensive
      .then((err, transactionJSON) => {
        let fetchedTransaction = JSON.parse(foundTransaction);
        if (!err ) {
          return InventoryController.checkIfItemsInStock(fetchedTransaction.itemList);
        }
        cb(err, false);
      })
      .then((err, allInStock) => {
        //error callback code smell, ECCS
        if (!err && !!allInStock) {
          return DiscountsController.checkIfDiscountsValid(fetchedTransaction.discountList);
        }
        cb(err, false);
      })
      .then((err, allValid) => {
        //error callback code smell, ECCS
        if (!err && !!allValid) {
          return cb(null, true, fetchedTransaction);
        }
        cb(err, false);
      });
  }
  
  static getTransactionCost(id, cb) {
    CashRegister.getTransaction(id, cb, "cost");
  }

  static getTransactionItemList(id, cb) {
    CashRegister.getTransaction(id, cb, "items");
  }

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

  static generateDiscounts(transaction) {
    transaction.discountList.forEach()
    //returns an array of {type %, or type %/x-y}
  }

  static applyDiscounts(transaction) {
    //applies a discount, appends 
    // freeItems
    // negative cost 'discount items'
  }

}

module.exports = CashRegister;