import { filter } from '../utils/filter';

const generateFilter = (films) =>
  Object.entries(filter).map(([filterName, filterFilms]) => ({
    name: filterName,
    count: filterFilms(films).length,
  }));

export { generateFilter };
