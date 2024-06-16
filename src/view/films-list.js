import { createElement } from "../render.js";

export default class FilmsListView {
  #element = null;

  get template() {
    return `<section class="films-list"></section>`;
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
