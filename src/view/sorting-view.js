import AbstractView from '../framework/view/abstract-view';

const createSortingTemplate = () =>
  `<ul class="sort">
    <li><a href="#" class="sort__button">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button sort__button--active">Sort by rating</a></li>
  </ul>
`;

export default class SortingView extends AbstractView {
  #element = null;

  get template() {
    return createSortingTemplate();
  }
}
