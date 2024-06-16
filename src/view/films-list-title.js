import { createElement } from "../render.js";

export default class FilmsListTitleView {
  #element = null;

  get template() {
    return `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`;
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
