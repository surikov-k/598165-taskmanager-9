import {createElement} from "../utils";

export default class BoardFilters {
  constructor() {
    this._element = null;
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `<div class="board__filter-list">
              <a href="#" class="board__filter">SORT BY DEFAULT</a>
              <a href="#" class="board__filter">SORT BY DATE up</a>
              <a href="#" class="board__filter">SORT BY DATE down</a>
            </div>`;
  }
}
