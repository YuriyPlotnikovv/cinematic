import FilmListExtraView from '../view/films-list-extra.js';
import FilmListContainerView from '../view/films-container.js';

import FilmPresenter from './film-presenter.js';

import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {render} from '../framework/render.js';
import {sortFilmsByComments} from '../utils/utils.js';
import {UserAction, UpdateType, TimeLimit, ExtraFilmListType, FILM_EXTRA_COUNT} from '../const.js';

export default class FilmsTopCommentPresenter {
  #filmExtraCommentComponent = new FilmListExtraView(ExtraFilmListType.COMMENT);
  #filmListContainerComponent = new FilmListContainerView();

  #container = null;
  #filmsModel = null;
  #commentsModel = null;

  #filmPresenter = new Map();
  #filmCardClickHandler = null;
  #onEscKeyDown = null;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, filmsModel, commentsModel, filmCardClickHandler, onEscKeyDown) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filmCardClickHandler = filmCardClickHandler;
    this.#onEscKeyDown = onEscKeyDown;

    this.#filmsModel.addObserver(this.#modelEventHandler);
    this.#commentsModel.addObserver(this.#modelEventHandler);
  }

  get films() {
    return [...this.#filmsModel.get()]
      .sort(sortFilmsByComments)
      .slice(0, FILM_EXTRA_COUNT);
  }

  init = () => {
    this.#renderExtraCommentBoard();
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

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#filmPresenter.get(data.id)) {
          this.#filmPresenter.get(data.id).init(data);
        }
        break;
      case UpdateType.EXTRA:
        this.#filmPresenter.forEach((presenter) => presenter.destroy());
        this.#filmPresenter.clear();

        this.#renderFilmList(this.films);
        break;
    }
  };

  #renderFilmListContainer(container) {
    render(this.#filmExtraCommentComponent, container);
    render(this.#filmListContainerComponent, this.#filmExtraCommentComponent.element);
  }

  #renderFilmList(films) {
    this.#renderFilms(
      films,
      this.#filmListContainerComponent
    );
  }

  #renderFilms(films, container) {
    films
      .forEach((film) =>
        this.#renderFilm(film, container)
      );
  }

  #renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(
      container,
      this.#filmCardClickHandler,
      this.#onEscKeyDown,
      this.#viewActionHandler,
    );
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderExtraCommentBoard() {
    const films = this.films;

    if (films.length > 0) {
      this.#renderFilmListContainer(this.#container);
      this.#renderFilmList(films);
    }
  }
}
