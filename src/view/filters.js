import { FILTER_TYPE_ALL_NAME, FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createFilterTemplate = ({ name, count }, selectedFilter) => {
  const ACTIVE_CLASS = 'main-navigation__item--active';

  const getFilterName = (filterName) => filterName === FilterType.ALL
    ? FILTER_TYPE_ALL_NAME
    : `${filterName.charAt(0).toUpperCase() + filterName.slice(1)}`;

  const getFilterCount = (filterName) => filterName !== FilterType.ALL
    ? ` <span class="main-navigation__item-count">${count}</span>`
    : '';

  return `<a href="#${name}" class="main-navigation__item ${
    name === selectedFilter ? ACTIVE_CLASS : ''
  }" data-filter-type="${name}">${getFilterName(name)}${getFilterCount(
    name
  )}</a>`;
};

const createTemplate = (filters, selectedFilter) => `<nav class="main-navigation">
    ${filters
    .map((filter) => createFilterTemplate(filter, selectedFilter))
    .join('')}
  </nav>`;

export default class FiltersView extends AbstractView {
  #filters = null;
  #selectedFilter = null;

  constructor(filters, selectedFilter) {
    super();
    this.#filters = filters;
    this.#selectedFilter = selectedFilter;
  }

  get template() {
    return createTemplate(this.#filters, this.#selectedFilter);
  }

  setFilterTypeClickHandler(callback) {
    this._callback.filterTypeClick = callback;
    this.element.addEventListener('click', this.#filterTypeClickHandler);
  }

  #filterTypeClickHandler = (evt) => {
    if (!evt.target.classList.contains('main-navigation__item')) {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeClick(evt.target.dataset.filterType);
  };
}
