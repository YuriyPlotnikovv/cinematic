import { createCardInfoTemplate } from './film-card-info-template';
import { createCardButtonsTemplate } from './film-card-buttons-template';
import AbstractView from '../framework/view/abstract-view';

const createCardTemplate = ({ filmInfo, comments }) =>
  `<article class="film-card">

    ${createCardInfoTemplate(filmInfo, comments.length)}

    ${createCardButtonsTemplate()}

  </article>`;

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createCardTemplate(this.#film);
  }
}
