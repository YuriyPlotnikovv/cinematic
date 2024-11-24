import SortingView from '../view/sorting';
import FilmsView from '../view/films';
import FilmsListView from '../view/films-list';
import FilmsListEmptyTitleView from '../view/films-list-empty-title';
import FilmsListTitleView from '../view/films-list-title';
import FilmsContainerView from '../view/films-container';
import ShowMoreButtonView from '../view/show-more-button';

import FilmPresenter from './film-presenter';
import FilmPopupPresenter from './film-popup-presenter';

import {render, remove, replace} from '../framework/render';
import {
  FILM_COUNT_PER_STEP,
  FilterType,
  SortingType,
  UpdateType,
  UserAction,
  filter, TimeLimit,
} from '../const';
import {sortingByDate, sortingByRate} from '../utils/utils';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

export default class MainPresenter {
  #sortingComponent = null;
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListTitleComponent = new FilmsListTitleView();
  #filmsListEmptyTitleComponent = new FilmsListEmptyTitleView();
  #filmsContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filmPresenter = new Map();
  #filmPopupPresenter = null;

  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #selectedFilm = null;
  #selectedSorting = SortingType.DEFAULT;

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #isloading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, filmsModel, commentsModel, filterModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

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
    this.#renderBoard();
  };

  #viewActionHandler = async (actionType, updateType, updateFilm, updateComment) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        if (
          this.#filmPresenter.get(updateFilm.id) &&
          !this.#filmPopupPresenter
        ) {
          this.#filmPresenter.get(updateFilm.id).setFilmEditing();
        }

        if (this.#filmPopupPresenter) {
          this.#filmPopupPresenter.setFilmEditing();
        }

        try {
          await this.#filmsModel.updateOnServer(updateType, updateFilm);
        } catch {
          if (
            this.#filmPresenter.get(updateFilm.id) &&
            !this.#filmPopupPresenter
          ) {
            this.#filmPresenter.get(updateFilm.id).setAborting();
          }

          if (this.#filmPopupPresenter) {
            this.#filmPopupPresenter.setAborting({actionType});
          }
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#filmPopupPresenter.setCommentCreating();
        try {
          await this.#commentsModel.add(updateType, updateFilm, updateComment);
          this.#filmPopupPresenter.clearViewData();
        } catch {
          this.#filmPopupPresenter.setAborting({actionType});
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmPopupPresenter.setCommentDeleting(updateComment.id);
        try {
          await this.#commentsModel.delete(updateType, updateFilm, updateComment);
        } catch {
          this.#filmPopupPresenter.setAborting({actionType, commentId: updateComment.id});
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
        if (this.#filmPopupPresenter && this.#selectedFilm.id === data.id) {
          this.#selectedFilm = data;
          this.#renderFilmPopup();
        }
        if (this.#filterModel.get() !== FilterType.ALL) {
          this.#modelEventHandler(UpdateType.MINOR);
        }
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isloading = false;
        this.#renderBoard();
        break;
    }
  };

  #renderBoard() {
    this.#renderSorting(this.#container);
    this.#renderFilmsSection(this.#container);
    this.#renderFilmsListSection(this.#filmsComponent.element);

    const films = this.films.slice(
      0,
      Math.min(this.films.length, FILM_COUNT_PER_STEP)
    );
    if (!this.#isloading && films.length === 0) {
      this.#renderFilmsListTitle(
        this.#filmsListEmptyTitleComponent,
        this.#filmsListComponent.element
      );
    } else if (this.#isloading) {
      this.#renderFilmsListTitle(
        this.#filmsListTitleComponent,
        this.#filmsListComponent.element
      );
    }

    this.#renderFilmsContainer(this.#filmsListComponent.element);

    this.#renderFilmsList(films);
  }

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
    render(this.#filmsListComponent, container);
  }

  #renderFilmsListTitle(component, container) {
    render(component, container);
  }

  #renderFilmsContainer(container) {
    render(this.#filmsContainerComponent, container);
  }

  #renderFilmsList(films) {
    this.#renderFilms(films, this.#filmsContainerComponent);

    if (films.length > FILM_COUNT_PER_STEP) {
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
      this.#addPopupComponent,
      this.#onEscKeydown,
      this.#viewActionHandler
    );
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilmPopup = async () => {
    const comments = await this.#commentsModel.get(this.#selectedFilm);

    const commentsLoadingError = !comments;

    if (!this.#filmPopupPresenter) {
      this.#filmPopupPresenter = new FilmPopupPresenter(
        this.#container,
        this.#closePopupComponent,
        this.#viewActionHandler
      );
    }

    if (!commentsLoadingError) {
      document.addEventListener('keydown', this.#onCtrlEnterKeydown);
    }

    this.#filmPopupPresenter.init(
      this.#selectedFilm,
      comments,
      commentsLoadingError
    );
  };

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

  #addPopupComponent = (film) => {
    if (this.#selectedFilm && this.#selectedFilm.id === film.id) {
      return;
    }

    if (this.#selectedFilm && this.#selectedFilm.id !== film.id) {
      this.#closePopupComponent();
    }

    this.#selectedFilm = film;
    this.#renderFilmPopup();
    document.body.classList.add('hide-overflow');
  };

  #closePopupComponent = () => {
    this.#filmPopupPresenter.destroy();
    this.#filmPopupPresenter = null;
    this.#selectedFilm = null;

    document.removeEventListener('keydown', this.#onEscKeydown);
    document.removeEventListener('keydown', this.#onCtrlEnterKeydown);

    document.body.classList.remove('hide-overflow');
  };

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #clearBoard = ({
                   resetRenderedFilmCount = false,
                   resetSortType = false,
                 } = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#filmsListEmptyTitleComponent);
    remove(this.#showMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#selectedSorting = SortingType.DEFAULT;
    }
  };

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopupComponent();
    }
  };

  #onCtrlEnterKeydown = (evt) => {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      this.#filmPopupPresenter.createComment();
    }
  };
}
