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
    this._boardFilters = new BoardFilters();
    this._loadMoreButton = new LoadMoreButton();
    this._noTask = new NoTask();
    this._tasksHaveDisplayed = 0;
  }

  init() {
    render(this._container, this._boardSection.getElement());
    render(this._boardSection.getElement(), this._boardTasks.getElement());

    if (this._tasks.length) {
      render(this._boardSection.getElement(), this._boardFilters.getElement(), Position.AFTERBEGING);

      this._boardFilters
        .getElement()
        .addEventListener(`click`, (evt) => this._onBoardFiltersLinkClick(evt));

      this._tasksHaveDisplayed += TASKS_PER_CLICK;
      this._renderCards(this._boardFilters.current);


      render(this._boardSection.getElement(), this._loadMoreButton.getElement());

      this._loadMoreButton
        .getElement()
        .addEventListener(`click`, () => {
          this._tasksHaveDisplayed += TASKS_PER_CLICK;
          this._renderCards(this._boardFilters.current);

          if (this._tasksHaveDisplayed >= this._tasks.length) {
            this._loadMoreButton.unrender();
          }
        });
    } else {
      render(this._boardSection.getElement(), this._noTask.getElement(), Position.AFTERBEGING);
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

  _renderCards(filter) {
    let tasksToRender = [];
    this._boardTasks.getElement().innerHTML = ``;

    switch (filter) {
      case `date-up`:
        tasksToRender = this._tasks.slice()
          .sort((a, b) => {
            return a.dueDate - b.dueDate;
          });
        break;
      case `date-down`:
        tasksToRender = this._tasks.slice()
          .sort((a, b) => {
            return b.dueDate - a.dueDate;
          });
        break;
      case `default`:
        tasksToRender = this._tasks;
        break;
    }

    tasksToRender
      .slice(0, this._tasksHaveDisplayed)
      .forEach((task) => {
        this._renderCard(task);
      });
  }

  _onBoardFiltersLinkClick(evt) {
    evt.preventDefault();
    if (evt.target.tagName === `A`) {
      this._boardFilters.current = evt.target.dataset.sortType;
      this._renderCards(this._boardFilters.current);
    }
  }
}
