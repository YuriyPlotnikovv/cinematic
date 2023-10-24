import SortingView from '../view/sorting-view';
import FilmListView from '../view/films-list-view';
import FilmListContainerView from '../view/film-list-container-view';
import FilmsView from '../view/films-view';
import ShowMoreButtonView from '../view/button-show-more-view';
import FilmCardView from '../view/film-card-view';
import FilmDetailsView from '../view/film-details-view';
import FilmListEmptyView from '../view/film-list-empty-view';

import { render } from '../render';
import { FILM_COUNT_PER_STEP } from '../const';

export default class FilmPresenter {
  #sortComponent = new SortingView();
  #filmsComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #buttonShowMoreComponent = new ShowMoreButtonView();
  #filmDetailsComponent = null;

  #container = null;
  #filmsModel = null;
  #commentsModel = null;

  #films = [];

  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(container, filmsModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.get()];

    this.#renderFilmBoard();
  };

  #renderFilmBoard() {
    if (this.#films.length === 0) {
      render(new FilmListEmptyView(), this.#container);
      return;
    }

    render(this.#sortComponent, this.#container);
    render(this.#filmsComponent, this.#container);
    render(this.#filmListComponent, this.#filmsComponent.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);

    this.#films
      .slice(0, Math.min(this.#films.length, FILM_COUNT_PER_STEP))
      .forEach((film) =>
        this.#renderFilm(film, this.#filmListContainerComponent)
      );

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      render(this.#buttonShowMoreComponent, this.#filmListComponent.element);
      this.#buttonShowMoreComponent.element.addEventListener('click', (evt) =>
        this.#filmButtonShowMoreClickHandler(evt)
      );
    }
  }

  #filmButtonShowMoreClickHandler(evt) {
    evt.preventDefault();

    this.#films
      .slice(
        this.#renderedFilmCount,
        this.#renderedFilmCount + FILM_COUNT_PER_STEP
      )
      .forEach((film) => {
        this.#renderFilm(film, this.#filmListContainerComponent);
      });

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#buttonShowMoreComponent.element.remove();
      this.#buttonShowMoreComponent.removeElement();
    }
  }

  #renderFilm(film, container) {
    const filmCardcomponent = new FilmCardView(film);
    const linkFilmCardElement = filmCardcomponent.element.querySelector('a');

    linkFilmCardElement.addEventListener('click', () => {
      this.#addFilmDetailsComponent(film);
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    render(filmCardcomponent, container.element);
  }

  #renderFilmDetails(film) {
    const comments = [...this.#commentsModel.get(film)];

    this.#filmDetailsComponent = new FilmDetailsView(film, comments);

    const closeButtonFilmDetailsElement =
      this.#filmDetailsComponent.element.querySelector(
        '.film-details__close-btn'
      );

    closeButtonFilmDetailsElement.addEventListener('click', () => {
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

    render(this.#filmDetailsComponent, this.#container.parentElement);
  }

  #addFilmDetailsComponent = (film) => {
    this.#renderFilmDetails(film);
    document.body.classList.add('hide-overflow');
  };

  #removeFilmDetailsComponent = () => {
    this.#filmDetailsComponent.element.remove();
    this.#filmDetailsComponent = null;
    document.body.classList.remove('hide-overflow');
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };
}
