import { createElement } from '../render';

const createPageContentTemplate = () => `<section class="films"></section>`;

export default class FilmsView {
  getTemplate() {
    return createPageContentTemplate();
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
