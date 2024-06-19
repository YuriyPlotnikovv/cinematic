import SortingView from "../view/sorting";
import FilmsView from "../view/films";
import FilmsListView from "../view/films-list";
import FilmsListEmptyTitleView from "../view/films-list-empty-title";
import FilmsListTitleView from "../view/films-list-title";
import FilmsContainerView from "../view/films-container";
import ShowMoreButtonView from "../view/show-more-button";
import { render, remove, replace } from "../framework/render";
import { FILM_COUNT_PER_STEP, SortingType } from "../const";
import FilmPresenter from "./film-presenter";
import FilmPopupPresenter from "./film-popup-presenter";
import {
  sortingByDate,
  sortingByDefaut,
  sortingByRate,
  updateItem,
} from "../utils/utils";

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
  #films = [];
  #selectedFilm = null;
  #selectedSorting = SortingType.DEFAULT;

  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(container, filmsModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.get()];

    this.#renderBoard();
  };

  #renderBoard() {
    this.#renderSorting(this.#container);
    this.#renderFilmsSection(this.#container);
    this.#renderFilmsListSection(this.#filmsComponent.element);

    if (this.#films.length === 0) {
      this.#renderFilmsListTitle(
        this.#filmsListEmptyTitleComponent,
        this.#filmsListComponent.element
      );
    } else {
      this.#renderFilmsListTitle(
        this.#filmsListTitleComponent,
        this.#filmsListComponent.element
      );
    }

    this.#renderFilmsContainer(this.#filmsListComponent.element);

    this.#renderFilmsList();
  }

  #sortingFilms = (sortingType) => {
    switch (sortingType) {
      case SortingType.DATE:
        this.#films.sort(sortingByDate);
        break;
      case SortingType.RATING:
        this.#films.sort(sortingByRate);
        break;
      default:
        this.#films.sort(sortingByDefaut);
        break;
    }

    this.#selectedSorting = sortingType;
  };

  #sortingChangeHandler = (sortingType) => {
    if (this.#selectedSorting === sortingType) {
      return;
    }

    this.#sortingFilms(sortingType);
    this.#clearFilmsList();
    this.#renderSorting(this.#container);
    this.#renderFilmsList();
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

  #renderFilmsList() {
    this.#renderFilms(
      0,
      Math.min(this.#films.length, this.#renderedFilmCount),
      this.#filmsContainerComponent
    );

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#filmButtonShowMore(this.#filmsListComponent.element);
    }
  }

  #renderFilms(min, max, container) {
    this.#films.slice(min, max).forEach((film) => {
      this.#renderFilm(film, container);
    });
  }

  #renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(
      container,
      this.#addPopupComponent,
      this.#onEscKeydown,
      this.#filmChangeHandler
    );
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilmPopup() {
    const comments = [...this.#commentsModel.get(this.#selectedFilm)];

    if (!this.#filmPopupPresenter) {
      this.#filmPopupPresenter = new FilmPopupPresenter(
        this.#container,
        this.#closePopupComponent,
        this.#filmChangeHandler
      );
    }

    this.#filmPopupPresenter.init(this.#selectedFilm, comments);
  }

  #filmButtonShowMore(container) {
    render(this.#showMoreButtonComponent, container);

    this.#showMoreButtonComponent.setClickHandler(() =>
      this.#filmButtonShowMoreClickHandler()
    );
  }

  #filmButtonShowMoreClickHandler = () => {
    this.#renderFilms(
      this.#renderedFilmCount,
      Math.min(
        this.#films.length,
        this.#renderedFilmCount + FILM_COUNT_PER_STEP
      ),
      this.#filmsContainerComponent
    );

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #addPopupComponent = (film) => {
    this.#selectedFilm = film;
    this.#renderFilmPopup();
    document.body.classList.add("hide-overflow");
  };

  #closePopupComponent = () => {
    this.#filmPopupPresenter.destroy();
    this.#filmPopupPresenter = null;
    this.#selectedFilm = null;
    document.removeEventListener("keydown", this.#onEscKeydown);
    document.body.classList.remove("hide-overflow");
  };

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #filmChangeHandler = (update) => {
    this.#films = updateItem(this.#films, update);
    this.#filmPresenter.get(update.id).init(update);

    if (this.#filmPopupPresenter && this.#selectedFilm.id === update.id) {
      this.#selectedFilm = update;
      this.#renderFilmPopup();
    }
  };

  #onEscKeydown = (evt) => {
    if (evt.key === "Escape" || evt.key === "Esc") {
      this.#closePopupComponent();
    }
  };
}
