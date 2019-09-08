export const COLORS_LIST = [`black`, `yellow`, `blue`, `green`, `pink`];

const DESCRIPTIONS_LIST = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];
const TAGS_LIST = [`homework`, `theory`, `practice`, `intensive`, `keks`];
const TAGS_MIN = 0;
const TAGS_MAX = 3;
const TASKS_COUNT = Math.round(Math.random() * 15 + 10);

const getRandomFromArray = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

const shuffleArray = (array) => {
  return array.slice().sort(() => Math.random() - 0.5);
};

const createTags = () => {
  const tagsTotal = Math.floor(Math.random() * (TAGS_MAX - TAGS_MIN) + TAGS_MIN);
  return shuffleArray(TAGS_LIST).slice(0, tagsTotal);
};

const makeTask = () => {
  return {
    description: getRandomFromArray(DESCRIPTIONS_LIST),
    dueDate: Date.now() + 1 + Math.floor(Math.random() * 15 - 7) * 24 * 60 * 60 * 1000,
    repeatingDays: {
      Mo: false,
      Tu: Boolean(Math.round(Math.random())),
      We: false,
      Th: false,
      Fr: false,
      Sa: false,
      Su: false,
    },
    tags: new Set(createTags()),
    color: getRandomFromArray(COLORS_LIST),
    isFavorite: false,
    isArchive: false,
  };
};

export const getTasks = () => {
  return new Array(TASKS_COUNT).fill(``).map(makeTask);
};

export const getFilters = (tasks) => {

  return [
    {
      name: `All`,
      count: tasks.length,
      checked: true
    },
    {
      name: `Overdue`,
      count: tasks.filter((task) => {
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        return today > dueDate;
      }).length,
      checked: false
    },
    {
      name: `Today`,
      count: tasks.filter((task) => {
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        return today === dueDate;
      }).length,
      checked: false
    },
    {
      name: `Favorites`,
      count: tasks.filter((task) => task.isFavorite).length,
      checked: false
    },
    {
      name: `Repeating`,
      count: tasks.filter((task) => {
        return Object.keys(task.repeatingDays).some((day) => task.repeatingDays[day]);
      }).length,
      checked: false
    },
    {
      name: `Tags`,
      count: tasks.filter((task) => task.tags.size).length,
      checked: false
    },
    {
      name: `Archive`,
      count: tasks.filter((task) => task.isArchive).length,
      checked: false
    },
  ];
};
