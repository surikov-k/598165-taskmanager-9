import AbstractComponent from "./abstract-component";

export default class LoadMoreButton extends AbstractComponent {
  constructor() {
    super();
  }


  getTemplate() {
    return `<button class="load-more" type="button">load more</button>`;
  }

  unrender() {
    if (this._element) {
      this._element.remove();
    }
  }
}

