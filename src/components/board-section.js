import {getBoardFiltersMarkup} from "./board-filters";
import {getLoadMoreButtonMarkup} from './load-more-button';

export const getBoardSectionMarkup = () => {
  return `
    <section class="board container">
      ${getBoardFiltersMarkup()}

        <div class="board__tasks">
        </div>

      ${getLoadMoreButtonMarkup()}
    </section>
  `;
};
