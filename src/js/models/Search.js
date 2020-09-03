import axios from 'axios';

/*
  class: Search
  query: クエリ / string
  result: レシピデータ / array
*/
export default class Search {
  constructor(query) {
    this.query = query;
  }
  
  async getResults() {
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
      this.result = res.data.recipes;
      // console.log(this.result);
    } catch(error) {
      console.log(error);
    }
  }
}