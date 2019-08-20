import {getMenuMarkup} from './components/menu';
import {getSearchMarkup} from './components/search';
import {getMainFiltersMarkup} from './components/main-filters';
import {getBoardSectionMarkup} from './components/board-section';
import {getCardMarkup} from './components/card';
import {getCardEditMarkup} from './components/card-edit';
import {getTasks} from './data';

const TASKS_PER_CLICK = 8;
const tasks = getTasks();

const mainSection = document.querySelector(`.main`);
const controlSection = document.querySelector(`.control`);
let tasksHaveBeenShown = 0;

const renderComponent = (container, template) => {
  const component = document.createElement(`template`);
  component.innerHTML = template;
  container.appendChild(component.content);
};

renderComponent(controlSection, getMenuMarkup());
renderComponent(mainSection, getSearchMarkup());
renderComponent(mainSection, getMainFiltersMarkup(tasks));
renderComponent(mainSection, getBoardSectionMarkup());

const getTasksMarkup = (index) => {
  return tasks.slice(index, index + TASKS_PER_CLICK).map((task, i) => {
    return i || tasksHaveBeenShown ? getCardMarkup(task) : getCardEditMarkup(task);
  }).join(``);
};

let tasksMarkup = getTasksMarkup(tasksHaveBeenShown);
tasksHaveBeenShown = tasksHaveBeenShown + TASKS_PER_CLICK;

const boardTasks = document.querySelector(`.board__tasks`);
renderComponent(boardTasks, tasksMarkup);

const loadMoreButton = document.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  tasksMarkup = getTasksMarkup(tasksHaveBeenShown);
  tasksHaveBeenShown = tasksHaveBeenShown + TASKS_PER_CLICK;
  renderComponent(boardTasks, tasksMarkup);

  if (tasksHaveBeenShown >= tasks.length) {
    document.querySelector(`.board`).removeChild(loadMoreButton);
  }
});
