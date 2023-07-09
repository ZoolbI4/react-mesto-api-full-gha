import React from "react";
function ImagePopup(props) {
    return (
      <div className={`popup popup_viewer" ${props.isOpen? 'popup_open' : ''}`} onClick={props.onCloseClick}>
        <div className="popup__content">
          <img className="popup__image" src={props.card ? props.card.link : ''} alt={props.card ? props.card.name : ''}/>
          <h2 className="popup__figcaption">{props.card ? props.card.name : ''}</h2>
          <button className="popup__close-btn" type="button" title="Закрыть" onClick={props.onClose}/>
        </div>
      </div>
    )
  }
  
  export default ImagePopup;