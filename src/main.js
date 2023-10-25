import { render } from './framework/render';

import HeaderProfileView from './view/header-profile-view';
import FiltersView from './view/filters-view';
import FooterStatisticView from './view/footer-statistics-view';

import FilmPresenter from './presenter/films-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';

import { getUserStatus } from './utils/user';
import { generateFilter } from './mock/filter';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterElement = bodyElement.querySelector('.footer');
const siteStatisticsElement = siteFooterElement.querySelector(
  '.footer__statistics'
);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel);

const filmPresenter = new FilmPresenter(
  siteMainElement,
  filmsModel,
  commentsModel
);

const userStatus = getUserStatus(filmsModel.get());
const filters = generateFilter(filmsModel.get());
const filmCount = filmsModel.get().length;

render(new HeaderProfileView(userStatus), siteHeaderElement);
render(new FiltersView(filters), siteMainElement);
render(new FooterStatisticView(filmCount), siteStatisticsElement);

filmPresenter.init();
