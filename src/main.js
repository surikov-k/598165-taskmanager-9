import {getMenuMarkup} from './components/menu';
import {getSearchMarkup} from './components/search';
import {getMainFiltersMarkup} from './components/main-filters';
import {getBoardFiltersMarkup} from './components/board-filters';
import {getCardMarkup} from './components/card';
import {getCardEditMarkup} from './components/card-edit';
import {getLoadMoreButtonMarkup} from './components/load-more-button';

const mainSection = document.querySelector(`.main`);
const controlSection = document.querySelector(`.control`);
const boardSection = document.createElement(`section`);
const boardTasks = document.createElement(`div`);

const renderComponent = (container, template) => {
  const component = document.createElement(`template`);
  component.innerHTML = template;
  container.appendChild(component.content);
};


renderComponent(controlSection, getMenuMarkup());
renderComponent(mainSection, getSearchMarkup());
renderComponent(mainSection, getMainFiltersMarkup());

boardSection.classList.add(`board`, `container`);
renderComponent(boardSection, getBoardFiltersMarkup());

boardTasks.classList.add(`board__tasks`);

renderComponent(boardTasks, getCardEditMarkup());

for (let i = 0; i < 3; i++) {
  renderComponent(boardTasks, getCardMarkup());
}

boardSection.append(boardTasks);

mainSection.append(boardSection);
renderComponent(boardSection, getLoadMoreButtonMarkup());

