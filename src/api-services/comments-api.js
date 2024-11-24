import ApiService from '../framework/api-service';
import {NetworkMethod} from '../const';

export default class CommentsApi extends ApiService {
  get = (film) =>
    this._load({ url: `comments/${film.id}` })
      .then(ApiService.parseResponse)
      .catch(() => null);

  add = async (film, comment) => {
    const response = await  this._load({
      url: `comments/${film.id}`,
      method: NetworkMethod.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'})
    });
    return await ApiService.parseResponse(response);
  };

  delete = async (comment) => {
    await  this._load({
      url: `comments/${comment.id}`,
      method: NetworkMethod.DELETE,
      headers: new Headers({'Content-Type': 'application/json'})
    });
  };
}
