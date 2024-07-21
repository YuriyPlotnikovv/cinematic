import AbstractView from "../framework/view/abstract-view.js";

const createTemplate = (filmsLength) => {
  return `<p>${filmsLength} movies inside</p>`;
};

export default class FooterStatisticsView extends AbstractView {
  #filmsLength = null;

  constructor(filmsModel) {
    super();
    this.#filmsLength = filmsModel.get().length;
  }

  get template() {
    return createTemplate(this.#filmsLength);
  }
}
