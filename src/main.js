import {getMenuMarkup} from './components/menu';
import {getSearchMarkup} from './components/search';
import {getMainFiltersMarkup} from './components/main-filters';
import {getBoardSectionMarkup} from './components/board-section';
import Card from './components/card';
import CardEdit from './components/card-edit';
import NoTask from './components/no-task';
import {getTasks} from './data';
import {render, Position} from './utils';
import BoardFilters from './components/board-filters';
import LoadMoreButton from './components/load-more-button';

const TASKS_PER_CLICK = 8;
const initalState = {
  tasksHaveDisplayed: 0,
  tasks: []
};

const state = Object.assign({}, initalState);
state.tasks = getTasks();

const mainSection = document.querySelector(`.main`);
const controlSection = document.querySelector(`.control`);

const renderComponent = (container, template) => {
  const component = document.createElement(`template`);
  component.innerHTML = template;
  container.appendChild(component.content);
};

renderComponent(controlSection, getMenuMarkup());
renderComponent(mainSection, getSearchMarkup());
renderComponent(mainSection, getMainFiltersMarkup(state.tasks));
renderComponent(mainSection, getBoardSectionMarkup());

const boardContainer = document.querySelector(`.board`);

const renderCard = (task) => {
  const card = new Card(task);
  const cardEdit = new CardEdit(task);

  const escKeyDownHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      cardsContainer.replaceChild(card.getElement(), cardEdit.getElement());
      document.removeEventListener(`keydown`, escKeyDownHandler);
    }
  };

  card.getElement()
    .querySelector(`.card__btn--edit`)
    .addEventListener(`click`, () => {
      cardsContainer.replaceChild(cardEdit.getElement(), card.getElement());
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
      cardsContainer.replaceChild(card.getElement(), cardEdit.getElement());
      document.removeEventListener(`keydown`, escKeyDownHandler);
    });

  render(cardsContainer, card.getElement());
};

const renderCards = () => {
  state.tasks.slice(state.tasksHaveDisplayed, state.tasksHaveDisplayed + TASKS_PER_CLICK).forEach((task) => {
    renderCard(task);
  });
  state.tasksHaveDisplayed += TASKS_PER_CLICK;
};

const cardsContainer = document.querySelector(`.board__tasks`);

if (state.tasks.length) {
  render(boardContainer, new BoardFilters().getElement(), Position.AFTERBEGING);
  renderCards();
  const loadMoreButton = new LoadMoreButton();
  render(boardContainer, loadMoreButton.getElement());
  loadMoreButton
    .getElement()
    .addEventListener(`click`, () => {
      renderCards();

      if (state.tasksHaveDisplayed >= state.tasks.length) {
        loadMoreButton.unrender();
      }
    });
} else {
  render(boardContainer, new NoTask().getElement(), Position.AFTERBEGING);
}

