// Создание новой карточки
function createCard(name, link, cardTemplate, handleCardClick) {
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
  cardImage.addEventListener('click', () => handleCardClick(name, link));

  return newCard;
}

export { createCard };
