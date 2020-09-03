import { elements } from './base';
import { limitRecipeTitle } from './searchView';

// isLiked as boolean
export const toggleLikeBtn = isLiked => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numLikes => {
  elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

// like = {id, title, author, img}
export const renderLike = like => {
  const markup = `
    <li>
      <a href="#${like.id}" class="likes__link">
        <figure class="likes__fig">
          <img src="${like.img}" alt="${like.title}">
        </figure>
        <span class="likes__data">
          <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
          <p class="likes__author">${like.author}</p>
        </span>
      </a>
    </li>
  `;
  elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
  const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
  if(el) {
    el.parentElement.removeChild(el);
  } else {
    alert('お気に入りアイテムが見つかりません！');
  }
};
