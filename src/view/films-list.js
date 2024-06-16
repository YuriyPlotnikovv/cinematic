import AbstractView from "../framework/view/abstract-view.js";

export default class FilmsListView extends AbstractView {
  get template() {
    return `<section class="films-list"></section>`;
  }
}
