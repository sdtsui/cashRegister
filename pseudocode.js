/**
 * 
 *The 3 main requirements are:

• It needs to be able to scan items in by quantity and weight

• It needs to be able to handle discount coupons... allow for two different types of 

coupons

o % off total

o Buy ‘x’ get ‘y’ free (i.e. buy 3 get 1 free)

• It should be able to provide a caller with a total cost and a list of items

 *
 *
 *
 *
 *
 *
 *
 *
 *
 * 
 * @type {[type]}
 */

/**
 * Cart:
 * 5 oranges
 * 2 kg rice
 *
 * 1 15% discount
 */


// Frontend will do the following:

/**
 * startTransaction
 *FE has trans_ID
 *
 * 
 * scanItem(orangeCode)
 *FE has orange details
 *
 * repeat for rice
 *
 * 
 * FE has orange detials, rice details...
 * knows it has 5 and 2
 *
 *
 * 
 * 
 */


Implementation TODOS:

afterEach: Cleanup:



//HELPER METHOD FOR 
//FRONTEND TO CALCULATE
.scanItem(code) /// returns 
/**
 * {
 * id: ,
 * name: "rice",
 * unit: kg,
 * rate: 2,
 * }
 */

//forState:
//
//
.addItem(trans_id,  item_id, quant); //unit assumed
/**
 * internally:
 *   validate updated transaction
 *   if valid: updateTransaction
 */



.scanDiscount(code) ///return
/**
 * discount details:
 * {
 * id: ,
 * name: ,
 * type: 00, or 01 (%, or)
 * value: 25
 * }
 * //1. 25% type 00
 * //2.  or 25 type 01, 
 * //is bought 25, get 1 free
 */

//DB call (state here?)
.updateTransaction(id, JSON);
  //use ID
  //get transaction,
  //update it
  //persist
  //
  // can also apply discounts here

//DB Call
.getTotalCost(id); 
//get only current transaction's info
.getListOfItems(id);


//DB Call Pt 2:
//
.startNewTransaction(); 
//only returns new transaction's ID
//
.endTransaction(id);
//start by fetching with ID
//then validate

//just in DB...
this.currentTransaction = {
  ID : null,
  completed: false,
  discountApplied: false,
  itemList: [], // {ID, unit, quant, rate}
  currentDiscounts: [], // ID
  total: undefined,
}



.validate(id);
//accepts JSON
//returns true/false
//validate, grab
// if a valid transation 
// 
// 
// 
//if transaction is:
//  already completed
//  
//  coupon doesn't exist
//  inventory mismatch
//    return err  
//
//else, transaction is valid
//  let tempTransactionJSON = t_from_db.toJSON();
//  transactionJSON.completed = true
//  updateTransaction(id, transactionJSON);
//    return err or {//compelted transaction details}

