import UserRankPresenter from './presenter/user-rank-presenter';
import MainPresenter from './presenter/main-presenter';
import FiltersPresenter from './presenter/filters-presenter';
import FooterStatisticsPresenter from './presenter/footer-statistics-presenter';

import FilmsModel from './model/filmsModel';
import CommentsModel from './model/commentsModel';
import FilterModel from './model/filterModel';

import FilmsApi from './api-services/films-api';
import CommentsApi from './api-services/comments-api';

const AUTHORIZATION = 'Basic asD6KnjA33Sg2b3sj4B';
const END_POINT = 'https://17.ecmascript.htmlacademy.pro/cinemaddict';

const headerContainer = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footerContainer = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel(new FilmsApi(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(
  new CommentsApi(END_POINT, AUTHORIZATION), filmsModel
);
const filterModel = new FilterModel();

const userRankPresenter = new UserRankPresenter(headerContainer, filmsModel);
const footerStatisticsPresenter = new FooterStatisticsPresenter(footerContainer, filmsModel);
const mainPresenter = new MainPresenter(
  mainContainer,
  filmsModel,
  commentsModel,
  filterModel
);
const filtersPresenter = new FiltersPresenter(mainContainer, filmsModel, filterModel);

userRankPresenter.init();
footerStatisticsPresenter.init();
mainPresenter.init();
filtersPresenter.init();
filmsModel.init();
