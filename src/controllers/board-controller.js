import BoardSection from "../components/board-section";
import BoardTasks from "../components/board-tasks";
import {render, Position} from "../utils";
import BoardFilters from "../components/board-filters";
import LoadMoreButton from "../components/load-more-button";
import NoTask from "../components/no-task";

import {TASKS_PER_CLICK} from "../main";
import CardController from "./card";

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

    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
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

  _renderCard(data) {
    const cardController = new CardController(this._boardTasks, data, this._onDataChange, this._onViewChange);
    this._subscriptions.push(cardController.setDefaultView.bind(cardController));
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

  _onViewChange() {
    this._subscriptions.forEach((subscripiton) => subscripiton());
  }

  _onDataChange(newData, oldData, isRerenderNecassery = true) {
    const idx = this._tasks.findIndex((it) => it === oldData);
    this._tasks[idx] = newData;

    if (isRerenderNecassery) {
      this._renderCards(this._boardFilters.current);
    }
  }
}
