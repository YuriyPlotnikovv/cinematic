import { createElement } from "../render.js";

export default class FilmsListEmptyTitleView {
  #element = null;

  get template() {
    return `<h2 class="films-list__title">There are no movies in our database</h2>`;
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
