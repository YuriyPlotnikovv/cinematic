import { createElement } from '../render';

const createStatisticsTemplate = () => `<p>130 291 movies inside</p>`;

export default class FooterStatisticView {
  getTemplate() {
    return createStatisticsTemplate();
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
