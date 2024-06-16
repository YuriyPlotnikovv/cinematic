import AbstractView from "../framework/view/abstract-view.js";

export default class ShowMoreButtonView extends AbstractView {
  _callback = [];

  get template() {
    return `<button class="films-list__show-more">Show more</button>`;
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;

    this.element.addEventListener("click", this.#clickHandler);
  };

  #clickHandler = (evt) => {
    this._callback.click();
  };
}
