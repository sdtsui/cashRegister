'use strict';

let CashRegister = require("./CashRegister.js");

describe('Cash Register', function() {
  


  describe('methods', function() {
    beforeEach(() => {
      let cash = new CashRegister();
    });


    it('should have a scanItem method', function() {
      expect(typeof cash.scanItem).toBe('function');
    });

    it('should have a way to add items', function() {
      expect(typeof cash.addItem).toBe('function');
    });
    
    it('should have a scanDiscount method', function() {
      
    });

    it('should have a way to apply discounts', function() {
      
    });

    it('should have a currentTransaction method', function() {
      
    });
    
  });

  describe('scan functionality', function() {
    it('should be able to scan an item', function() {
      
    });

    it('should be able to scan multiple items in succession', function() {
      
    });

    it('should not scan without a specified SKU/id', function() {
      
    });

    it('should scan with only an ID, assuming ONE(1) quantity', function() {
      
    });    
  });

  describe('apply discount functionality', function() {
    it('should be able to apply a discount', function() {
      
    });

    it('should throw without a discount ID', function() {
      
    });

    it('should be able to apply multiple discounts', function() {
      
    });

  });

  describe('get currentTransaction functionality', function() {
    it('should get an empty transaction', function() {
      
    });

    it('should return all of the items scanned', function() {
      
    });

    it('should not return items that have been removed', function() {
      
    });
    
    it('should return a function that calculates a total', function() {
      
    });
  });



});