import UserRankView from "./view/user-rank";
import FooterStatisticsView from "./view/footer-statistics";

import MainPresenter from "./presenter/main-presenter";
import FiltersPresenter from "./presenter/filters-presenter";

import FilmsModel from "./model/filmsModel";
import CommentsModel from "./model/commentsModel";

import { render } from "./framework/render";
import FilterModel from "./model/filterModel";
import FilmsApi from "./api-services/films-api";
import CommentsApi from "./api-services/comments-api";

const AUTORIZATION = "Basic asD6KnjA33Sg2b3sj4B";
const END_POINT = "https://17.ecmascript.htmlacademy.pro/cinemaddict";

const headerContainer = document.querySelector(".header");
const main = document.querySelector(".main");
const footerContainer = document.querySelector(".footer__statistics");

const filmsModel = new FilmsModel(new FilmsApi(END_POINT, AUTORIZATION));
const commentsModel = new CommentsModel(
  new CommentsApi(END_POINT, AUTORIZATION)
);
const filterModel = new FilterModel();

const mainPresenter = new MainPresenter(
  main,
  filmsModel,
  commentsModel,
  filterModel
);
const filtersPresenter = new FiltersPresenter(main, filmsModel, filterModel);

render(new UserRankView(filmsModel), headerContainer);
render(new FooterStatisticsView(filmsModel), footerContainer);

filtersPresenter.init();
mainPresenter.init();
filmsModel.init();
