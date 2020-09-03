import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value = '';


export const highlightSelected = id => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));   // nodeListからArrayに変換
  resultsArr.forEach(el => {
    el.classList.remove('results__link--active');
  });
  
  document.querySelector(`[href="#${id}"]`).classList.add('results__link--active');
};


const truncateString = (title, limit = 17) => {
  // オリジナル
  if(title.length <= limit) {
    return title;
  }
  
  return `${title.slice(0, limit)} ...`;
};


export const limitRecipeTitle = (title, limit = 17) => {
  if(title.length > limit) {
    const newTitle = [];
    
    title.split(' ').reduce((acc, cur) => {
      if(acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    
    return newTitle.join(' ') + ' ...';
  }
  
  return title;
};


const renderRecipe = recipe => {
  const markup = `
    <li>
      <a href="#${recipe.recipe_id}" class="results__link">
        <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <span class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
          <p class="results__author">${recipe.publisher}</p>
        </span>
      </a>
    </li>
  `;
  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};


const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
  </button>
`;


const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  
  let button;
  if(page === 1 && pages > 1) {
    button = createButton(page, 'next');
  } else if(page < pages) {
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
    `;
  } else if(page === pages) {
    button = createButton(page, 'prev');
  }
  
  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};


// recipes: array
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  
  // sliceで抽出する配列のインデックスにはendは含まれないことに注意
  recipes.slice(start, end).forEach(recipe => renderRecipe(recipe));
  
  renderButtons(page, recipes.length, resPerPage);
};


export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};