import BoardSection from "./board-section";
import BoardTasks from "./board-tasks";
import {render, Position} from "../utils";
import Card from "./card";
import CardEdit from "./card-edit";
import BoardFilters from "./board-filters";
import LoadMoreButton from "./load-more-button";
import NoTask from "./no-task";

import {TASKS_PER_CLICK} from "../main";

export default class BoardConroller {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._boardSection = new BoardSection();
    this._boardTasks = new BoardTasks();
    this._tasksHaveDisplayed = 0;
  }

  init() {
    render(this._container, this._boardSection.getElement());
    render(this._boardSection.getElement(), this._boardTasks.getElement());

    if (this._tasks.length) {
      render(this._boardSection.getElement(), new BoardFilters().getElement(), Position.AFTERBEGING);
      this._renderCards();

      const loadMoreButton = new LoadMoreButton();
      render(this._boardSection.getElement(), loadMoreButton.getElement());

      loadMoreButton
        .getElement()
        .addEventListener(`click`, () => {
          this._renderCards();

          if (this._tasksHaveDisplayed >= this._tasks.length) {
            loadMoreButton.unrender();
          }
        });
    } else {
      render(this._boardSection.getElement(), new NoTask().getElement(), Position.AFTERBEGING);
    }

  }

  _renderCard(task) {
    const card = new Card(task);
    const cardEdit = new CardEdit(task);

    const escKeyDownHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._boardTasks
          .getElement()
          .replaceChild(card.getElement(), cardEdit.getElement());
        document.removeEventListener(`keydown`, escKeyDownHandler);
      }
    };

    card.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._boardTasks
          .getElement()
          .replaceChild(cardEdit.getElement(), card.getElement());
        document.addEventListener(`keydown`, escKeyDownHandler);
      });

    cardEdit.getElement()
      .querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, escKeyDownHandler);
      });

    cardEdit.getElement()
      .querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, escKeyDownHandler);
      });

    cardEdit.getElement()
      .querySelector(`.card__save`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._boardTasks
          .getElement()
          .replaceChild(card.getElement(), cardEdit.getElement());
        document.removeEventListener(`keydown`, escKeyDownHandler);
      });

    render(this._boardTasks.getElement(), card.getElement());
  }

  _renderCards() {
    this._tasks.slice(this._tasksHaveDisplayed, this._tasksHaveDisplayed + TASKS_PER_CLICK).forEach((task) => {
      this._renderCard(task);
    });
    this._tasksHaveDisplayed += TASKS_PER_CLICK;
  }
}

