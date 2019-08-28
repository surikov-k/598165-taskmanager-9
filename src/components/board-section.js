import AbstractComponent from "./abstract-component";

export default class BoardSection extends AbstractComponent {
  getTemplate() {
    return `<section class="board container"></section>`;
  }
}
