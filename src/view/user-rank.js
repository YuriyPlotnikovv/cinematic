import AbstractView from "../framework/view/abstract-view.js";
import { getUserRank } from "../utils/utils.js";

const createTemplate = (films) => {
  const userRank = getUserRank(films);

  return `<section class="header__profile profile">
  ${
    userRank !== null
      ? `<p class="profile__rating">${getUserRank(films)}</p>`
      : ""
  }
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRankView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createTemplate(this.#films);
  }
}
