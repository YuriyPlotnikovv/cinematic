import FilmsListEmptyTitleView from '../view/films-list-empty-title';
import FilmsListTitleView from '../view/films-list-title';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

import FilmsPresenter from '../presenter/films-presenter.js';
import FilmPopupPresenter from './film-popup-presenter';
import FilmsTopRatePresenter from '../presenter/films-top-rated-presenter.js';
import FilmsTopCommentPresenter from '../presenter/films-top-comments-presenter.js';

import {
  TimeLimit,
  UpdateType, UserAction,
} from '../const';
import {render} from '../framework/render';

export default class MainPresenter {
  #filmsListTitleComponent = new FilmsListTitleView();
  #filmsListEmptyTitleComponent = new FilmsListEmptyTitleView();
  #filmsPresenter = null;
  #filmPopupPresenter = null;
  #filmsTopRatePresenter = null;
  #filmsTopCommentPresenter = null;

  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #selectedFilm = null;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, filmsModel, commentsModel, filterModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
    this.#commentsModel.addObserver(this.#modelEventHandler);
  }

  init = () => {};

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#filmPopupPresenter && this.#selectedFilm.id === data.id) {
          this.#selectedFilm = data;
          this.#renderFilmPopup();
        }
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#renderBoard();
        break;
    }
  };

  #viewActionHandler = async (actionType, updateType, updateFilm, updateComment) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        if (this.#filmPopupPresenter) {
          this.#filmPopupPresenter.setFilmEditing();
        }
        try {
          await this.#filmsModel.updateOnServer(updateType, updateFilm);
        } catch {
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

  #renderBoard() {
    if (!this.#isLoading && this.#filmsModel.get().length === 0) {
      this.#renderFilmsListTitle(
        this.#filmsListEmptyTitleComponent,
        this.#container
      );
    } else if (this.#isLoading) {
      this.#renderFilmsListTitle(
        this.#filmsListTitleComponent,
        this.#container
      );
    }

    this.#filmsPresenter = new FilmsPresenter(
      this.#container,
      this.#filmsModel,
      this.#filterModel,
      this.#addPopupComponent,
      this.#onEscKeydown
    );
    this.#filmsPresenter.init();

    this.#filmsTopRatePresenter = new FilmsTopRatePresenter(
      this.#filmsPresenter.getFilmsContainer(),
      this.#filmsModel,
      this.#addPopupComponent,
      this.#onEscKeydown
    );
    this.#filmsTopRatePresenter.init();

    this.#filmsTopCommentPresenter = new FilmsTopCommentPresenter(
      this.#filmsPresenter.getFilmsContainer(),
      this.#filmsModel,
      this.#commentsModel,
      this.#addPopupComponent,
      this.#onEscKeydown
    );
    this.#filmsTopCommentPresenter.init();
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

  #renderFilmsListTitle(component, container) {
    render(component, container);
  }

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
