import AbstractView from "../framework/view/abstract-view.js";
import { getUserRank } from "../utils/utils.js";

const createTemplate = (userRank) => {
  return `<section class="header__profile profile">
  ${
    userRank !== null
      ? `<p class="profile__rating">${userRank}</p>`
      : ""
  }
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRankView extends AbstractView {
  #userRank = null;

  constructor(userRank) {
    super();
    this.#userRank = userRank;
  }

  get template() {
    return createTemplate(this.#userRank);
  }
}
