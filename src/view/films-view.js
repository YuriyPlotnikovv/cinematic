import AbstractView from '../framework/view/abstract-view';

const createPageContentTemplate = () => `<section class="films"></section>`;

export default class FilmsView extends AbstractView {
  get template() {
    return createPageContentTemplate();
  }
}
