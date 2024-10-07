import AbstractView from "../framework/view/abstract-view.js";

const createTemplate = (filmsLength) => {
  return `<p>${filmsLength} movies inside</p>`;
};

export default class FooterStatisticsView extends AbstractView {
  #filmsLength = null;

  constructor(filmsLength) {
    super();
    this.#filmsLength = filmsLength;
  }

  get template() {
    return createTemplate(this.#filmsLength);
  }
}
