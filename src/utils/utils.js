import { DaysDuration, YearsDuration } from "../const";

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
  new Date(date).toLocaleString("en-GB");

const formatStringToDate = (date) =>
  new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const formatStringToYear = (date) => new Date(date).getFullYear();

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

const getTimeFormat = (minutes) => {
  const MINUTES_IN_HOUR = 60;

  return minutes < MINUTES_IN_HOUR
    ? `${minutes}m`
    : `${Math.floor(minutes / MINUTES_IN_HOUR)}h ${minutes % MINUTES_IN_HOUR}m`;
};

export {
  getRandomInteger,
  getRandomValue,
  getRandomFloat,
  getDate,
  getTimeFormat,
  formatStringToDate,
  formatStringToYear,
  formatStringToDateWithTime,
};
