class Inventory {
  constructor() {
    this.items = [];
    Inventory.addStubData(this);
  }

  findOne(id, cb) {
    let items = this.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].ID === id) {
        return cb && cb(null, items[i]);
      }
    }
    let err = new Error("item not found");
    return cb && cb(err, null);
  }

  static addStubData(inventory) {
    let items = inventory.items;
      items.push({
        ID: 0,
        name: "orange",
        unit: "weight",
        unitName: "kg",
        rate: 2,
      });

      items.push({
        ID: 1,
        name: "apple",
        unit: "weight",
        unitName: "kg",
        rate: 2,
      }); 

      items.push({
        ID: 3,
        name: "superOrange",
        unit: "quantity",
        unitName: null,
        rate: 50,
      });
  }
}


let InventoryService = new Inventory();
module.exports = InventoryService;