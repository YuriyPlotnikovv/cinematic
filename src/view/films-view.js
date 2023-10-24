import { createElement } from '../render';

const createPageContentTemplate = () => `<section class="films"></section>`;

export default class FilmsView {
  #element = null;

  get template() {
    return createPageContentTemplate();
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
