import {remove, render, replace} from "../framework/render";
import FooterStatisticsView from "../view/footer-statistics";
import {UpdateType} from "../const";

export default class FooterStatisticsPresenter {
  #container = null;
  #FooterStatisticsComponent = null;
  #filmsModel = null;
  #filmsCount = null;

  constructor(container, filmModel) {
    this.#container = container;
    this.#filmsModel = filmModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
  }

  init() {
    this.#filmsCount = this.#filmsModel.get().length;

    const prevFooterStatisticsComponent = this.#FooterStatisticsComponent;

    this.#FooterStatisticsComponent = new FooterStatisticsView(this.#filmsCount);

    if (prevFooterStatisticsComponent === null) {
      render(this.#FooterStatisticsComponent, this.#container);
      return;
    }

    replace(this.#FooterStatisticsComponent, prevFooterStatisticsComponent);
    remove(prevFooterStatisticsComponent);
  }

  #modelEventHandler = (updateType) => {
    if (updateType === UpdateType.INIT) {
      this.init();
    }
  };
}
