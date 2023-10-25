import AbstractView from '../framework/view/abstract-view';

const createNewButtonTemplate = () =>
  `<button class="films-list__show-more">Show more</button>`;

export default class ShowMoreButtonView extends AbstractView {
  get template() {
    return createNewButtonTemplate();
  }

  setButtonClickHandler(callback) {
    this._callback.buttonClick = callback;
    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.buttonClick();
  };
}
