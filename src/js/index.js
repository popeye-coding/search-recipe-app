import '../scss/main.scss';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/*
  state {
    search: クエリとレシピデータ（配列）,
    recipe: 現在閲覧中のレシピ (id, title, author, img, url, ingredients, time, servings),
    list:   レシピのcount, unit, ingredientのオブジェクト配列
    likes:  お気に入りしたレシピ
  }
*/
const state = {};

// TESTING
window.s = state;



// ***** SEARCH CONTROLLER *****

const controlSearch = async () => {
  const query = searchView.getInput();
  
  // // TESTING
  // const query = 'pizza';
  
  if(query) {
    state.search = new Search(query);
    
    // 準備中のUIを表示
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    
    try {
      await state.search.getResults();    // 検索結果をsearchステートに格納
      
      // 結果をUIに表示
      clearLoader();
      searchView.renderResults(state.search.result);
      
    } catch(error) {
      console.log(error);
      alert(`Search Controllerでエラーが発生しています...`);
    }
  }
};


elements.searchForm.addEventListener('submit', e => {
  controlSearch();
  e.preventDefault();
});


elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');    // closest: クリックされた要素自身とその祖先を検索し、一致した要素を返す
  if(btn) {
    const gotoPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, gotoPage);
  }
  e.preventDefault();
});




// ***** RECIPE CONTROLLER *****

const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');
  
  // TESTING
  // if(id) console.log(id);
  
  if(id) {
    // 準備中のUIを表示
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    
    // 選択したレシピをハイライトにする
    if(state.search) searchView.highlightSelected(id);
    
    state.recipe = new Recipe(id);
    
    // TESTING
    window.r = state.recipe;
    
    try {
      await state.recipe.getRecipe();
      
      // // TESTING
      // console.log('解析前の手順：', state.recipe.ingredients);
      
      state.recipe.parseIngredients();
      // // TESTING
      // console.log('解析後の手順：', state.recipe.ingredients);
      
      state.recipe.calcTime();
      state.recipe.calcServings();
      
      // UIにレシピを表示
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
      
    } catch(error) {
      console.log(error);
      alert('Recipe Controllerでエラーが発生しています...');
    }
  }
};


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));



// ***** LIST CONTROLLER *****
const controlList = () => {
  if(!state.list) state.list = new List();
  
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};


elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // 削除ボタンをクリックした場合
  if(e.target.matches('.shopping__delete, .shopping__delete *')) {
    
    state.list.deleteItem(id);
    
    listView.deleteItem(id);
    
    return;
  }
  
  // インプットボタンをクリックした場合
  if(e.target.matches('.shopping__count-value')) {
    const newCount = parseInt(e.target.closest('.shopping__count-value').value, 10);
    
    state.list.updateCount(id, newCount);
    
    return;
  }

});



// ***** LIKE CONTROLLER *****

const controlLike = () => {
  if(!state.likes) state.likes = new Likes();
  
  // // TESTING
  // window.l = state.likes.likes;
  
  const currentID = state.recipe.id;
  
  if(!state.likes.isLiked(currentID)) {
    // レシピをお気に入り登録していない場合
    const newLike = state.likes.addLike(
      currentID, 
      state.recipe.title, 
      state.recipe.author, 
      state.recipe.img
    );
    
    likesView.toggleLikeBtn(true);
    
    likesView.renderLike(newLike);
    
  } else {
    // 既にお気に入り登録している場合
    state.likes.deleteLike(currentID);
    
    likesView.toggleLikeBtn(false);
    
    likesView.deleteLike(currentID);
  }
  
  likesView.toggleLikeMenu(state.likes.likes.length);
};


elements.recipe.addEventListener('click', e => {
  // マイナスボタンをクリックした場合
  if(e.target.matches('.btn-decrease, .btn-decrease *')) {
    if(state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
    return;
  }
  
  // プラスボタンをクリックした場合
  if(e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
    return;
  }
  
  // ライクボタンをクリックした場合
  if(e.target.matches('.recipe__love, .recipe__love *')) {
    return controlLike();
  }
  
  // カートに入れるボタンをクリックした場合
  if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    return controlList();
  }
  
});


window.addEventListener('load', () => {
  state.likes = new Likes();
  
  // ローカルストレージからlikesを復元
  state.likes.readStorage();
  
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

