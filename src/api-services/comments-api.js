import ApiService from "../framework/api-service";

export default class CommentsApi extends ApiService {
  get = (film) =>
    this._load({ url: `comments/${film.id}` })
      .then(ApiService.parseResponse)
      .catch(() => null);

  update = async (film) => {
    const response = await  this._load({
      url: `comments/${film.id}`,
      method: 'PUT',
      body: JSON.stringify(film),
      headers: new Headers({'Content-Type': 'application/json'})
    });
    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };
}
