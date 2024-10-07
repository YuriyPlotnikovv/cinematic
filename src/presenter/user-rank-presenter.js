import {remove, render, replace} from '../framework/render';
import UserRankView from '../view/user-rank';
import {getUserRank} from '../utils/utils';

export default class UserRankPresenter {
  #container = null;
  #UserRankComponent = null;
  #filmsModel = null;
  #userRank = null;

  constructor(container, filmModel) {
    this.#container = container;
    this.#filmsModel = filmModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
  }

  init() {
    this.#userRank = getUserRank(this.#filmsModel.get());

    const prevUserRankComponent = this.#UserRankComponent;

    this.#UserRankComponent = new UserRankView(this.#userRank);

    if (prevUserRankComponent === null) {
      render(this.#UserRankComponent, this.#container);
      return;
    }

    replace(this.#UserRankComponent, prevUserRankComponent);
    remove(prevUserRankComponent);
  }

  #modelEventHandler = () => {
    this.init();
  };
}
