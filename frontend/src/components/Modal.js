import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{title}</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;