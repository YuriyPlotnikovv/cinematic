import { emotions, names, surnames, text } from "../const";
import {
  formatStringToDateWithTime,
  getDate,
  getRandomInteger,
  getRandomValue,
} from "../utils/utils";

const generateComment = () => ({
  author: `${getRandomValue(names)} ${getRandomValue(surnames)}`,
  comment: text.slice(0, getRandomInteger(50, 150)),
  date: formatStringToDateWithTime(getDate("user")),
  emotion: getRandomValue(emotions),
});

const getCommentsCount = (films) =>
  films.reduce((count, film) => count + film.comments.length, 0);

const generateComments = (films) => {
  const commentsCount = getCommentsCount(films);

  return Array.from({ length: commentsCount }, (_value, index) => {
    return { id: String(index + 1), ...generateComment() };
  });
};

export { generateComments };
