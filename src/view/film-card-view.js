import { createElement } from '../render';
import { createCardInfoTemplate } from './film-card-info-template';
import { createCardButtonsTemplate } from './film-card-buttons-template';

const createCardTemplate = ({ filmInfo, comments }) =>
  `<article class="film-card">

    ${createCardInfoTemplate(filmInfo, comments.length)}

    ${createCardButtonsTemplate()}

  </article>`;

export default class FilmCardView {
  #element = null;
  #film = null;

  constructor(film) {
    this.#film = film;
  }

  get template() {
    return createCardTemplate(this.#film);
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
