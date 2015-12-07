'use strict';

let TransactionsController = require("./services/Transactions.js");
let InventoryController = require("./services/Inventory.js");
let PricingController = require("./services/Pricing.js");
let DiscountsController = require("./services/Discounts.js");


class CashRegister {
  constuctor() {
    this.currentTransaction = null;
  } 

  /**
   * inputs: item paramaters in strings and numers
   * outputs: none
   * side effects: adds an item-quantity-unit tuple to the current transaction
   * @return {[type]} [description]
   */
  scan(itemID, unitID = 00, quantity = 1, cb) {
    if (!!itemID || typeof itemID !== number) { 
      return new Error("Scan failed: Invalid itemID.");
    }

    if (!!this.currentTransaction) {
      TransactionsController.findOne({itemID: itemID}, (err, transaction) => {
        //if error
        if (!!err) {
          console.log("Error in CashRegister, from TransactionsController: ",
            err
            );
          cb(err, null);
        } else {
          //refactor into createNewTransaction?
          this.currentTransaction = {
            ID : transaction.ID,
            completed: false,
            discountApplied: false,
            itemList: [], // {ID, unit, quant, rate}
            currentDiscounts: [], // ID
            total: undefined,
          }
          //interface between transactions service, and cashregister needed?
          //convert transaction object to currentTransaction
          //Assumption: inventory logic returns:
          //item:
          //  {
          //    itemID : ,
          //    unitID: ,
          //    quantity: ,
          //    rate: , 
          //    
          //  }
          //add to current transaction?
          //if pricing service is needed, it goes here
          //
        } 
      })
    }
    this.currentTransaction.itemList.push(item);
    //handle duplicates, etc? 
    //
    cb(null, this.currentTransaction); //currentList?
    cb(null, "Success");

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
    /**
     * 
     * check if discount exists, from the discountService
     *
     * if so, add discount list, 
     * which can have multiple discounts and duplicates of this discount.
     * 
     */
    
    /**
     * ASSUMPTION: 
     *
     * 1. 
     * Stacked discounts will be applied to the current 
     * transaction. No rules for limit of discounts.
     * NOTE, this will be incomplete. Discount service should handle
     * constrains of the discount. 
     *
     *
     * Ideally, the whole transaction gets sent to the discount service 
     *   perhaps split into two parts:     
     *     discountTracker (tracks all active discounts)
     *     discountApplier (applies discounts in a predictable manner, as 
     *     order matters when applying percentages and adding/removing ites
     *     )
     *
     * 2. these are applied to the transaction at "process time"
     *   want a processTransaction function?
     */

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