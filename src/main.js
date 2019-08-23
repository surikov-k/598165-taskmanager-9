import {getMenuMarkup} from './components/menu';
import {getSearchMarkup} from './components/search';
import {getMainFiltersMarkup} from './components/main-filters';
import {getBoardSectionMarkup} from './components/board-section';
import Card from './components/card';
import CardEdit from './components/card-edit';
import {getTasks} from './data';
import {render} from './utils';

const TASKS_PER_CLICK = 8;
const initalState = {
  tasksHaveDisplayed: 0
};

const state = Object.assign({}, initalState);

const tasks = getTasks();

const mainSection = document.querySelector(`.main`);
const controlSection = document.querySelector(`.control`);

const renderComponent = (container, template) => {
  const component = document.createElement(`template`);
  component.innerHTML = template;
  container.appendChild(component.content);
};

renderComponent(controlSection, getMenuMarkup());
renderComponent(mainSection, getSearchMarkup());
renderComponent(mainSection, getMainFiltersMarkup(tasks));
renderComponent(mainSection, getBoardSectionMarkup());

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
  tasks.slice(state.tasksHaveDisplayed, state.tasksHaveDisplayed + TASKS_PER_CLICK).forEach((task) => {
    renderCard(task);
  });
  state.tasksHaveDisplayed += TASKS_PER_CLICK;
};

const cardsContainer = document.querySelector(`.board__tasks`);
renderCards();

const loadMoreButton = document.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  renderCards();

  if (state.tasksHaveDisplayed >= tasks.length) {
    document.querySelector(`.board`).removeChild(loadMoreButton);
  }
});
