import { nanoid } from "nanoid";
import { render, replace, remove } from "../framework/render";
import DetailPopupView from "../view/detail-popup";
import { UpdateType, UserAction } from "../const";

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

  createComment = () => {
    this.#filmPopupComponent.setCommentData();

    const { emotion, comment } = this.#viewData;

    if (emotion && comment) {
      const newCommentId = nanoid();

      const createdComment = {
        id: newCommentId,
        author: "Unknow Raccoon",
        date: new Date(),
        emotion,
        comment,
      };

      this.#filmChangeHandler(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        {
          ...this.#film,
          comments: [...this.#film.comments, newCommentId],
        },
        createdComment
      );
    }
  };

  #watchListButtonClickHandler = () => {
    this.#filmChangeHandler(UserAction.UPDATE_FILM, UpdateType.PATCH, {
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        watchList: !this.#film.userDetails.watchList,
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
    this.#viewData = { ...viewData };
  };

  #commentDeleteClickHandler = (commentId) => {
    const filmCommentIdIndex = this.#film.comments.findIndex(
      (filmCommentId) => filmCommentId === commentId
    );

    const deletedComment = this.#comments.find(
      (comment) => comment.id === commentId
    );

    this.#filmChangeHandler(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {
        ...this.#film,
        comments: [
          ...this.#film.comments.slice(0, filmCommentIdIndex),
          ...this.#film.comments.slice(filmCommentIdIndex + 1),
        ],
      },
      deletedComment
    );
  };

  destroy = () => {
    this.#filmPopupComponent.element.remove();
  };
}
