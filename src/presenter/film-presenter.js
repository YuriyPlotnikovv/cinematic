import { UpdateType, UserAction } from "../const";
import { render, replace, remove } from "../framework/render";
import FilmCardView from "../view/film-card";

export default class FilmPresenter {
  #container = null;
  #filmCardComponent = null;
  #addPopupClickHandler = null;
  #onEscClickHandler = null;
  #filmChangeHandler = null;

  #film = null;

  constructor(
    container,
    addPopupClickHandler,
    onEscClickHandler,
    filmChangeHandler
  ) {
    this.#container = container;
    this.#addPopupClickHandler = addPopupClickHandler;
    this.#onEscClickHandler = onEscClickHandler;
    this.#filmChangeHandler = filmChangeHandler;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(this.#film);

    this.#filmCardComponent.setOpenClickHandler(() => {
      this.#addPopupClickHandler(this.#film);
      document.addEventListener("keydown", this.#onEscClickHandler);
    });

    this.#filmCardComponent.setWatchListClickHandler(
      this.#watchListButtonClickHandler
    );
    this.#filmCardComponent.setAlreadyWatchedClickHandler(
      this.#alreadyWatchedButtonClickHandler
    );
    this.#filmCardComponent.setFavoriteClickHandler(
      this.#favoriteButtonClickHandler
    );

    if (prevFilmCardComponent === null) {
      render(this.#filmCardComponent, this.#container.element);
      return;
    }

    replace(this.#filmCardComponent, prevFilmCardComponent);

    remove(prevFilmCardComponent);
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

  destroy = () => {
    remove(this.#filmCardComponent);
  };
}
