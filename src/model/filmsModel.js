import { generateFilms } from "../mock/films";

export default class FilmsModel {
  #films = generateFilms();

  get = () => this.#films;
}
