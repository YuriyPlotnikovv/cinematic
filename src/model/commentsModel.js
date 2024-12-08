import Observable from '../framework/observable';
import {UpdateType} from '../const';

export default class CommentsModel extends Observable {
  #apiService = null;
  #filmsModel = null;
  #comments = [];

  constructor(apiService, filmsModel) {
    super();
    this.#apiService = apiService;
    this.#filmsModel = filmsModel;
  }

  get = async (film) => {
    this.#comments = await this.#apiService.get(film);
    return this.#comments;
  };

  add = async (updateType, film, newComment) => {
    try {
      const response = await this.#apiService.add(film, newComment);

      this.#comments = response.comments;
      this.#filmsModel.updateOnClient({
        updateType,
        update: response.movie,
        isAdapted: false
      });

      this._notify(UpdateType.EXTRA);
    } catch {
      throw new Error('Невозможно добавить комментарий');
    }
  };

  delete = async (updateType, film, deletedComment) => {
    const index = this.#comments.findIndex(
      (comment) => comment.id === deletedComment.id
    );

    if (index === -1) {
      throw new Error('Невозможно удалить комментарий');
    }

    try {
      await this.#apiService.delete(deletedComment);

      const updateFilm = {
        ...film,
        comments: [
          ...film.comments.slice(0, index),
          ...film.comments.slice(index + 1)
        ]
      };
      this.#filmsModel.updateOnClient({
        updateType,
        update: updateFilm,
        isAdapted: true
      });

      this._notify(UpdateType.EXTRA);
    } catch {
      throw new Error('Невозможно удалить комментарий');
    }
  };
}
