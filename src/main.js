import UserRankView from "./view/user-rank";
import FiltersView from "./view/filters";
import FooterStatisticsView from "./view/footer-statistics";

import Presenter from "./presenter/presenter";
import FilmsModel from "./model/filmsModel";
import CommentsModel from "./model/commentsModel";

import { render } from "./render";

const headerContainer = document.querySelector(".header");
const main = document.querySelector(".main");
const footerContainer = document.querySelector(".footer__statistics");
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel);
const presenter = new Presenter();

render(new UserRankView(), headerContainer);
render(new FiltersView(), main);
render(new FooterStatisticsView(), footerContainer);

presenter.init(main, filmsModel, commentsModel);
