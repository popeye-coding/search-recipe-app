import { elements } from './base';
import { Fraction } from 'fractional';


export const clearRecipe = () => {
  elements.recipe.innerHTML = '';
};


// 少数から分数に変換する
const formatCount = count => {
  if(count) {
    // count = 1.33333 --> Math.round(133.333) / 100 --> 133 /100 --> 1.33
    const newCount = Math.round(count * 100) / 100;    // 小数点以下を四捨五入
    const [int, dec] = newCount.toString().split('.').map(el => parseInt(el, 10));
    
    // // TESTING
    // console.log([int, dec]);
    
    if(!dec) return newCount;   // 小数点がない場合
    
    if(int === 0) {
      const fr = new Fraction(newCount);
      return `${fr.numerator}/${fr.denominator}`;
    } else {
      const fr = new Fraction(newCount - int);
      return `${int} ${fr.numerator}/${fr.denominator}`;
    }
  }
  
  return '?';
};


const createIngredients = ingredients => {
  // オリジナル
  const arrMarkup = ingredients.map(objIng => `
      <li class="recipe__item">
        <svg class="recipe__icon">
          <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(objIng.count)}</div>
        <div class="recipe__ingredient">
          <span class="recipe__unit">${objIng.unit}</span>
          ${objIng.ingredient}
        </div>
      </li>
    `
  );
  
  return arrMarkup.join('');
};


export const renderRecipe = (recipe, isLiked) => {
  const markup = `
    <figure class="recipe__fig">
      <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
      <h1 class="recipe__title">
        <span>${recipe.title}</span>
      </h1>
    </figure>
    
    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="img/icons.svg#icon-stopwatch"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
        <span class="recipe__info-text"> 分</span>
      </div>
      
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="img/icons.svg#icon-man"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text"> 人前</span>
        
        <div class="recipe__info-buttons">
          <button class="btn-tiny btn-decrease">
            <svg>
              <use href="img/icons.svg#icon-circle-with-minus"></use>
            </svg>
          </button>
          <button class="btn-tiny btn-increase">
            <svg>
              <use href="img/icons.svg#icon-circle-with-plus"></use>
            </svg>
          </button>
        </div>
      </div>
      
      <button class="recipe__love">
        <svg>
          <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
        </svg>
      </button>
    </div>
    
    <div class="recipe__ingredients">
      <ul class="recipe__ingredients-list">
        ${createIngredients(recipe.ingredients)}
      </ul>

      <button class="btn-small recipe__btn recipe__btn--add">
        <svg class="search__icon">
          <use href="img/icons.svg#icon-shopping-cart"></use>
        </svg>
        <span>カートに入れる</span>
      </button>
    </div>
    
    <div class="recipe__directions">
      <h2 class="heading-2">調理方法</h2>
      <p class="recipe__directions-text">
        このレシピは<span class="recipe__by">${recipe.author}</span>によって作成されました。
        手順の詳細はリンク先をご確認ください。
      </p>
      <a href="${recipe.url}" class="btn-small recipe__btn" target="_blank">
        <span>詳細はこちらから</span>
        <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>
      </a>
    </div>
  `;
  
  elements.recipe.insertAdjacentHTML('afterbegin', markup);
};


export const updateServingsIngredients = recipe => {
  document.querySelector('.recipe__info-data--people').textContent = recipe.servings;
  
  const countElements = Array.from(document.querySelectorAll('.recipe__count'));
  countElements.forEach((el,i) => {
    el.textContent = formatCount(recipe.ingredients[i].count);
  });
};
