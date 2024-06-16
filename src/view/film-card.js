import { createElement } from "../render.js";
import { getTimeFormat } from "../utils/utils.js";

const createTemplate = ({ filmInfo, comments }) => {
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
          <img src="images/posters/${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${description}</p>
          <span class="film-card__comments">${comments.length} comments</span>
        </a>
        <div class="film-card__controls">
          <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
          <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
          <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
        </div>
      </article>`;
};

export default class FilmCardView {
  #film = null;
  #element = null;

  constructor(film) {
    this.#film = film;
  }

  get template() {
    return createTemplate(this.#film);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
