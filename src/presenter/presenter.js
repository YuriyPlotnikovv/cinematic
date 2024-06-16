import SortingView from "../view/sorting";
import FilmsView from "../view/films";
import FilmsListView from "../view/films-list";
import FilmsListEmptyTitleView from "../view/films-list-empty-title";
import FilmsListTitleView from "../view/films-list-title";
import FilmsContainerView from "../view/films-container";
import FilmCardView from "../view/film-card";
import ShowMoreButtonView from "../view/show-more-button";
import DetailPopupView from "../view/detail-popup";

import { render } from "../render";
import { FILM_COUNT_PER_STEP } from "../const";

export default class Presenter {
  #sortingComponent = new SortingView();
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListTitleComponent = new FilmsListTitleView();
  #filmsListEmptyTitleComponent = new FilmsListEmptyTitleView();
  #filmsContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filmPopupComponent = null;

  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #films = [];

  #renderedFilmCount = FILM_COUNT_PER_STEP;

  init = (container, filmsModel, commentsModel) => {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#films = [...this.#filmsModel.get()];

    this.#renderBoard();
  };

  #renderBoard() {
    render(this.#sortingComponent, this.#container);
    render(this.#filmsComponent, this.#container);
    render(this.#filmsListComponent, this.#filmsComponent.element);

    if (this.#films.length === 0) {
      render(
        this.#filmsListEmptyTitleComponent,
        this.#filmsListComponent.element
      );
    } else {
      render(this.#filmsListTitleComponent, this.#filmsListComponent.element);
    }

    render(this.#filmsContainerComponent, this.#filmsListComponent.element);

    this.#films
      .slice(0, Math.min(this.#films.length, this.#renderedFilmCount))
      .forEach((film) => {
        this.#renderFilm(film, this.#filmsContainerComponent);
      });

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      render(this.#showMoreButtonComponent, this.#filmsListComponent.element);

      this.#showMoreButtonComponent.element.addEventListener(
        "click",
        this.#filmButtonShowMore
      );
    }
  }

  #renderFilm(film, container) {
    const filmCardComponent = new FilmCardView(film);

    const openPopupLink =
      filmCardComponent.element.querySelector(".film-card__link");

    openPopupLink.addEventListener("click", () => {
      this.#addPopupComponent(film);
      document.addEventListener("keydown", this.#onEscKeydown);
    });

    render(filmCardComponent, container.element);
  }

  #renderFilmPopup(film) {
    const comments = [...this.#commentsModel.get(film)];

    this.#filmPopupComponent = new DetailPopupView(film, comments);

    render(this.#filmPopupComponent, this.#container.parentElement);

    const closePopupLink = this.#filmPopupComponent.element.querySelector(
      ".film-details__close-btn"
    );

    closePopupLink.addEventListener("click", this.#removePopupComponent, {
      once: true,
    });
  }

  #filmButtonShowMore = () => {
    this.#films
      .slice(
        this.#renderedFilmCount,
        Math.min(
          this.#films.length,
          this.#renderedFilmCount + FILM_COUNT_PER_STEP
        )
      )
      .forEach((film) => {
        this.#renderFilm(film, this.#filmsContainerComponent);
      });

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent = null;
    }
  };

  #addPopupComponent = (film) => {
    this.#renderFilmPopup(film);
    document.body.classList.add("hide-overflow");
  };

  #removePopupComponent = () => {
    this.#filmPopupComponent.element.remove();
    this.#filmPopupComponent = null;
    document.body.classList.remove("hide-overflow");
    document.removeEventListener("keydown", this.#onEscKeydown);
  };

  #onEscKeydown = (evt) => {
    if (evt.key === "Escape" || evt.key === "Esc") {
      this.#removePopupComponent();
    }
  };
}
