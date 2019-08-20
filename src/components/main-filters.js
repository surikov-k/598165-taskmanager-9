import {getFilters} from '../data';

export const getMainFiltersMarkup = (tasks) => {
  const filters = getFilters(tasks);
  return `
    <section class="main__filter filter container">
      ${filters.map((filter, i) => {
    return `
          <input
            type="radio"
            id="filter__${filter.name.toLowerCase()}"
            class="filter__input visually-hidden"
            name="filter"
            ${ i ? `` : `checked`}
            ${ filter.count ? `` : `disabled`}
          />
          <label for="filter__all" class="filter__label">
            ${filter.name} <span class="filter__all-count">${filter.count}</span></label
          >
        `;
  }).join(``)}
    </section>
  `;
};
