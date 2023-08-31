import { createElement } from '../render';

const createListTemplate = () => `<div class="films-list__container"></div>`;

export default class View {
  getTemplate() {
    return createListTemplate();
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
