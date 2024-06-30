import AbstractStatefulView from "../framework/view/abstract-stateful-view.js";
import { getTimeFormat } from "../utils/utils.js";

const createTemplate = ({
  filmInfo,
  userDetails,
  comments,
  checkedEmotion,
  comment,
}) => {
  const {
    poster,
    ageRating,
    title,
    alternativeTitle,
    totalRating,
    director,
    writers,
    actors,
    release,
    runtime,
    genre,
    description,
  } = filmInfo;
  const { watchList, alreadyWatched, favorite } = userDetails;

  const generateNamesList = (names) =>
    names.length < 1 ? names[0] : names.join(", ");

  const generateGenreTitle = (genres) =>
    genres.length > 1 ? "Genres" : "Genre";

  const generateGenresList = (genres) =>
    genres
      .map((genre) => `<span class="film-details__genre">${genre}</span>`)
      .join("");

  const generateCommentsList = () => {
    return comments.map(
      (item) => `<li class="film-details__comment">
                <span class="film-details__comment-emoji">
                  <img src="./images/emoji/${item.emotion}.png" width="55" height="55" alt="emoji-smile">
                </span>
                <div>
                  <p class="film-details__comment-text">${item.comment}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${item.author}</span>
                    <span class="film-details__comment-day">${item.date}</span>
                    <button class="film-details__comment-delete">Delete</button>
                  </p>
                </div>
              </li>`
    );
  };

  return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="images/posters/${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${generateNamesList(
                    writers
                  )}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${generateNamesList(
                    actors
                  )}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${release.date}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${getTimeFormat(runtime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${generateGenreTitle(
                    genre
                  )}</td>
                  <td class="film-details__cell">
                  ${generateGenresList(genre)}
                </tr>
              </table>

              <p class="film-details__film-description">
                  ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist ${
              watchList ? "film-details__control-button--active" : ""
            }" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button film-details__control-button--watched ${
              alreadyWatched ? "film-details__control-button--active" : ""
            }" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite ${
              favorite ? "film-details__control-button--active" : ""
            }" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${
              comments.length
            }</span></h3>

            <ul class="film-details__comments-list">
            ${generateCommentsList(comments)}
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
              ${
                checkedEmotion
                  ? `<img src="images/emoji/${checkedEmotion}.png" width="55" height="55" alt="emoji-${checkedEmotion}">`
                  : ""
              }
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${
                  comment ? comment : ""
                }</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${
                  checkedEmotion === "smile" ? "checked" : ""
                }>
                <label class="film-details__emoji-label" for="emoji-smile" data-emotion-type="smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${
                  checkedEmotion === "sleeping" ? "checked" : ""
                }>
                <label class="film-details__emoji-label" for="emoji-sleeping" data-emotion-type="sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${
                  checkedEmotion === "puke" ? "checked" : ""
                }>
                <label class="film-details__emoji-label" for="emoji-puke" data-emotion-type="puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${
                  checkedEmotion === "angry" ? "checked" : ""
                }>
                <label class="film-details__emoji-label" for="emoji-angry" data-emotion-type="angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`;
};

export default class DetailPopupView extends AbstractStatefulView {
  constructor(film, comments, viewData, updateViewData) {
    super();
    this._state = DetailPopupView.convertFilmToState(
      film,
      comments,
      viewData.emotion,
      viewData.comment,
      viewData.scrollPosition
    );
    this.updateViewData = updateViewData;
    this.#setHandlers();
  }

  get template() {
    return createTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.setScrollPosition();
    this.#setHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
    this.setWatchListClickHandler(this._callback.watchingListClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  static convertFilmToState = (
    film,
    comments,
    checkedEmotion = null,
    comment = null,
    scrollPosition = 0
  ) => ({
    ...film,
    comments,
    checkedEmotion,
    comment,
    scrollPosition,
  });

  setScrollPosition = () => {
    this.element.scrollTop = this._state.scrollPosition;
  };

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;

    this.element
      .querySelector(".film-details__close-btn")
      .addEventListener("click", this.#closeClickHandler, { once: true });
  }

  setWatchListClickHandler(callback) {
    this._callback.watchingListClick = callback;

    this.element
      .querySelector(".film-details__control-button--watchlist")
      .addEventListener("click", this.#watchListClickHandler);
  }

  setAlreadyWatchedClickHandler(callback) {
    this._callback.alreadyWatchedClick = callback;

    this.element
      .querySelector(".film-details__control-button--watched")
      .addEventListener("click", this.#alreadyWatchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;

    this.element
      .querySelector(".film-details__control-button--favorite")
      .addEventListener("click", this.#favoriteClickHandler);
  }

  #closeClickHandler = (evt) => {
    this._callback.closeClick();
  };

  #watchListClickHandler = (evt) => {
    this.#updateViewData();
    this._callback.watchingListClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    this.#updateViewData();
    this._callback.alreadyWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    this.#updateViewData();
    this._callback.favoriteClick();
  };

  #emotionClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      checkedEmotion: evt.currentTarget.dataset.emotionType,
      scrollPosition: this.element.scrollTop,
    });
  };

  #commentInputChangeHandler = (evt) => {
    this._setState({ comment: evt.target.value });
  };

  #setHandlers = () => {
    this.element
      .querySelectorAll(".film-details__emoji-label")
      .forEach((element) => {
        element.addEventListener("click", this.#emotionClickHandler);
      });

    this.element
      .querySelector(".film-details__comment-input")
      .addEventListener("input", this.#commentInputChangeHandler);
  };

  #updateViewData = () => {
    this.updateViewData({
      emotion: this._state.checkedEmotion,
      comment: this._state.comment,
      scrollPosition: this.element.scrollTop,
    });
  };
}
