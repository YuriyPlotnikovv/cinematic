import AbstractView from "../framework/view/abstract-view.js";

export default class FilmsListTitleView extends AbstractView {
  get template() {
    return `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`;
  }
}
