import React from "react";
function PopupWithForm(props) {
  return (
    <div className={`popup popup_form_${props.name} ${props.isOpen ? `popup_open`: ""}`} onClick={props.onCloseClick}>
      <div className="popup__container">
        <form className="popup__form" name={props.form} onSubmit={props.onSubmit}>  
          <h2 className="popup__title">{props.title}</h2>
          {props.children}
          <button className="popup__save-btn" type="submit" title="Сохранить">{props.buttonText}</button>
        </form>
        <button className="popup__close-btn" type="button" title="Закрыть" onClick={props.onClose}/>
      </div>
    </div>
  )
}

export default PopupWithForm;
