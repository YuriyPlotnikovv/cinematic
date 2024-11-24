import {render, replace, remove} from '../framework/render';
import DetailPopupView from '../view/detail-popup';
import {UpdateType, UserAction} from '../const';

export default class FilmPopupPresenter {
  #container = null;
  #film = null;
  #comments = null;
  #filmPopupComponent = null;
  #closePopupClickHandler = null;
  #filmChangeHandler = null;
  #viewData = {
    emotion: null,
    comment: null,
    scrollPosition: 0,
  };

  constructor(container, closePopupClickHandler, filmChangeHandler) {
    this.#container = container;
    this.#closePopupClickHandler = closePopupClickHandler;
    this.#filmChangeHandler = filmChangeHandler;
  }

  init = (film, comments, commentsLoadingError) => {
    this.#film = film;
    this.#comments = !commentsLoadingError ? comments : [];

    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmPopupComponent = new DetailPopupView(
      this.#film,
      this.#comments,
      this.#viewData,
      this.#updateViewData,
      commentsLoadingError
    );

    this.#filmPopupComponent.setCloseClickHandler(this.#closePopupClickHandler);
    this.#filmPopupComponent.setWatchListClickHandler(
      this.#watchListButtonClickHandler
    );
    this.#filmPopupComponent.setAlreadyWatchedClickHandler(
      this.#alreadyWatchedButtonClickHandler
    );
    this.#filmPopupComponent.setFavoriteClickHandler(
      this.#favoriteButtonClickHandler
    );
    if (!commentsLoadingError) {
      this.#filmPopupComponent.setCommentDeleteClickHandler(
        this.#commentDeleteClickHandler
      );
    }

    if (prevFilmPopupComponent === null) {
      render(this.#filmPopupComponent, this.#container.parentElement);
      return;
    }

    replace(this.#filmPopupComponent, prevFilmPopupComponent);

    this.#filmPopupComponent.setScrollPosition();

    remove(prevFilmPopupComponent);
  };

  clearViewData = () => {
    this.#updateViewData({
      comment: null,
      emotion: null,
      scrollPosition: this.#viewData.scrollPosition,
    });
  };

  setCommentCreating = () => {
    this.#filmPopupComponent.updateElement({
      ...this.#viewData,
      isDisabled: true,
      isCommentCreating: true
    });
  };

  setCommentDeleting = (commentId) => {
    this.#filmPopupComponent.updateElement({
      ...this.#viewData,
      isDisabled: true,
      deleteCommentId: commentId
    });
  };

  setFilmEditing = () => {
    this.#filmPopupComponent.updateElement({
      ...this.#viewData,
      isDisabled: true,
      isFilmEditing: true,
    });
  };

  setAborting = ({actionType, commentId}) => {
    this.#filmPopupComponent.updateElement({
      ...this.#viewData,
      isDisabled: false,
      deleteCommentId: null,
      isFilmEditing: false,
    });

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmPopupComponent.shakeControls();
        break;
      case UserAction.ADD_COMMENT:
        this.#filmPopupComponent.shakeForm();
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmPopupComponent.shakeComment(commentId);
        break;
    }
  };

  createComment = () => {
    this.#filmPopupComponent.setCommentData();

    const {emotion, comment} = this.#viewData;
    if (emotion && comment) {
      this.#filmChangeHandler(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        this.#film,
        {emotion, comment}
      );
    } else {
      this.#filmPopupComponent.shakeForm();
    }
  };

  #watchListButtonClickHandler = () => {
    this.#filmChangeHandler(UserAction.UPDATE_FILM, UpdateType.PATCH, {
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        watchlist: !this.#film.userDetails.watchlist,
      },
    });
  };

  #alreadyWatchedButtonClickHandler = () => {
    this.#filmChangeHandler(UserAction.UPDATE_FILM, UpdateType.PATCH, {
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        alreadyWatched: !this.#film.userDetails.alreadyWatched,
      },
    });
  };

  #favoriteButtonClickHandler = () => {
    this.#filmChangeHandler(UserAction.UPDATE_FILM, UpdateType.PATCH, {
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        favorite: !this.#film.userDetails.favorite,
      },
    });
  };

  #updateViewData = (viewData) => {
    this.#viewData = {...viewData};
  };

  #commentDeleteClickHandler = (commentId) => {
    const deletedComment = this.#comments.find(
      (comment) => comment.id === commentId
    );

    this.#filmChangeHandler(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      this.#film,
      deletedComment
    );
  };

  destroy = () => {
    this.#filmPopupComponent.element.remove();
  };
}
