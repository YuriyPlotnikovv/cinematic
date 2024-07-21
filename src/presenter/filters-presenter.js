import { FilterType, filter, UpdateType } from "../const";
import Observable from "../framework/observable";
import { render, replace, remove } from "../framework/render";
import FiltersView from "../view/filters";

export default class FiltersPresenter extends Observable {
  #container = null;
  #filterComponent = null;
  #selectedFilter = null;
  #filmsModel = null;
  #filterModel = null;

  constructor(container, filmsModel, filterModel) {
    super();

    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get filters() {
    const films = this.#filmsModel.get();

    return [
      {
        name: FilterType.ALL,
        count: filter[FilterType.ALL](films).length,
      },
      {
        name: FilterType.WATCHLIST,
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        name: FilterType.HISTORY,
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        name: FilterType.FAVORITES,
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  init() {
    this.#selectedFilter = this.#filterModel.get();

    const filters = this.filters;

    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(filters, this.#selectedFilter);
    this.#filterComponent.setFilterTypeClickHandler(
      this.#filterTypeChangeHandler
    );

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #modelEventHandler = () => {
    this.init();
  };

  #filterTypeChangeHandler = (filterType) => {
    if (this.#filterModel.get === filterType) {
      return;
    }

    this.#filterModel.set(UpdateType.MAJOR, filterType);
  };
}
