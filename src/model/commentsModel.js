import Observable from '../framework/observable';

export default class CommentsModel extends Observable {
  #apiService = null;
  #comments = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get = async (film) => {
    this.#comments = await this.#apiService.get(film);
    return this.#comments;
  };

  add = (updateType, update) => {
    this.#comments.push(update);
    this._notify(updateType, update);
  };

  delete = (updateType, update) => {
    const index = this.#comments.findIndex(
      (comment) => comment.id === update.id
    );

    if (index === -1) {
      throw new Error('Невозможно удалить комментарий');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
