'use strict';

/**
 * Dependencies:
 *
 * scan: 
 *   - transaction service
 *   - inventory service
 *
 *
 * applyDiscount:
 *   - transaction service
 *   - discount service/subservices
 *
 * currentTransaction/Total:
 *
 *
 * Open question: where should I check if a cash register's transaction is 
 * completed? (encourage atomicity of transactions)
 */

class CashRegister {
  constuctor() {
    this.currentTransactionID = null;
    this.currentTransaction = {
      itemList: [], // {id, unit, quant, rate}
      currentDiscounts: [],
      total: undefined,
    }
  } 

  /**
   * inputs: item paramaters in strings and numers
   * outputs: none
   * side effects: adds an item-quantity-unit tuple to the current transaction
   * @return {[type]} [description]
   */
  scan() {
    // defaults: sku -> throw,
    // unitID = unit
    // quant = 1,
    // thus shorhand will be .scan("123132") will add one orange
    // signature of a listItem entry will be
    // {
    //    ID : ,
    //    UNIT: ,
    //    QUANT
    // }


    /**
     * if no current transaction, fetch new
     * scan item, if:
     *   - id exists in inventoryService (separate method?)
     *   - get human-readable name (unnecessary?)
     *     - save (ID only to list)
     *   - 
     *
     * side effect
     */
    
    /**
     * assumption/tech debt: 
     * must check if current transaction has not already been processed
     */
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