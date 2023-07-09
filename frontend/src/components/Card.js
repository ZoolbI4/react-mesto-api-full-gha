import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = props.card.owner === currentUser._id;
  const isLiked = props.card.likes.some(i => i === currentUser._id);

  const cardDeleteButtonClassName = (
    `element__trash-btn ${isOwn ? 'element__trash-btn_visible' : ''}`
  );

  const cardLikeButtonClassName = (
    `element__like-btn ${isLiked ? 'element__like-active-btn' : ''}`
  );

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  return(
      <li className="element">
        <img className="element__photo" src={props.link} alt={props.name} title="Посмотреть в полном размере" onClick={handleClick}/>
        <button className={cardDeleteButtonClassName} type="button" title="Удалить" onClick={handleDeleteClick}/>
      <div className="element__caption">
          <h2 className="element__title">{props.name}</h2>
        <div className="element__like-container">
          <button className={cardLikeButtonClassName} type="button" title="Нравится" onClick={handleLikeClick}/>
          <p className="element__like-count">{props.likes}</p>
        </div>
      </div>
    </li>
  )
}

export default Card;