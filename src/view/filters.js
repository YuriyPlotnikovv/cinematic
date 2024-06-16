import AbstractView from "../framework/view/abstract-view.js";

const createTemplate = (films) => {
  const watchlistFilmsCount = films.filter(
    (film) => film.userDetails.watchList
  ).length;

  const watchedFilmsCount = films.filter(
    (film) => film.userDetails.alreadyWatched
  ).length;

  const favoritesFilmsCount = films.filter(
    (film) => film.userDetails.favorite
  ).length;

  return `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistFilmsCount}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${watchedFilmsCount}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoritesFilmsCount}</span></a>
  </nav>`;
};

export default class FiltersView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createTemplate(this.#films);
  }
}
