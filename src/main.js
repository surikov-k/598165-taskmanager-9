import Menu from './components/menu';
import Search from './components/search';
import MainFilter from './components/main-filters';
import {getTasks, getFilters} from './data';
import {render} from './utils';
import BoardSection from './components/board-section';
import BoardConroller from './components/board-controller';

export const TASKS_PER_CLICK = 8;

const tasks = getTasks();
const filters = getFilters(tasks);

const mainSection = document.querySelector(`.main`);
const controlSection = document.querySelector(`.control`);

render(controlSection, new Menu().getElement());
render(mainSection, new Search().getElement());
render(mainSection, new MainFilter(filters).getElement());
render(mainSection, new BoardSection().getElement());

const boardController = new BoardConroller(mainSection, tasks);
boardController.init();
