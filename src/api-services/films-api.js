import ApiService from "../framework/api-service";

export default class FilmsApi extends ApiService {
  get = (film) => this._load({ url: "movies" }).then(ApiService.parseResponse);
}
