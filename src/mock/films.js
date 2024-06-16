import {
  formatStringToDate,
  getDate,
  getRandomFloat,
  getRandomInteger,
  getRandomValue,
} from "../utils/utils";
import {
  AgeRating,
  FILM_COUNT,
  GenreCount,
  MAX_COMMENTS_ON_FILM,
  NAME_COUNT,
  Rating,
  Runtime,
  countries,
  genres,
  names,
  posters,
  surnames,
  text,
  titles,
} from "../const";

const generateFilm = () => ({
  title: getRandomValue(titles),
  alternativeTitle: getRandomValue(titles),
  totalRating: getRandomFloat(Rating.MIN, Rating.MAX),
  poster: getRandomValue(posters),
  ageRating: getRandomInteger(AgeRating.MIN, AgeRating.MAX),
  director: `${getRandomValue(names)} ${getRandomValue(surnames)}`,
  writers: Array.from(
    { length: NAME_COUNT },
    () => `${getRandomValue(names)} ${getRandomValue(surnames)}`
  ),
  actors: Array.from(
    { length: NAME_COUNT },
    () => `${getRandomValue(names)} ${getRandomValue(surnames)}`
  ),
  release: {
    date: formatStringToDate(getDate("film")),
    releaseCountry: getRandomValue(countries),
  },
  runtime: getRandomInteger(Runtime.MIN, Runtime.MAX),
  genre: Array.from(
    { length: getRandomInteger(GenreCount.MIN, GenreCount.MAX) },
    () => getRandomValue(genres)
  ),
  description: text.slice(0, getRandomInteger(200, 400)),
});

const generateFilms = () => {
  const films = Array.from({ length: FILM_COUNT }, generateFilm);
  let totalCommentsCount = 0;

  return films.map((film, index) => {
    const hasComments = getRandomInteger(0, 1);
    const filmCommentsCount = hasComments
      ? getRandomInteger(1, MAX_COMMENTS_ON_FILM)
      : 0;

    totalCommentsCount += filmCommentsCount;

    return {
      id: String(index + 1),
      comments: Array.from({ length: filmCommentsCount }, (_value, index) =>
        String(totalCommentsCount - index)
      ),
      filmInfo: film,
      userDetails: {
        watchList: Boolean(getRandomInteger(0, 1)),
        alreadyWatched: Boolean(getRandomInteger(0, 1)),
        watchingDate: Boolean(getRandomInteger(0, 1)) ? getDate("user") : null,
        favorite: Boolean(getRandomInteger(0, 1)),
      },
    };
  });
};

export { generateFilms };
