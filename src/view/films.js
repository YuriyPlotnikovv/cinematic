import AbstractView from "../framework/view/abstract-view.js";

export default class FilmsView extends AbstractView {
  get template() {
    return `<sections class="films"></sections>`;
  }
}
