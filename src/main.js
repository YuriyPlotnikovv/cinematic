import { render } from './render';

import HeaderProfileView from './view/header-profile-view';
import FiltersView from './view/filters-view';
import FooterStatisticView from './view/footer-statistics-view';

import FilmPresenter from './presenter/films-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterElement = bodyElement.querySelector('.footer');
const siteStatisticsElement = siteFooterElement.querySelector(
  '.footer__statistics'
);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel);

const filmPresenter = new FilmPresenter();

render(new HeaderProfileView(), siteHeaderElement);
render(new FiltersView(), siteMainElement);
render(new FooterStatisticView(), siteStatisticsElement);

filmPresenter.init(siteMainElement, filmsModel, commentsModel);
