import AbstractComponent from "./abstract-component";

export default class MainFilter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    const filters = this._filters.map((filter) => {
      return `<input
                type="radio"
                id="filter__${filter.name.toLowerCase()}"
                class="filter__input visually-hidden"
                name="filter"
                ${ filter.checked ? `checked` : ``}
                ${ filter.count ? `` : `disabled`}
              />
              <label for="filter__${filter.name.toLowerCase()}" class="filter__label">
                ${filter.name} <span class="filter__${filter.name.toLowerCase()}-count">${filter.count}</span>
              </label>`;
    }).join(``);
    return `<section class="main__filter filter container">
              ${filters}
            </section>`;
  }
}
