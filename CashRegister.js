'use strict';

let TransactionsController = require("./services/Transactions.js");
let InventoryController = require("./services/Inventory.js");
let PricingController = require("./services/Pricing.js");
let DiscountsController = require("./services/Discounts.js");


class CashRegister {
  constuctor() {

  } 

  scanItem(itemID, cb) {
    InventoryController.getDetails(itemID)
      .then((err, item) => {
        cb(err, item);
        if (err) {
          throw new Error('errorText');
        }
      });
  }

  scanDiscount() {

  }


  addItem(trans_ID, item_ID, quant, cb) {
    //only if valid, we can do below??

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
      )
  }


  startTransaction() {

  }

  /**
   * returns current list of items
   * @return {[type]} [description]
   */
  get currentTransactionItemList() {

  }

  //returns total cost of current list of items
  get currentTransactionTotalCost() {

  }

  //Helper
  removeDiscount() {
    /**
     * finds and removes one instance of the current discount;
     *
     * returns true if a discount was removed.
     */
  }

  /**
   * Assumption / tech debt: maybe a transaction should be its own
   * type-safe list. Too much abstraction?
   */
  
  static updateTransaction(id, JSON) {
    //will use validate
    //could update completed?
  }

  static transactionJSON_isValid(transaction) {
    //this is a transaction that exists in the DB
    
    //transaction doesn't exist, defensive
    TransactionController.getTransaction(transaction.id
      (err, trans) => {
        InventoryController.checkIfInStock(transaction.itemList,
          (err, allInStock) => {
            if(allInStock) {
              DiscountsController.getDiscount(transaction.currentDiscounts,
                () => {
                });
            }
          }
          );
      }
      );
    TransactionController.getTransaction(transaction.id)
      .then((err, trans) => {
        if (!err ) {
          InventoryController.checkIfItemsInStock(transaction.itemList);
        }
      })
      .then((err, allInStock) => {
        if (!err && !!allInStock) {
          DiscountsController.getDiscounts(transaction.currentDiscounts);
        }
      })
      .then((err, allValid) => {

      });
      //do all checks

    //coupon doesn't exist
    //item is out of stock
    validationCalls.map()

    validationCalls.done()

    //async, if all complete,
    //
  }

  static getTotalCost(id) {

  }

  static getListOfItems(id) {

  }




}



module.exports = CashRegister;