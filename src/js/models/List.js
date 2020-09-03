import uniqid from 'uniqid';

/*
item = {
  id,
  count,
  unit,
  ingredient
}
*/
export default class List {
  constructor() {
    this.items = [];
  }
  
  
  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    };
    
    this.items.push(item);
    return item;
  }
  
  
  deleteItem(id) {
    // const index = this.items.findIndex(el => el.id === id);
    // this.items.splice(index, 1);
    
    // オリジナル
    this.items = this.items.filter(el => el.id !== id);
  }
  
  
  updateCount(id, newCount) {
    this.items.find(el => el.id === id).count = newCount;
  }
}