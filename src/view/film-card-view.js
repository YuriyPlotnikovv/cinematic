import { createElement } from '../render';
import { createCardInfoTemplate } from './film-card-info-template';
import { createCardButtonsTemplate } from './film-card-buttons-template';

const createCardTemplate = ({ filmInfo, comments }) =>
  `<article class="film-card">

    ${createCardInfoTemplate(filmInfo, comments.length)}

    ${createCardButtonsTemplate()}

  </article>`;

export default class FilmCardView {
  constructor(film) {
    this.film = film;
  }

  getTemplate() {
    return createCardTemplate(this.film);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
