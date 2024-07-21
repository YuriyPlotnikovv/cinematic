import UserRankView from "./view/user-rank";
import FooterStatisticsView from "./view/footer-statistics";

import MainPresenter from "./presenter/main-presenter";
import FiltersPresenter from "./presenter/filters-presenter";

import FilmsModel from "./model/filmsModel";
import CommentsModel from "./model/commentsModel";

import { render } from "./framework/render";
import FilterModel from "./model/filterModel";

const headerContainer = document.querySelector(".header");
const main = document.querySelector(".main");
const footerContainer = document.querySelector(".footer__statistics");

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel);
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
