import { createElement } from '../render';
import { createFilmDetailsInfoTemplate } from './film-details-info-template';
import { createPopupButtonsTemplate } from './film-details-controls-template';
import { createPopupCommentsTemplate } from './film-details-comments-template';
import { createPopupNewCommentTemplate } from './film-details-new-comment-template';

const createPopupTemplate = ({ filmInfo }, comments) =>
  `<section class="film-details">
      <div class="film-details__inner">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>

          ${createFilmDetailsInfoTemplate(filmInfo)}

          ${createPopupButtonsTemplate()}

        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${
              comments.length
            }</span></h3>

            ${createPopupCommentsTemplate(comments)}

            ${createPopupNewCommentTemplate()}

          </section>
        </div>
      </div>
    </section>
`;

export default class FilmDetailsView {
  constructor(film, comments) {
    this.film = film;
    this.comments = comments;
  }

  getTemplate() {
    return createPopupTemplate(this.film, this.comments);
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
