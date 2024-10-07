import ApiService from "../framework/api-service";

export default class CommentsApi extends ApiService {
  get = (film) =>
    this._load({ url: `comments/${film.id}` })
      .then(ApiService.parseResponse)
      .catch(() => null);
}
