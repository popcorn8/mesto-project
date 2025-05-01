import { deleteCard, likeCard, unlikeCard } from "./api";

// Создание новой карточки
function createCard(cardData, cardTemplate, handleCardClick, currentUserId) {
  const newCard = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = newCard.querySelector('.card__image');
  const cardLikeCounter = newCard.querySelector('.card__like-counter');
  const cardLikeButton = newCard.querySelector('.card__like-button');
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  newCard.querySelector('.card__title').textContent = cardData.name;
  cardLikeCounter.textContent = cardData.likes.length;
  if (cardData.likes.find(user => (user._id === currentUserId))) {
    cardLikeButton.classList.add('card__like-button_is-active');
  }
  // Лайк
  cardLikeButton.addEventListener('click', () => {
    if (cardLikeButton.classList.contains('card__like-button_is-active')) {
      unlikeCard(cardData._id)
        .then(card => {
          cardLikeCounter.textContent = card.likes.length;
          cardLikeButton.classList.remove('card__like-button_is-active');
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      likeCard(cardData._id)
        .then(card => {
          cardLikeCounter.textContent = card.likes.length;
          cardLikeButton.classList.add('card__like-button_is-active');
        })
        .catch(err => {
          console.log(err);
        });
    };
  });
  // Удаление
  if (cardData.owner._id === currentUserId) {
    const cardDeleteButton = newCard.querySelector('.card__delete-button');
    cardDeleteButton.classList.remove('card__delete-button_hidden')
    cardDeleteButton.addEventListener('click', () => {
      deleteCard(cardData._id)
        .then(res => {
          cardDeleteButton.closest('.card').remove();
        })
        .catch(err => {
          console.log(err);
        });
    });
  };
  // Просмотр
  cardImage.addEventListener('click', () => handleCardClick(cardData.name, cardData.link));

  return newCard;
}

export { createCard };
