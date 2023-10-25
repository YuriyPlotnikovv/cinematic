import AbstractView from '../framework/view/abstract-view';

const createStatisticsTemplate = (count = 0) => `<p>${count} movies inside</p>`;

export default class FooterStatisticView extends AbstractView {
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createStatisticsTemplate(this.#count);
  }
}
