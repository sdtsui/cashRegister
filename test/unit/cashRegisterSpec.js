'use strict';
let CashRegister = require("../src/CashRegister.js");
// import { it, before, after, beforeEach, afterEach } from 'arrow-mocha'
let expect = require('expect');

describe('Cash Register', function() {
  
  describe('Static Methods', function() {
    it('should have getTransactionCost method', function() {
      expect(typeof CashRegister.getTransactionCost).toBe('function');
    });

    it('should have getTransactionItemList method', function() {
      expect(typeof CashRegister.getTransactionItemList).toBe('function');
      
    });

    it('should have updateTransaction method', function() {
      expect(typeof CashRegister.updateTransaction).toBe('function');
      
    });

    it('should have checkIfTransactionIsValid method', function() {
      expect(typeof CashRegister.checkIfTransactionIsValid).toBe('function');
    });

  });

  describe('instance methods', function() {
    let cash = new CashRegister();

    it('should have a scanItem method', function() {
      expect(typeof cash.scanItem).toBe('function');
    });

    it('should have a way to add items', function() {
      expect(typeof cash.addItem).toBe('function');
    });
    
    it('should have a scanDiscount method', function() {
      expect(typeof cash.scanDiscount).toBe('function');
    });

    it('should have a way to apply discounts', function() {
      expect(typeof cash.addDiscount).toBe('function');
    });

  });

  describe('scan functionality', function() {
    let cash = new CashRegister();
    it('should be able to scan an item', function() {
      cash.scanItem(0, (err, item) => {
        expect(err).toBe(null);
        expect(item.ID).toEqual(0);
        expect(item.name).toEqual('orange');
        expect(item.rate).toEqual(2);
      });
    });

    it('should be able to scan multiple items in succession', function() {
      let expectations = (err, item) => {
        expect(err).toBe(null);
        expect(item).toBeTruthy();
        expect(typeof item.ID).toBe('number');
        expect(typeof item.name).toBe('string');
      }
      let IDs = [0, 1, 2];
      IDs.forEach((ID)=> {
        cash.scanItem(ID, expectations);
      });
    });

    it('should not scan without a specified SKU/id', function() {
      let expectation = (err, item) => {
        expect(err).toBeTruthy();
        expect(item).toBe(null);
      }
      cash.scanItem(null, expectation);      
    });
  });

});
