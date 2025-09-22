import React from 'react';

const Modal = ({ open, title, children, onClose, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button className="p-1 rounded hover:bg-gray-100" onClick={onClose}>✕</button>
        </div>
        <div className="p-4">
          {children}
        </div>
        {footer && (
          <div className="border-t px-4 py-3 flex justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

