import SortingView from '../view/sorting-view';
import FilmListView from '../view/films-list-view';
import FilmListContainerView from '../view/film-list-container-view';
import FilmsView from '../view/films-view';
import ShowMoreButtonView from '../view/button-show-more-view';
import FilmCardView from '../view/film-card-view';
import FilmDetailsView from '../view/film-details-view';

import { render } from '../render';

export default class FilmPresenter {
  sortComponent = new SortingView();
  filmsComponent = new FilmsView();
  filmListComponent = new FilmListView();
  filmListContainerComponent = new FilmListContainerView();
  buttonShowMoreComponent = new ShowMoreButtonView();

  init = (container, filmsModel, commentsModel) => {
    this.container = container;
    this.filmsModel = filmsModel;
    this.commentsModel = commentsModel;

    this.films = [...filmsModel.get()];

    render(this.sortComponent, this.container);
    render(this.filmsComponent, this.container);
    render(this.filmListComponent, this.filmsComponent.getElement());
    render(
      this.filmListContainerComponent,
      this.filmListComponent.getElement()
    );

    for (let i = 0; i < this.films.length; i++) {
      render(
        new FilmCardView(this.films[i]),
        this.filmListContainerComponent.getElement()
      );
    }

    render(this.buttonShowMoreComponent, this.filmListComponent.getElement());

    const comments = [...this.commentsModel.get(this.films[0])];

    render(
      new FilmDetailsView(this.films[0], comments),
      this.container.parentElement
    );
  };
}
