'use strict';

let TransactionsController = require("./services/Transactions.js");
let InventoryController = require("./services/Inventory.js");
let PricingController = require("./services/Pricing.js");
let DiscountsController = require("./services/Discounts.js");


class CashRegister {
  constuctor() {
    this.currentTransaction = null;

  } 

  //findOrCreate Logic
  startTransaction() {
    //if there is no current transaction
    //  create a new one, insert as pending
    //else : there is a current transaction
    //  check if it matches the current DB
    //  if it does:
    //    update it, send to DB
    //  if it does not:
    //    take the new one, update it, send to DB
    //cb ("success")?

    if (this.current)
    if (!this.currentTransaction) {
      this.currentTransaction = {
        ID : null,
        completed: false,
        discountApplied: false,
        itemList: [], // {ID, unit, quant, rate}
        currentDiscounts: [], // ID
        total: undefined,
      }

      TransactionsController.insertNew(this.currentTransaction);
    } else {
      
    }
      TransactionsController.findOne(this.currentTransaction, (err, transaction) => {
        //if error
        if (!!err) {
          console.log("Error in CashRegister, from TransactionsController: ",
            err
            );
          cb(err, null);
        } else {
          if (!!transaction) {
            //found, already in service

          } else {
            //none found, must create new
          }

        } 
      })
    }
    this.currentTransaction.itemList.push(item);
    //handle duplicates, etc? 
    //
    cb(null, this.currentTransaction); //currentList?
    cb(null, "Success");


  }

  //no return value, only send complete transaction to DB
  endTransaction() {
    //resetTransaction
  }

  /**
   * inputs: item paramaters in strings and numers
   * outputs: none
   * side effects: adds an item-quantity-unit tuple to the current transaction
   * @return {[type]} [description]
   */
  scan(itemID, unitID = 00, quantity = 1, cb) {
    //if there is no active transaction, throw
    //if there is one, add to it.

    // (two steps: scan, punch in quantity)
    // scan item, automatically add it as one unit;
    //  -edit item afterwards

    //scan item
    //enter quantity and unit
    //add to card
    //
    //scanAndAdd Method
    if (!itemID || typeof itemID !== number) { 
      return new Error("Scan failed: Invalid itemID.");
    }
    //find price data, update
    let rate = PricingController.getRate(unitID, quantity);
    let itemCost = rate * quantity;
  }

  /**
   * inputs: discountID
   * outputs: none
   *
   * side effects: add a discount to the transaction
   *
   * Adding discount won't affect any of the transaction's properties.
   * Discounts get applied at the last possible moment.
   * Only when a total is needed, the discount is applied.
   * @return {[type]} [description]
   */
  applyDiscount(discountID) {
    //if there is no current transaction: return error
    
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
}



module.exports = CashRegister;