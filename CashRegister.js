'use strict';


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
     * ASSUMPTION: Stacked discounts will be applied to the current 
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
     */

  }

  /**
   * [currentTransaction description]
   * inputs: none
   * outputs: returns the cash register's currentTransaction object,
   * including:
   *
   * list of all items
   * a function for calculating current cost of a List
   * @return {[type]} [description]
   */
  currentTransaction() {

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
   * inputs: a transaction object
   * outputs: a cost of list
   * @param  {[type]} list [description]
   * @return {[type]}      [description]
   */
  static calculateTotalCostOf(list) {

  }

  /**
   * Assumption / concern: maybe a transaction should be its own
   * type-safe list. Too much abstraction?
   */
}



module.exports = CashRegister;