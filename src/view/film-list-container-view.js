import { createElement } from '../render';

const createListTemplate = () => `<div class="films-list__container"></div>`;

export default class FilmListContainerView {
  #element = null;

  get template() {
    return createListTemplate();
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
