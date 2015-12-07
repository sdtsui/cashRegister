'use strict';

let TransactionsController = require("./services/Transactions.js");
let InventoryController = require("./services/Inventory.js");
let PricingController = require("./services/Pricing.js");
let DiscountsController = require("./services/Discounts.js");

class CashRegister {
  constuctor() {

  } 

  startTransaction(cb) {
    TransactionsController.createNew()
      .then((err, transactionJSON) => {
        let trans_obj = JSON.parse(transactionJSON);
        cb(err, trans_obj.ID);
      })
  }

  endTransaction(id, cb) {
    //must update. To be completed after updateTransaction
    CashRegister.checkIfTransactionIsValid(id,
      (err, isValid, transaction)=> {
        return cb(err, isValid, transaction);
      });
  }

  scanItem(itemID, cb) {
    InventoryController.getDetails(itemID)
      .then((err, item) => {
        if (err) {
          throw new Error('errorText');
        }        
        cb(err, item);
      });
  }


  addItem(trans_ID, item_ID, quant, cb) {
    //get and validate
    TransactionsController.getTransaction(trans_ID,
      (err, transactionJSON) => {
        //transactionJSON might be null
        if (!!transactionJSON) {
          let trans_obj = JSON.parse(transactionJSON);
          if (CashRegister.transactionJSON_isValid(trans_obj)){//???
            trans_obj.itemList.push(item_ID, quant);
            CashRegister.updateTransaction(trans_obj, (err, trans) => {
              cb(err, trans);
            });
          }
        }
      }
    );
  }

  scanDiscount(couponID, cb) {
    DiscountsController.getDetails(couponID)
      .then((err, discount) => {
        if (err) {
          throw new Error('errorText');
        }
        cb(err, item);
      });
  }

  addDiscount(trans_ID, Discount_ID, quant, cb) {
    //get and validate
    TransactionsController.getTransaction(trans_ID,
      (err, transactionJSON) => {
        //transactionJSON might be null
        if (!!transactionJSON) {
          let trans_obj = JSON.parse(transactionJSON);
          if (CashRegister.transactionJSON_isValid(trans_obj)){//???
            trans_obj.CouponList.push(Discount_ID, quant);
            CashRegister.updateTransaction(trans_obj, (err, trans) => {
              cb(err, trans);
            });
          }
        }
      }
    );
  }
  
  static updateTransaction(id, JSON) {
    //will use validate
    //could update completed?
    //
    TransactionsController.getTransaction(trans_ID,
      (err, transaction)=> {
        if (!!transaction) {

        } 
      })
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
      .then((err, foundTransaction) => {
        let fetchedTransaction = foundTransaction;
        if (!err ) {
          return InventoryController.checkIfItemsInStock(fetchedTransaction.itemList);
        }
        cb(err, false);
      })
      .then((err, allInStock) => {
        if (!err && !!allInStock) {
          return DiscountsController.getDiscounts(fetchedTransaction.currentDiscounts);
        }
        cb(err, false);
      })
      .then((err, allValid) => {
        if (!err && !!allValid) {
          return cb(null, true, fetchedTransaction);
        }
        cb(err, false);
      });
  }

  static getTotalCost(id) {

  }

  static getListOfItems(id) {

  }




}



module.exports = CashRegister;