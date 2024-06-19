import UserRankView from "./view/user-rank";
import FiltersView from "./view/filters";
import FooterStatisticsView from "./view/footer-statistics";

import MainPresenter from "./presenter/main-presenter";
import FilmsModel from "./model/filmsModel";
import CommentsModel from "./model/commentsModel";

import { render } from "./framework/render";

const headerContainer = document.querySelector(".header");
const main = document.querySelector(".main");
const footerContainer = document.querySelector(".footer__statistics");

const filmsModel = new FilmsModel();
const films = filmsModel.get();

const commentsModel = new CommentsModel(films);
const mainPresenter = new MainPresenter(main, filmsModel, commentsModel);

render(new UserRankView(films), headerContainer);
render(new FiltersView(films), main);
render(new FooterStatisticsView(films.length), footerContainer);

mainPresenter.init();
