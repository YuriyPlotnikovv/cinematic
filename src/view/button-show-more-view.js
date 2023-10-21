import { createElement } from '../render';

const createNewButtonTemplate = () =>
  `<button class="films-list__show-more">Show more</button>`;

export default class ShowMoreButtonView {
  getTemplate() {
    return createNewButtonTemplate();
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
