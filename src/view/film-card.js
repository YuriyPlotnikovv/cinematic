import AbstractView from "../framework/view/abstract-view.js";
import { getTimeFormat } from "../utils/utils.js";

const createTemplate = ({ filmInfo, userDetails, comments }) => {
  const { title, totalRating, release, runtime, genre, poster, description } =
    filmInfo;

  return `<article class="film-card">
        <a class="film-card__link">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${totalRating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${release.date}</span>
            <span class="film-card__duration">${getTimeFormat(runtime)}</span>
            <span class="film-card__genre">${genre[0]}</span>
          </p>
          <img src="${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${description}</p>
          <span class="film-card__comments">${comments.length} comments</span>
        </a>
        <div class="film-card__controls">
          <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${
            userDetails.watchList ? "film-card__controls-item--active" : ""
          }" type="button">Add to watchlist</button>
          <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${
            userDetails.alreadyWatched ? "film-card__controls-item--active" : ""
          }" type="button">Mark as watched</button>
          <button class="film-card__controls-item film-card__controls-item--favorite ${
            userDetails.favorite ? "film-card__controls-item--active" : ""
          }" type="button">Mark as favorite</button>
        </div>
      </article>`;
};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createTemplate(this.#film);
  }

  setOpenClickHandler(callback) {
    this._callback.openClick = callback;

    this.element
      .querySelector(".film-card__link")
      .addEventListener("click", this.#openClickHandler);
  }

  #openClickHandler = (evt) => {
    this._callback.openClick();
  };

  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;

    this.element
      .querySelector(".film-card__controls-item--add-to-watchlist")
      .addEventListener("click", this.#watchListClickHandler);
  }

  #watchListClickHandler = (evt) => {
    this._callback.watchListClick();
  };

  setAlreadyWatchedClickHandler(callback) {
    this._callback.alreadyWatchedClick = callback;

    this.element
      .querySelector(".film-card__controls-item--mark-as-watched")
      .addEventListener("click", this.#alreadyWatchedClickHandler);
  }

  #alreadyWatchedClickHandler = (evt) => {
    this._callback.alreadyWatchedClick();
  };

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;

    this.element
      .querySelector(".film-card__controls-item--favorite")
      .addEventListener("click", this.#favoriteClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    this._callback.favoriteClick();
  };
}
