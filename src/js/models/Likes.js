/*
  Likes {
    likes: [
      {
        id,
        title,
        author,
        img
      }
    ]
  }
*/
export default class Likes {
  constructor() {
    this.likes = [];
  }
  
  
  addLike(id, title, author, img) {
    const like = {id, title, author, img};
    this.likes.push(like);
    
    this.persistData();
    
    return like;
  }
  
  
  deleteLike(id) {
    const newArrLikes = this.likes.filter(el => el.id !== id);
    this.likes = newArrLikes;
    
    this.persistData();
  }
  
  
  // お気に入り済みであればtrueを返す
  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1;
  }
  
  
  getNumLikes() {
    return this.likes.length;
  }
  
  
  // ローカルストレージに保存
  persistData() {
    window.localStorage.setItem('likes', JSON.stringify(this.likes));
  }
  
  
  // ローカルストレージからlikesを復元する
  readStorage() {
    const storage = JSON.parse(window.localStorage.getItem('likes'));

    if(storage) this.likes = storage;
  }
}