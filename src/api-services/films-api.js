import ApiService from '../framework/api-service';
import {NetworkMethod} from '../const';

export default class FilmsApi extends ApiService {
  get = () => this._load({ url: 'movies' }).then(ApiService.parseResponse);

  update = async (film) => {
    const response = await  this._load({
      url: `movies/${film.id}`,
      method: NetworkMethod.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'})
    });
    return await ApiService.parseResponse(response);
  };


  #adaptToServer(film) {
    const adaptedFilm = {
      ...film,
      ['film_info']: {
        ...film.filmInfo,
        ['alternative_title']: film.filmInfo.alternativeTitle,
        ['total_rating']: film.filmInfo.totalRating,
        ['age_rating']: film.filmInfo.ageRating
      },
      ['user_details']: {
        ...film.userDetails,
        ['already_watched']: film.userDetails.alreadyWatched,
        ['watching_date']: film.userDetails.watchingDate
      }
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;
    delete adaptedFilm['film_info'].alternativeTitle;
    delete adaptedFilm['film_info'].totalRating;
    delete adaptedFilm['film_info'].ageRating;
    delete adaptedFilm['user_details'].alreadyWatched;
    delete adaptedFilm['user_details'].watchingDate;

    return adaptedFilm;
  }
}
