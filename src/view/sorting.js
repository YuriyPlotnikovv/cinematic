import { SortingType } from "../const.js";
import AbstractView from "../framework/view/abstract-view.js";

const ACTIVE_CLASS = "sort__button--active";

const createTemplate = (selectedSorting) => {
  return `<ul class="sort">
    <li>
    <a href="#" class="sort__button ${
      selectedSorting === SortingType.DEFAULT ? ACTIVE_CLASS : ""
    }" data-sorting="${SortingType.DEFAULT}">Sort by default</a>
    </li>
    <li>
    <a href="#" class="sort__button ${
      selectedSorting === SortingType.DATE ? ACTIVE_CLASS : ""
    }" data-sorting="${SortingType.DATE}">Sort by date</a>
    </li>
    <li>
    <a href="#" class="sort__button ${
      selectedSorting === SortingType.RATING ? ACTIVE_CLASS : ""
    }" data-sorting="${SortingType.RATING}">Sort by rating</a>
    </li>
  </ul>`;
};
export default class SortingView extends AbstractView {
  #selectedSorting = null;

  constructor(selectedSorting) {
    super();
    this.#selectedSorting = selectedSorting;
  }

  get template() {
    return createTemplate(this.#selectedSorting);
  }

  setSortingChangeHandler(callback) {
    this._callback.sortingChange = callback;

    this.element.addEventListener("click", this.#sortingChangeHandler);
  }

  #sortingChangeHandler = (evt) => {
    if (!evt.target.classList.contains("sort__button")) {
      return;
    }

    evt.preventDefault();
    this._callback.sortingChange(evt.target.dataset.sorting);
  };
}
