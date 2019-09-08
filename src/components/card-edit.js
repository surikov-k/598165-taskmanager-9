import AbstractComponent from './abstract-component';
import {COLORS_LIST} from '../data';
export default class CardEdit extends AbstractComponent {
  constructor({description, dueDate, repeatingDays, tags, color, isFavorite, isArchive}) {
    super();
    this._description = description;
    this._dueDate = dueDate;
    this._repeatingDays = repeatingDays;
    this._tags = tags;
    this._color = color;
    this._isFavorite = isFavorite;
    this._isArchive = isArchive;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return `<article class="card card--edit card--${this._color} ${this._isRepeating() ? `card--repeat` : ``} ">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__control">
            <button type="button"
              class="card__btn
              card__btn--archive
              ${this._isArchive ? `` : `card__btn--disabled`}">
              archive
            </button>
            <button
              type="button"
              class="card__btn card__btn--favorites
              ${this._isFavorite ? `` : `card__btn--disabled`}"
            >
              favorites
            </button>
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${this._description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">
                    ${this._setDateStatus()}
                    </span>
                </button>

                <fieldset class="card__date-deadline" ${this._isRepeating() || !this._dueDate ? `disabled` : ``}>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"

                      placeholder="23 September"
                      name="date"
                      value="${this._dueDate ? new Date(this._dueDate).toDateString() : ``}"
                    />
                  </label>
                </fieldset>

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${this._isRepeating() ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__repeat-days" ${!this._isRepeating() ? `disabled` : ``}>
                  <div class="card__repeat-days-inner">
                    ${this._getRepeatDaysTemplate()}
                  </div>
                </fieldset>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                ${this._getHashtagsTemplate()}
                </div>

                <label>
                  <input
                    type="text"
                    class="card__hashtag-input"
                    name="hashtag-input"
                    placeholder="Type new hashtag here"
                  />
                </label>
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${this._getColorsTemplate()}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>
  `;
  }
  _isRepeating() {
    return Object.values(this._repeatingDays).some((value) => value);
  }

  _getRepeatDaysTemplate() {
    return Object.keys(this._repeatingDays).map((day) => {
      return `<input
                class="visually-hidden card__repeat-day-input"
                type="checkbox"
                id="repeat-${day.toLowerCase()}-1"
                name="repeat"
                value="${day.toLowerCase()}"
                ${this._repeatingDays[day] ? `checked` : ``}
              />
              <label class="card__repeat-day" for="repeat-${day.toLowerCase()}-1">
              ${day.toLowerCase()}
              </label>`;
    }).join(``);
  }

  _setDateStatus() {
    return this._isRepeating() || !this._dueDate ? `no` : `yes`;
  }

  _getColorsTemplate() {
    return COLORS_LIST.map((color) => {
      return `<input
                type="radio"
                id="color-${color}-1"
                class="card__color-input card__color-input--${color} visually-hidden"
                name="color"
                value="${color}"
                ${color === this._color ? `checked` : ``}
              />
              <label
                for="color-${color}-1"
                class="card__color card__color--${color}"
                >${color}</label
              >`;
    }).join(``);
  }

  _getHashtagsTemplate() {
    return [...this._tags].map((tag) => {
      return `<span class="card__hashtag-inner">
        <input type="hidden" name="hashtag" value="${tag}" class="card__hashtag-hidden-input">
        <p class="card__hashtag-name">
          #${tag}
        </p>
        <button type="button" class="card__hashtag-delete">
          delete
        </button>
      </span>`;
    }).join(``);
  }

  _subscribeOnEvents() {
    this._onHastagInputKeydown();
    this._onColorsWrapClick();
    this._onDateDeadlineToggleClick();
    this._onRepeatToggleClick();
    this._onHashtagDeleteClick();
  }

  _onHastagInputKeydown() {
    this.getElement(`.card__hashtag-input`)
      .addEventListener(`keydown`, (evt) => {
        if (evt.key === `Enter`) {
          evt.preventDefault();
        }
        if (evt.key === ` `) {
          const hashTagTemplate =
            `<span class="card__hashtag-inner">
            <input type="hidden"
            name="hashtag"
            value="${evt.target.value}"
            class="card__hashtag-hidden-input">
            <p class="card__hashtag-name">
              #${evt.target.value}
            </p>
            <button type="button" class="card__hashtag-delete">
              delete
            </button>
          </span>`;

          this.getElement()
            .querySelector(`.card__hashtag-list`)
            .insertAdjacentHTML(`beforeend`, hashTagTemplate);

          evt.target.value = ``;
        }
      });
  }

  _onColorsWrapClick() {
    this.getElement()
      .querySelector(`.card__colors-wrap`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName === `INPUT`) {

          [`black`, `yellow`, `blue`, `green`, `pink`]
            .forEach((color) => {
              this.getElement()
                .classList
                .remove(`card--${color}`);
            });

          this.getElement()
            .classList
            .add(`card--${evt.target.value}`);
        }
      });
  }

  _onDateDeadlineToggleClick() {
    const dateDeadlineFieldset = this.getElement().querySelector(`.card__date-deadline`);
    const dateInput = this.getElement().querySelector(`.card__date`);
    const dateStatus = this.getElement().querySelector(`.card__date-status`);

    this.getElement()
      .querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        if (!this._isRepeating()) {

          dateDeadlineFieldset.disabled = !dateDeadlineFieldset.disabled;

          if (!dateDeadlineFieldset.disabled) {
            dateStatus.innerText = `yes`;

          } else {
            dateStatus.innerText = `no`;
            dateInput.value = ``;
          }
        }
      });
  }


  _onRepeatToggleClick() {
    const repeatStatus = this.getElement().querySelector(`.card__repeat-status`);
    const repeatDaysFieldset = this.getElement().querySelector(`.card__repeat-days`);

    this.getElement()
      .querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {

        repeatDaysFieldset.disabled = !repeatDaysFieldset.disabled;

        if (!repeatDaysFieldset.disabled) {
          repeatStatus.innerText = `yes`;

          repeatDaysFieldset
            .querySelectorAll(`.card__repeat-day-input`)
            .forEach((input) => {
              input
                .addEventListener(`click`, () => {
                  const dateInput = this.getElement()
                    .querySelector(`.card__date`);
                  const dateStatus = this.getElement()
                    .querySelector(`.card__date-status`);
                  const dateDeadlineFieldset = this.getElement()
                    .querySelector(`.card__date-deadline`);


                  dateStatus.innerText = `no`;
                  dateInput.value = ``;
                  dateDeadlineFieldset.disabled = true;
                  this.getElement().classList.add(`card--repeat`);

                });
            });
        } else {
          repeatStatus.innerText = `no`;
          this.getElement().classList.remove(`card--repeat`);


          Object.keys(this._repeatingDays).forEach((key) => {
            this._repeatingDays[key] = false;
          });

          repeatDaysFieldset
            .querySelectorAll(`.card__repeat-day-input`)
            .forEach((input) => {
              input.checked = false;
            });
        }
      });
  }

  _onHashtagDeleteClick() {
    const hashtagList = this.getElement()
      .querySelector(`.card__hashtag-list`);
    hashtagList
      .addEventListener(`click`, (evt) => {
        if (evt.target.classList.contains(`card__hashtag-delete`)) {
          evt.target.parentNode.remove();
        }
      });
  }
}

