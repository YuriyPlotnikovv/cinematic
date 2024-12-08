import {FILM_COUNT_PER_STEP, filter, FilterType, SortingType, TimeLimit, UpdateType, UserAction} from '../const';
import {sortingByDate, sortingByRate} from '../utils/utils';
import {remove, render, replace, RenderPosition} from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

import FilmsView from '../view/films';
import FilmsListView from '../view/films-list';
import FilmsContainerView from '../view/films-container';
import ShowMoreButtonView from '../view/show-more-button';
import SortingView from '../view/sorting';

import FilmPresenter from './film-presenter';

export default class FilmsPresenter {
  #sortingComponent = null;
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #container = null;
  #filmsModel = null;
  #filterModel = null;
  #filmCardClickHandler = null;
  #onEscKeydown = null;
  #filmPresenter = new Map();

  #selectedSorting = SortingType.DEFAULT;
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, filmsModel, filterModel, filmCardClickHandler, onEscKeydown) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#filmCardClickHandler = filmCardClickHandler;
    this.#onEscKeydown = onEscKeydown;


    this.#filmsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get films() {
    const filterType = this.#filterModel.get();
    const films = this.#filmsModel.get();
    const filteredFilms = filter[filterType](films);

    switch (this.#selectedSorting) {
      case SortingType.DATE:
        filteredFilms.sort(sortingByDate);
        break;
      case SortingType.RATING:
        filteredFilms.sort(sortingByRate);
        break;
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderFilmBoard();
  };

  getFilmsContainer = () => this.#filmsComponent.element;

  #renderFilmBoard() {
    const films = this.films.slice(
      0,
      Math.min(this.films.length, FILM_COUNT_PER_STEP)
    );

    this.#renderSorting(this.#container);
    this.#renderFilmsSection(this.#container);
    this.#renderFilmsListSection(this.#filmsComponent.element);
    this.#renderFilmsContainer(this.#filmsListComponent.element);
    this.#renderFilmsList(films);
  }

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#filmPresenter.get(data.id)) {
          this.#filmPresenter.get(data.id).init(data);
        }
        if (this.#filterModel.get() !== FilterType.ALL) {
          this.#modelEventHandler(UpdateType.MINOR);
        }
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderFilmBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmBoard();
        break;
    }
  };

  #viewActionHandler = async (actionType, updateType, updateFilm) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        if (this.#filmPresenter.get(updateFilm.id)) {
          this.#filmPresenter.get(updateFilm.id).setFilmEditing();
        }
        try {
          await this.#filmsModel.updateOnServer(updateType, updateFilm);
        } catch {
          if (this.#filmPresenter.get(updateFilm.id)) {
            this.#filmPresenter.get(updateFilm.id).setAborting();
          }
        }
        break;
    }

    this.#uiBlocker.unblock();
  };


  #sortingChangeHandler = (sortingType) => {
    if (this.#selectedSorting === sortingType) {
      return;
    }

    this.#selectedSorting = sortingType;

    const films = this.films.slice(
      0,
      Math.min(this.films.length, FILM_COUNT_PER_STEP)
    );

    this.#clearFilmsList();
    this.#renderSorting(this.#container);
    this.#renderFilmsList(films);
  };

  #renderSorting(container) {
    if (!this.#sortingComponent) {
      this.#sortingComponent = new SortingView(this.#selectedSorting);
      render(this.#sortingComponent, container);
    } else {
      const updatedSortingComponent = new SortingView(this.#selectedSorting);
      replace(updatedSortingComponent, this.#sortingComponent);
      this.#sortingComponent = updatedSortingComponent;
    }

    this.#sortingComponent.setSortingChangeHandler(this.#sortingChangeHandler);
  }

  #renderFilmsSection(container) {
    render(this.#filmsComponent, container);
  }

  #renderFilmsListSection(container) {
    render(this.#filmsListComponent, container, RenderPosition.BEFOREBEGIN);
  }

  #renderFilmsContainer(container) {
    render(this.#filmsContainerComponent, container);
  }

  #renderFilmsList(films) {
    this.#renderFilms(films, this.#filmsContainerComponent);

    if (this.films.length > FILM_COUNT_PER_STEP) {
      this.#filmButtonShowMore(this.#filmsListComponent.element);
    }
  }

  #renderFilms(films, container) {
    films.forEach((film) => {
      this.#renderFilm(film, container);
    });
  }

  #renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(
      container,
      this.#filmCardClickHandler,
      this.#onEscKeydown,
      this.#viewActionHandler
    );
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #filmButtonShowMore(container) {
    render(this.#showMoreButtonComponent, container);

    this.#showMoreButtonComponent.setClickHandler(() =>
      this.#filmButtonShowMoreClickHandler()
    );
  }

  #filmButtonShowMoreClickHandler = () => {
    const filmsCount = this.films.length;

    const newRenderedFilmsCount = Math.min(
      filmsCount,
      this.#renderedFilmCount + FILM_COUNT_PER_STEP
    );

    const films = this.films.slice(
      this.#renderedFilmCount,
      newRenderedFilmsCount
    );

    this.#renderFilms(films, this.#filmsContainerComponent);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= filmsCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #clearBoard = ({ resetRenderedFilmCount = false, resetSortType = false, } = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#showMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#selectedSorting = SortingType.DEFAULT;
    }
  };
}
