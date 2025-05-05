import '../pages/index.css';
import { enableValidation } from './validate.js';
import { createCard } from './cards.js';
import { openModal, closeModal } from './modal.js';
import { getUser, getInitialCards, editUser, addNewCard, editAvatar } from './api.js';

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
const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarUrlInput = avatarPopup.querySelector('.popup__input_type_url');
const avatarFormElement = avatarPopup.querySelector('.popup__form');

// Редактируемые элементы
const profileName = content.querySelector('.profile__title');
const profileJob = content.querySelector('.profile__description');
const profileAvatar = content.querySelector('.profile__image');
const placesList = document.querySelector('.places__list');

// Загрузка пользователя и отображение карточек
let currentUserId;
Promise.all([getUser(), getInitialCards()])
  .then(([user, initialCards]) => {
    // Установка данных пользователя
    profileName.textContent = user.name;
    profileJob.textContent = user.about;
    profileAvatar.style.backgroundImage = `url('${user.avatar}')`;
    currentUserId = user._id;

    // Отображение карточек
    initialCards.forEach((card) => {
      placesList.append(createCard(card, cardTemplate, handleCardClick, currentUserId));
    });
  })
  .catch(err => {
    console.log(err);
  });

// Добавление анимаций
profilePopup.classList.add('popup_is-animated');
cardPopup.classList.add('popup_is-animated');
imagePopup.classList.add('popup_is-animated');

// UX для попапов
function renderLoading(isLoading, button) {
  if (isLoading) {
    button.textContent = 'Сохранение...';
    button.disabled = true;
  } else {
    button.textContent = 'Сохранить';
    button.disabled = false;
  }
}

// Обработчик нажатия на карточку
const handleCardClick = (name, link) => {
  contentImage.src = link;
  contentCaption.textContent = name;
  openModal(imagePopup);
};

// Реадктирование профиля
profileNameInput.value = profileName.textContent;
profileJobInput.value = profileJob.textContent;

const profileEditButton = content.querySelector('.profile__edit-button');
profileEditButton.addEventListener('click', () => {
  profileNameInput.value = profileName.textContent;
  profileJobInput.value = profileJob.textContent;
  openModal(profilePopup);
});

const profileCloseButton = profilePopup.querySelector('.popup__close');
profileCloseButton.addEventListener('click', () => {
  closeModal(profilePopup);
});

const profileSaveButton = profilePopup.querySelector('.popup__button');

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  renderLoading(true, profileSaveButton);

  editUser(profileNameInput.value, profileJobInput.value)
    .then(user => {
      profileName.textContent = user.name;
      profileJob.textContent = user.about;
      profileAvatar.style.backgroundImage = `url('${user.avatar}')`;
      closeModal(profilePopup);
    })
    .catch(err => {
      console.log(err);
    })
    .finally(res => {
      renderLoading(false, profileSaveButton);
    });
};

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

// Редактирование аватара
profileAvatar.addEventListener('click', () => {
  avatarUrlInput.value = '';
  openModal(avatarPopup);
});

const avatarCloseButton = avatarPopup.querySelector('.popup__close');
avatarCloseButton.addEventListener('click', () => {
  closeModal(avatarPopup);
});

const avatarSaveButton = avatarPopup.querySelector('.popup__button');

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  renderLoading(true, avatarSaveButton);

  editAvatar(avatarUrlInput.value)
    .then(user => {
      profileAvatar.style.backgroundImage = `url('${user.avatar}')`;
      closeModal(avatarPopup);
      evt.target.reset();
    })
    .catch(err => {
      console.log(err);
    })
    .finally(res => {
      renderLoading(false, avatarSaveButton);
    });

};

avatarFormElement.addEventListener('submit', handleAvatarFormSubmit);

// Добавление карточки
const cardAddButton = content.querySelector('.profile__add-button');
cardAddButton.addEventListener('click', () => {
  cardNameInput.value = '';
  cardUrlInput.value = '';
  openModal(cardPopup);
});

const cardCloseButton = cardPopup.querySelector('.popup__close');
cardCloseButton.addEventListener('click', () => {
  closeModal(cardPopup);
});

const cardSaveButton = cardPopup.querySelector('.popup__button');

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  renderLoading(true, cardSaveButton);

  addNewCard(cardNameInput.value, cardUrlInput.value)
    .then(newCard => {
      placesList.prepend(createCard(newCard, cardTemplate, handleCardClick, currentUserId));
      closeModal(cardPopup);
      evt.target.reset();
    })
    .catch(err => {
      console.log(err);
    })
    .finally(res => {
      renderLoading(false, cardSaveButton);
    });

};

cardFormElement.addEventListener('submit', handleCardFormSubmit);

// Закрытие окна просмотра карточки
const imageCloseButton = imagePopup.querySelector('.popup__close');
imageCloseButton.addEventListener('click', () => {
  closeModal(imagePopup);
});

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
};

enableValidation(validationSettings);
