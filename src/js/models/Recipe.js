import axios from 'axios';

/*
  recipe {
    id: id,
    title,
    author,
    img,
    url,
    ingredients as Array,
    time,
    servings
  }
*/
export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  
  async getRecipe() {
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      
      // TESTING
      window.d = res.data.recipe;
      
    } catch(error) {
      console.log(error);
      alert('Recipeモデルでエラーが発生しています...');
    }
  }
  
  
  calcTime() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    
    this.time = periods * 15;
  }
  
  
  calcServings() {
    this.servings = 4;
  }

  
  parseIngredients() {
    const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
    const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
    const units = [...unitsShort, 'kg', 'g'];
    
    const newIngredients = this.ingredients.map(el => {
      // 1) 単位を省略形に揃える
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, unitsShort[index]);
      });
      
      // 2) 括弧を除去する
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
      
      // 3) 単位、数量、手順を解析する
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
      
      let objIng;
      if(unitIndex > -1) {
        // 単位が見つかった場合
        // ex. 4 1/2 cups, arrCount is [4, 1/2]
        // ex. 4 cups, arrCount is [4]
        // ex. 4-1/2 cups, arrCount is [4-1/2]
        const arrCount = arrIng.slice(0, unitIndex);
        
        let count;
        if(arrCount.length === 1) {
          count = eval(arrCount[0].replace('-', '+'));    // ex. 1-1/3 -> 1 + 1/3
        } else {
          count = eval(arrCount.join('+'));
        }
        
        /*
          count: 数量,
          unit: 単位,
          ingredient: 数量と単位を除いた手順
        */
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" ").trim()
        };
      } else if(parseInt(arrIng[0],10)) {   // オリジナルは、else if (parseInt(arrIng[0], 10))
        // 単位がない かつ 最初の単語が数値の場合
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ').trim()
        };
      } else {
        // 単位がない かつ 最初の単語が数値でない場合
        objIng = {
          count: 1,
          unit: '',
          ingredient: ingredient.trim()
        };
      }
      
      return objIng;
    });
    
    this.ingredients = newIngredients;
  }
  
  
  updateServings(type) {
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
    
    this.ingredients.forEach(objIng => {
      objIng.count *= (newServings / this.servings);
    });
    
    this.servings = newServings;
  }
  
}