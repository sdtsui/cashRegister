'use strict';
let CashRegister = require("../src/CashRegister.js");
// import { it, before, after, beforeEach, afterEach } from 'arrow-mocha'
let expect = require('expect');

xdescribe('Cases: ', function() {
  xdescribe('Create New Transaction', function() {
    let cashOne = new CashRegister();
    // cashOne.startTransaction();
  });

  xdescribe('Insert One, fetch list/cost', () => {
    let cashOne = new CashRegister();

    xit('should correctly insert', function() {
      let expectations = (err, transaction) => {
        expect(err).toBeFalsy();
        expect(transaction.itemList.length).toEqual(1);
      };
      cashOne.scanAndAdd(0, 'item', 1, expectations);
    });

    xit('should ', function() {
    });
  });

  xdescribe('Insert two - use weight/quantity - fetch list/cost', () => {
  });

  xdescribe('Insert two - apply % discount - fetch list/cost', () => {
  });

  xdescribe('Insert two - apply % and x/y discount - fetch list/cost', () => {
  });
  
});
