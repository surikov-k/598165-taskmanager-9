import Card from "../components/card";
import CardEdit from "../components/card-edit";
import {render} from "../utils";

export default class CardController {
  constructor(container, data, onDataChange, onViewChange) {
    this._container = container;
    this._data = data;
    this._card = new Card(data);
    this._cardEdit = new CardEdit(data);
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this.create();
  }

  create() {
    const escKeyDownHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._container
          .getElement()
          .replaceChild(this._card.getElement(), this._cardEdit.getElement());

        this._cardEdit = new CardEdit(this._data);

        document.removeEventListener(`keydown`, escKeyDownHandler);
      }
    };

    this._card.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._onViewChange();
        this._container
          .getElement()
          .replaceChild(this._cardEdit.getElement(), this._card.getElement());
        document.addEventListener(`keydown`, escKeyDownHandler);
      });

    this._cardEdit.getElement()
      .querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, escKeyDownHandler);
      });

    this._cardEdit.getElement()
      .querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, escKeyDownHandler);
      });

    this._cardEdit.getElement()
      .querySelector(`.card__save`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const formData = new FormData(this._cardEdit.getElement().querySelector(`.card__form`));

        const entry = {
          description: formData.get(`text`),
          color: formData.get(`color`),
          tags: new Set(formData.getAll(`hashtag`)),
          dueDate: formData.get(`date`) ? new Date(formData.get(`date`)) : null,
          repeatingDays: formData
            .getAll(`repeat`)
            .reduce((acc, it) => {
              acc[it] = true;
              return acc;
            }, {'mo': false, 'tu': false, 'we': false, 'th': false, 'fr': false, 'sa': false, 'su': false}),
        };

        const newData = Object.assign(this._data, entry);

        this._onDataChange(newData, this._data);

        document.removeEventListener(`keydown`, escKeyDownHandler);
      });

    this._card.getElement()
      .querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, () => {
        this._onFavoriteButtonClick();
      });

    this._cardEdit.getElement()
      .querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, () => {
        this._onFavoriteButtonClick();
      });

    this._card
      .getElement()
      .querySelector(`.card__btn--archive`)
      .addEventListener(`click`, () => {
        this._onArchiveButtonClick();
      });

    this._cardEdit
      .getElement()
      .querySelector(`.card__btn--archive`)
      .addEventListener(`click`, () => {
        this._onArchiveButtonClick();
      });

    render(this._container.getElement(), this._card.getElement());
  }

  _onFavoriteButtonClick() {
    this._card.getElement()
      .querySelector(`.card__btn--favorites`)
      .classList
      .toggle(`card__btn--disabled`);

    this._cardEdit.getElement()
      .querySelector(`.card__btn--favorites`)
      .classList
      .toggle(`card__btn--disabled`);

    const newData = Object.assign(this._data, {isFavorite: !this._data.isFavorite});

    this._onDataChange(newData, this._data, false);
  }

  _onArchiveButtonClick() {
    this._card.getElement()
      .querySelector(`.card__btn--archive`)
      .classList
      .toggle(`card__btn--disabled`);

    this._cardEdit.getElement()
      .querySelector(`.card__btn--archive`)
      .classList
      .toggle(`card__btn--disabled`);

    const newData = Object.assign(this._data, {isArchive: !this._data.isArchive});

    this._onDataChange(newData, this._data, false);
  }

  setDefaultView() {
    if (this._container.getElement().contains(this._cardEdit.getElement())) {
      this._container.getElement().replaceChild(this._card.getElement(), this._cardEdit.getElement());
    }
  }
}
