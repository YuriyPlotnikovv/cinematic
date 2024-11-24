const FILM_COUNT = 25;

const NAME_COUNT = 2;

const MAX_COMMENTS_ON_FILM = 5;

const FILM_COUNT_PER_STEP = 5;

const FILTER_TYPE_ALL_NAME = 'All movies';

const GenreCount = {
  MIN: 1,
  MAX: 3,
};

const Rating = {
  MIN: 0,
  MAX: 10,
};

const AgeRating = {
  MIN: 0,
  MAX: 18,
};

const Runtime = {
  MIN: 60,
  MAX: 180,
};

const YearsDuration = {
  MIN: 5,
  MAX: 10,
};

const DaysDuration = {
  MIN: 0,
  MAX: 7,
};

const UserRankValue = {
  NOVICE: 0,
  FAN: 10,
  MOVIE_BUFF: 20,
};

const UserRankTitle = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

const NetworkMethod = {
  PUT: 'PUT',
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE'
};

const SortingType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  INIT: 'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const filter = {
  [FilterType.ALL]: (films) => [...films],
  [FilterType.WATCHLIST]: (films) =>
    films.filter((film) => film.userDetails.watchlist),
  [FilterType.HISTORY]: (films) =>
    films.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) =>
    films.filter((film) => film.userDetails.favorite),
};

const names = ['Sandy', 'James', 'John', 'Rita', 'Sofia', 'Daniel'];

const surnames = ['Miller', 'Fabias', 'Rossini', 'Loco', 'Dakota', 'Walker'];

const titles = [
  'Country On Him',
  'Raiders With The Carpet',
  'Guest Who Sold The Darkness',
  'A Tale Of A Little Bird In The Storm',
  'Friends On The Room',
  'Raiders Who Stole Us',
  'Friends Without Themselves',
  'Pioneers Without Us',
  'A Man With Themselves',
  'Guest With The Darkness',
  'A Little Pony Who Bought The Darkness',
  'Family Who Bought The Carpet',
  'Raiders Who Saw Him',
  'Guest Within Him',
  'Pioneers Without The Darkness',
  'A Tale Of A Little Bird With Him',
  'A Shark Who Sold The Wall',
  'Raiders Who The Storm',
  'Family Who Stole The Darkness',
  'A Lion Without Us',
];

const posters = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const genres = [
  'Animation',
  'Action',
  'Adventure',
  'Comedy',
  'Family',
  'Horror',
  'Thriller',
];

const emotions = ['smile', 'sleeping', 'puke', 'angry'];

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const countries = [
  'USA',
  'Russia',
  'Germany',
  'Finland',
  'France',
  'Spain',
  'Italy',
  'China',
  'Japan',
];

export {
  FILM_COUNT,
  NAME_COUNT,
  MAX_COMMENTS_ON_FILM,
  FILM_COUNT_PER_STEP,
  FILTER_TYPE_ALL_NAME,
  titles,
  GenreCount,
  Rating,
  AgeRating,
  Runtime,
  YearsDuration,
  DaysDuration,
  UserRankValue,
  UserRankTitle,
  SortingType,
  UserAction,
  UpdateType,
  FilterType,
  filter,
  names,
  surnames,
  posters,
  genres,
  emotions,
  text,
  countries,
  NetworkMethod,
  TimeLimit
};
