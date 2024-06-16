import { generateComments } from "../mock/comments";

export default class CommentsModel {
  #films = null;
  #allComments = [];
  #comments = [];

  constructor(films) {
    this.#films = films;
    this.#generateAllComments();
  }

  #generateAllComments() {
    this.#allComments = generateComments(this.#films);
  }

  get = (film) => {
    this.#comments = film.comments.map((id) =>
      this.#allComments.find((comment) => comment.id === id)
    );

    return this.#comments;
  };
}
