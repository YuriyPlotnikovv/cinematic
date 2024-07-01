import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(duration);
dayjs.extend(relativeTime);

import {
  DaysDuration,
  UserRankTitle,
  UserRankValue,
  YearsDuration,
} from "../const";

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};

const getRandomValue = (items) => items[getRandomInteger(0, items.length - 1)];

const getRandomFloat = (a = 0, b = 1) => {
  const number = Math.random() * (b - a) + a;
  return parseFloat(number.toFixed(1));
};

const formatStringToDateWithTime = (date) =>
  dayjs(date).format("YYYY/MM/DD HH:mm");

const formatStringToDate = (date) => dayjs(date).format("DD MMMM YYYY");

const formatStringToYear = (date) => dayjs(date).format("YYYY");

const getDate = (type) => {
  const date = new Date();

  switch (type) {
    case "film":
      date.setFullYear(
        date.getFullYear() -
          getRandomInteger(YearsDuration.MIN, YearsDuration.MAX)
      );
      break;
    case "user":
      date.setDate(
        date.getDate() - getRandomInteger(DaysDuration.MIN, DaysDuration.MAX)
      );
      break;
  }

  return date.toISOString();
};

const getTimeFormat = (minutes) =>
  dayjs.duration(minutes, "m").format("H[h] mm[m]");

const getDateDuration = (date) => {
  const diff = dayjs(date).diff(dayjs());
  return dayjs.duration(diff).humanize(true);
};

const getUserRank = (films) => {
  const watchedFilmsCount = films.filter(
    (film) => film.userDetails.alreadyWatched
  ).length;

  let userRank = null;

  switch (true) {
    case watchedFilmsCount > UserRankValue.MOVIE_BUFF:
      userRank = UserRankTitle.MOVIE_BUFF;
      break;
    case watchedFilmsCount > UserRankValue.FAN:
      userRank = UserRankTitle.FAN;
      break;
    case watchedFilmsCount > UserRankValue.NOVICE:
      userRank = UserRankTitle.NOVICE;
      break;
    default:
      userRank = null;
  }

  return userRank;
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [...items.slice(0, index), update, ...items.slice(index + 1)];
};

const sortingByDefaut = (first, second) => {
  return second.id - first.id;
};

const sortingByDate = (first, second) => {
  return dayjs(second.filmInfo.release.date).diff(first.filmInfo.release.date);
};

const sortingByRate = (first, second) => {
  return second.filmInfo.totalRating - first.filmInfo.totalRating;
};

export {
  getRandomInteger,
  getRandomValue,
  getRandomFloat,
  getDate,
  getTimeFormat,
  getDateDuration,
  formatStringToDate,
  formatStringToYear,
  formatStringToDateWithTime,
  getUserRank,
  updateItem,
  sortingByDefaut,
  sortingByDate,
  sortingByRate,
};
