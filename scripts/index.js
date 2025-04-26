import { enableValidation } from './validate.js';
import { initialCards } from './cards.js';

const content = document.querySelector('.content');

// Template
const cardTemplate = document.querySelector('#card-template').content;

// Popups
const profilePopup = document.querySelector('.popup_type_edit');
const profileFormElement = profilePopup.querySelector('.popup__form');
const profileNameInput = profileFormElement.querySelector('.popup__input_type_name');
const profileJobInput = profileFormElement.querySelector('.popup__input_type_description');
const cardPopup = document.querySelector('.popup_type_new-card');
const cardFormElement = cardPopup.querySelector('.popup__form');
const cardNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const cardUrlInput = cardFormElement.querySelector('.popup__input_type_url');
const imagePopup = document.querySelector('.popup_type_image');
const imagePopupContent = imagePopup.querySelector('.popup__content');
const contentImage = imagePopupContent.querySelector('.popup__image');
const contentCaption = imagePopupContent.querySelector('.popup__caption');

// Добавление анимаций
profilePopup.classList.add('popup_is-animated');
cardPopup.classList.add('popup_is-animated');
imagePopup.classList.add('popup_is-animated');

// Создание новой карточки
function createCard(name, link) {
  const newCard = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = newCard.querySelector('.card__image');
  cardImage.src = link;
  cardImage.alt = name;
  newCard.querySelector('.card__title').textContent = name;
  // Лайк
  const cardLikeButton = newCard.querySelector('.card__like-button');
  cardLikeButton.addEventListener('click', () => {
    cardLikeButton.classList.toggle('card__like-button_is-active');
  });
  // Удаление
  const cardDeleteButton = newCard.querySelector('.card__delete-button');
  cardDeleteButton.addEventListener('click', () => {
    cardDeleteButton.closest('.card').remove();
  });
  // Просмотр
  cardImage.addEventListener('click', () => {
    contentImage.src = link;
    contentCaption.textContent = name;
    openModal(imagePopup);
  })

  return newCard;
}

// Добавление заранее заготовленных карточек
const placesList = document.querySelector('.places__list');
initialCards.forEach((card) => {
  placesList.append(createCard(card.name, card.link));
})

// Реадктирование профиля
const profileName = content.querySelector('.profile__title');
const profileJob = content.querySelector('.profile__description');
profileNameInput.value = profileName.textContent;
profileJobInput.value = profileJob.textContent;

function openModal(popup) {
  popup.classList.add('popup_is-opened');
}

function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
}

const profileEditButton = content.querySelector('.profile__edit-button');
profileEditButton.addEventListener('click', () => {
  profileNameInput.value = profileName.textContent;
  profileJobInput.value = profileJob.textContent;
  openModal(profilePopup);
})

const profileCloseButton = profilePopup.querySelector('.popup__close');
profileCloseButton.addEventListener('click', () => {
  closeModal(profilePopup);
})

function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    profileName.textContent = profileNameInput.value;
    profileJob.textContent = profileJobInput.value;
    closeModal(profilePopup);
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

// Добавление карточки
const cardAddButton = content.querySelector('.profile__add-button');
cardAddButton.addEventListener('click', () => {
  openModal(cardPopup);
})

const cardCloseButton = cardPopup.querySelector('.popup__close');
cardCloseButton.addEventListener('click', () => {
  closeModal(cardPopup);
})

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  placesList.prepend(createCard(cardNameInput.value, cardUrlInput.value));
  closeModal(cardPopup);
}

cardFormElement.addEventListener('submit', handleCardFormSubmit);

// Закрытие окна просмотра карточки
const imageCloseButton = imagePopup.querySelector('.popup__close');
imageCloseButton.addEventListener('click', () => {
  closeModal(imagePopup);
})

// Закрытие попапа кликом на оверлей
function closeWithClickOnOverlay() {
  const popupList = document.querySelectorAll('.popup');
  popupList.forEach((popup) => {
    popup.addEventListener('click', (el) => {
      if (el.target === popup) {
        closeModal(popup);
      }
    });
  });
};

closeWithClickOnOverlay();

// Валидация форм
const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}

enableValidation(validationSettings);
